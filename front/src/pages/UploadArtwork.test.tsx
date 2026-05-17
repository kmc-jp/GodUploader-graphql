import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { Suspense } from "react";
import { RelayEnvironmentProvider } from "react-relay";
import { MemoryRouter } from "react-router";
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils";

import { UploadArtwork } from "./UploadArtwork";

// ---------------------------------------------------------------------------
// フィクスチャ
// ---------------------------------------------------------------------------

const SINGLE_CHANNEL = [{ id: "C039TN7Q1", name: "graphics" }];

const TWO_CHANNELS = [
  { id: "C039TN7Q1", name: "graphics" },
  { id: "C039TN7Q2", name: "general" },
];

// ---------------------------------------------------------------------------
// ヘルパー
// ---------------------------------------------------------------------------

const renderUploadArtwork = (
  channels: Array<{ id: string; name: string }> = SINGLE_CHANNEL,
) => {
  const environment = createMockEnvironment();

  // SlackChannelInputQuery 以外のクエリは自動解決する。
  // SlackChannelInputQuery はペンディングのままにしておき、各テストが
  // 適切なタイミング（ChannelRows マウント前）で明示的に解決する。
  // これにより、usePreloadedQuery がオブザーバブルの emit より後に
  // サブスクライブするレースコンディションを回避できる。
  environment.mock.queueOperationResolver((operation) => {
    if (operation.request.node.params.name === "SlackChannelInputQuery") {
      return null;
    }
    return MockPayloadGenerator.generate(operation, {
      Account: () => ({ kmcid: "testuser" }),
    });
  });

  render(
    <MemoryRouter>
      <RelayEnvironmentProvider environment={environment}>
        <Suspense fallback={<div>Loading...</div>}>
          <UploadArtwork />
        </Suspense>
      </RelayEnvironmentProvider>
    </MemoryRouter>,
  );

  return { environment, channels };
};

/**
 * ペンディング中の SlackChannelInputQuery を解決して ChannelRows を描画可能にする。
 * setupForm() の後、Slack 通知チェックボックスを有効にする前に呼ぶこと。
 * こうすることで usePreloadedQuery が初めて読み取るときに
 * Relay ストアにデータが存在する状態になる。
 */
const resolveSlackChannels = (
  environment: ReturnType<typeof createMockEnvironment>,
  channels: Array<{ id: string; name: string }>,
) => {
  act(() => {
    environment.mock.resolveMostRecentOperation(() => ({
      data: { allSlackChannels: channels },
    }));
  });
};

/** 非表示のファイル入力にファイルを添付する。 */
const attachFile = (file: File) => {
  const input = document.getElementById("file") as HTMLInputElement;
  fireEvent.change(input, { target: { files: [file] } });
};

const makeImageFile = (name = "test.png") =>
  new File(["(binary)"], name, { type: "image/png" });

/**
 * フォームの読み込み（Suspense 解決）を待ち、ファイル添付・タイトル入力・
 * 年齢制限選択を行う。送信に最低限必要な操作をまとめたヘルパー。
 */
const setupForm = async ({
  title = "テスト作品",
  ageRestriction = "全年齢",
}: {
  title?: string;
  ageRestriction?: string;
} = {}) => {
  await screen.findByRole("button", { name: "アップロードする" });
  attachFile(makeImageFile());
  await userEvent.type(
    screen.getByRole("textbox", { name: /タイトル/ }),
    title,
  );
  await userEvent.click(screen.getByRole("radio", { name: ageRestriction }));
};

/**
 * 送信ボタンをクリックし、ミューテーションがキューに積まれるのを待ってから
 * 解決する。コールバック内で mutation の変数をアサートできる。
 */
const submitAndResolve = async (
  environment: ReturnType<typeof createMockEnvironment>,
  assertVariables: (variables: Record<string, unknown>) => void,
) => {
  await userEvent.click(
    screen.getByRole("button", { name: "アップロードする" }),
  );
  await waitFor(() =>
    expect(environment.mock.getAllOperations().length).toBeGreaterThan(0),
  );
  act(() => {
    environment.mock.resolveMostRecentOperation((operation) => {
      assertVariables(operation.request.variables as Record<string, unknown>);
      return MockPayloadGenerator.generate(operation);
    });
  });
};

// ---------------------------------------------------------------------------
// テスト
// ---------------------------------------------------------------------------

describe("UploadArtwork", () => {
  it("ファイルが選択されていない場合、送信ボタンが無効", async () => {
    renderUploadArtwork();
    const button = await screen.findByRole("button", {
      name: "アップロードする",
    });
    expect(button).toBeDisabled();
  });

  it("ファイル添付・フォーム入力後に送信すると UploadArtworkMutation が正しい変数で呼ばれる", async () => {
    const { environment } = renderUploadArtwork();
    await setupForm();
    await userEvent.type(
      screen.getByRole("textbox", { name: /キャプション/ }),
      "テストキャプション",
    );

    await submitAndResolve(environment, (vars) => {
      expect(vars).toMatchObject({
        input: {
          title: "テスト作品",
          caption: "テストキャプション",
          rating: "safe",
          tags: [],
          files: [null],
          shareOption: "NONE",
          twitterShareOption: { share: false },
          channelIds: ["C039TN7Q1"],
        },
        connections: [],
      });
    });
  });

  it("タグを追加すると mutation の tags に反映される", async () => {
    const { environment } = renderUploadArtwork();
    await setupForm();

    const tagsInput = document.getElementById("tags") as HTMLInputElement;
    await userEvent.type(tagsInput, "風景{Enter}");

    await submitAndResolve(environment, (vars) => {
      expect(vars).toMatchObject({ input: { tags: ["風景"] } });
    });
  });

  // -------------------------------------------------------------------------
  // 年齢制限
  // -------------------------------------------------------------------------

  describe("年齢制限", () => {
    it.each([
      ["全年齢", "safe"],
      ["R-18", "r_18"],
      ["R-18G", "r_18g"],
    ])(
      "「%s」を選択して送信すると rating が %s になる",
      async (label, expectedRating) => {
        const { environment } = renderUploadArtwork();
        await setupForm({ ageRestriction: label });

        await submitAndResolve(environment, (vars) => {
          expect(vars).toMatchObject({ input: { rating: expectedRating } });
        });
      },
    );

    it.each(["R-18", "R-18G"])(
      "「%s」選択時は Twitter チェックボックスが無効になり警告メッセージが表示される",
      async (label) => {
        renderUploadArtwork();
        await screen.findByRole("button", { name: "アップロードする" });

        await userEvent.click(screen.getByRole("radio", { name: label }));

        // Twitter チェックボックスが無効になる
        expect(
          screen.getByRole("checkbox", { name: /Twitterにも投稿する/ }),
        ).toBeDisabled();

        // 警告メッセージが表示される
        expect(
          screen.getByText(
            "年齢制限のある作品をTwitterに共有することはできません",
          ),
        ).toBeInTheDocument();
      },
    );

    it("全年齢に切り替えると Twitter チェックボックスが有効になる", async () => {
      renderUploadArtwork();
      await screen.findByRole("button", { name: "アップロードする" });

      // まず R-18 を選択
      await userEvent.click(screen.getByRole("radio", { name: "R-18" }));
      expect(
        screen.getByRole("checkbox", { name: /Twitterにも投稿する/ }),
      ).toBeDisabled();

      // 全年齢に戻す
      await userEvent.click(screen.getByRole("radio", { name: "全年齢" }));
      expect(
        screen.getByRole("checkbox", { name: /Twitterにも投稿する/ }),
      ).not.toBeDisabled();

      // 警告メッセージが消える
      expect(
        screen.queryByText(
          "年齢制限のある作品をTwitterに共有することはできません",
        ),
      ).not.toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  // Slack チャンネル
  // -------------------------------------------------------------------------

  describe("Slack チャンネル", () => {
    it("Slack通知オン・デフォルト設定（サムネイルあり）で shareOption が SHARE_TO_SLACK_WITH_IMAGE になる", async () => {
      const { environment } = renderUploadArtwork();
      await setupForm();

      await userEvent.click(
        screen.getByRole("checkbox", { name: /Slackに通知する/ }),
      );

      await submitAndResolve(environment, (vars) => {
        expect(vars).toMatchObject({
          input: { shareOption: "SHARE_TO_SLACK_WITH_IMAGE" },
        });
      });
    });

    it("Slack通知オンでサムネイルのチェックを外すと shareOption が SHARE_TO_SLACK になる", async () => {
      const { environment } = renderUploadArtwork();
      await setupForm();

      await userEvent.click(
        screen.getByRole("checkbox", { name: /Slackに通知する/ }),
      );

      // Slack 有効時はサムネイルチェックボックスが活性化するので外す
      const thumbnailCheckbox = screen.getByRole("checkbox", {
        name: /サムネイルを表示する/,
      });
      expect(thumbnailCheckbox).not.toBeDisabled();
      await userEvent.click(thumbnailCheckbox);

      await submitAndResolve(environment, (vars) => {
        expect(vars).toMatchObject({
          input: { shareOption: "SHARE_TO_SLACK" },
        });
      });
    });

    it("Slack通知がオフのときサムネイルチェックボックスは無効", async () => {
      renderUploadArtwork();
      await screen.findByRole("button", { name: "アップロードする" });

      expect(
        screen.getByRole("checkbox", { name: /サムネイルを表示する/ }),
      ).toBeDisabled();
    });

    it("複数の Slack チャンネルを指定して送信できる", async () => {
      const { environment, channels } = renderUploadArtwork(TWO_CHANNELS);
      await setupForm();

      // Slack を有効にする前にクエリを解決しておく。
      // こうすることで ChannelRows が最初に描画されたとき
      // usePreloadedQuery がストアからデータを読み取れる。
      resolveSlackChannels(environment, channels);

      await userEvent.click(
        screen.getByRole("checkbox", { name: /Slackに通知する/ }),
      );

      // 2つ目のチャンネル行を追加する
      await userEvent.click(
        await screen.findByRole("button", { name: "チャンネルを追加" }),
      );

      // 2つ目の <select> には "general" のみが選択肢として表示される（graphics は使用済み）
      const selects = document.querySelectorAll("select");
      expect(selects).toHaveLength(2);
      fireEvent.change(selects[1], { target: { value: "C039TN7Q2" } });

      await submitAndResolve(environment, (vars) => {
        expect(vars).toMatchObject({
          input: { channelIds: ["C039TN7Q1", "C039TN7Q2"] },
        });
      });
    });

    it("チャンネルを追加したあと削除して送信できる", async () => {
      const { environment, channels } = renderUploadArtwork(TWO_CHANNELS);
      await setupForm();

      // Slack を有効にする前にクエリを解決して ChannelRows がストアを読めるようにする
      resolveSlackChannels(environment, channels);

      await userEvent.click(
        screen.getByRole("checkbox", { name: /Slackに通知する/ }),
      );

      // 2つ目のチャンネルを追加して選択する
      await userEvent.click(
        await screen.findByRole("button", { name: "チャンネルを追加" }),
      );
      const selects = document.querySelectorAll("select");
      fireEvent.change(selects[1], { target: { value: "C039TN7Q2" } });

      // 削除ボタンが2つ表示される
      const deleteBtns = screen.getAllByRole("button", {
        name: "チャンネルを削除",
      });
      expect(deleteBtns).toHaveLength(2);

      // 2つ目のチャンネルを削除する
      await userEvent.click(deleteBtns[1]);

      // チャンネル行が1つに戻り削除ボタンも消える
      expect(
        screen.queryAllByRole("button", { name: "チャンネルを削除" }),
      ).toHaveLength(0);

      await submitAndResolve(environment, (vars) => {
        expect(vars).toMatchObject({
          input: { channelIds: ["C039TN7Q1"] },
        });
      });
    });
  });
});
