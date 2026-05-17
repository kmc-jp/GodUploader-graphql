import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React, { Suspense } from "react";
import {
  graphql,
  RelayEnvironmentProvider,
  useLazyLoadQuery,
} from "react-relay";
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils";

import { ArtworkInformationProvider } from "../../contexts/ArtworkInformationContext";
import { UpdateArtworkModal } from "./UpdateArtworkForm";
import { UpdateArtworkFormTestRendererQuery } from "./__generated__/UpdateArtworkFormTestRendererQuery.graphql";

const testRendererQuery = graphql`
  query UpdateArtworkFormTestRendererQuery($id: ID!) {
    node(id: $id) {
      ... on Artwork {
        ...UpdateArtworkForm_artwork
      }
      id
    }
  }
`;

const ARTWORK_ID = btoa("Artwork:1");

const TestRenderer = () => {
  const data = useLazyLoadQuery<UpdateArtworkFormTestRendererQuery>(
    testRendererQuery,
    { id: ARTWORK_ID },
  );

  if (!data.node) return null;

  // タイトルと年齢制限に required があるため、初期値を設定して HTML5 バリデーションを通過させる
  return (
    <ArtworkInformationProvider
      initialTitle="既存のタイトル"
      initialAgeRestriction="SAFE"
    >
      <UpdateArtworkModal artworkKey={data.node} />
    </ArtworkInformationProvider>
  );
};

// ---------------------------------------------------------------------------
// ヘルパー
// ---------------------------------------------------------------------------

const renderUpdateArtworkModal = () => {
  const environment = createMockEnvironment();

  render(
    <RelayEnvironmentProvider environment={environment}>
      <Suspense fallback={<div>Loading...</div>}>
        <TestRenderer />
      </Suspense>
    </RelayEnvironmentProvider>,
  );

  return { environment };
};

/**
 * UpdateArtworkFormTestRendererQuery を解決してモーダルを描画可能にする。
 * artwork に追加フィールドを渡すとデフォルト値を上書きできる。
 */
const resolveArtworkQuery = (
  environment: ReturnType<typeof createMockEnvironment>,
  artwork: Record<string, unknown> = {},
) => {
  act(() => {
    environment.mock.resolveMostRecentOperation((operation) =>
      MockPayloadGenerator.generate(operation, {
        Artwork: () => ({
          id: ARTWORK_ID,
          title: "既存のタイトル",
          caption: "既存のキャプション",
          rating: "safe",
          tags: { edges: [] },
          ...artwork,
        }),
      }),
    );
  });
};

/** 「情報の編集」ボタンを押してモーダルを開く。 */
const openModal = async () => {
  const button = await screen.findByRole("button", { name: "情報の編集" });
  await userEvent.click(button);
};

/**
 * 「保存する」ボタンをクリックし、ミューテーションを解決してコールバック内で変数をアサートする。
 *
 * TagsInput 内の TagSuggestion が発行する TagsInputQuery は、React の遅延 Suspense
 * レンダリングによりミューテーションより後に pendingOperations へ積まれる場合がある。
 * そのため、クエリ系オペレーションを先にすべて解決してからミューテーションを解決する。
 */
const saveAndResolve = async (
  environment: ReturnType<typeof createMockEnvironment>,
  assertVariables: (variables: Record<string, unknown>) => void,
) => {
  await userEvent.click(screen.getByRole("button", { name: "保存する" }));
  await waitFor(() =>
    expect(environment.mock.getAllOperations().length).toBeGreaterThan(0),
  );
  act(() => {
    // query 系オペレーション（TagsInputQuery 等）が末尾にある場合は先に解決する
    let ops = environment.mock.getAllOperations();
    while (
      ops.length > 0 &&
      ops[ops.length - 1].request.node.params.operationKind !== "mutation"
    ) {
      environment.mock.resolveMostRecentOperation((op) =>
        MockPayloadGenerator.generate(op),
      );
      ops = environment.mock.getAllOperations();
    }
    // ミューテーションを解決して変数をアサートする
    environment.mock.resolveMostRecentOperation((operation) => {
      assertVariables(operation.request.variables as Record<string, unknown>);
      return MockPayloadGenerator.generate(operation);
    });
  });
};

// ---------------------------------------------------------------------------
// テスト
// ---------------------------------------------------------------------------

describe("UpdateArtworkModal", () => {
  it("モーダルは初期状態で非表示、「情報の編集」ボタンクリックで表示される", async () => {
    const { environment } = renderUpdateArtworkModal();
    resolveArtworkQuery(environment);

    await screen.findByRole("button", { name: "情報の編集" });
    expect(screen.queryByText("神絵の情報編集")).not.toBeInTheDocument();

    await openModal();

    expect(await screen.findByText("神絵の情報編集")).toBeInTheDocument();
  });

  it("フォームに値を入力して送信すると UpdateArtworkMutation が正しい変数で呼ばれる", async () => {
    const { environment } = renderUpdateArtworkModal();
    resolveArtworkQuery(environment);

    await openModal();

    const titleInput = await screen.findByRole("textbox", { name: /タイトル/ });
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "新しいタイトル");

    const captionInput = screen.getByRole("textbox", { name: /キャプション/ });
    await userEvent.clear(captionInput);
    await userEvent.type(captionInput, "新しいキャプション");

    await userEvent.click(screen.getByRole("radio", { name: "R-18" }));

    await saveAndResolve(environment, (vars) => {
      expect(vars).toMatchObject({
        input: {
          id: ARTWORK_ID,
          title: "新しいタイトル",
          caption: "新しいキャプション",
          rating: "r_18",
          tags: [],
        },
      });
    });
  });

  it("タグを追加すると mutation の tags に反映される", async () => {
    const { environment } = renderUpdateArtworkModal();
    resolveArtworkQuery(environment);

    await openModal();

    const tagsInput = document.getElementById("tags") as HTMLInputElement;
    await userEvent.type(tagsInput, "風景{Enter}");

    await saveAndResolve(environment, (vars) => {
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
        const { environment } = renderUpdateArtworkModal();
        resolveArtworkQuery(environment);

        await openModal();
        await userEvent.click(screen.getByRole("radio", { name: label }));

        await saveAndResolve(environment, (vars) => {
          expect(vars).toMatchObject({ input: { rating: expectedRating } });
        });
      },
    );
  });

  // -------------------------------------------------------------------------
  // 再オープン時の初期値（resetStates）
  // -------------------------------------------------------------------------

  it("モーダルを閉じると resetStates が呼ばれ、再オープン時に fragment の値が反映される", async () => {
    const { environment } = renderUpdateArtworkModal();
    resolveArtworkQuery(environment, { title: "既存のタイトル" });

    // 一度開いて閉じることで resetStates を発火させる
    await openModal();
    await screen.findByText("神絵の情報編集");
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() =>
      expect(screen.queryByText("神絵の情報編集")).not.toBeInTheDocument(),
    );

    // 再オープン時はフラグメントの値がフォームに反映されている
    await openModal();
    const titleInput = await screen.findByRole("textbox", { name: /タイトル/ });
    expect(titleInput).toHaveValue("既存のタイトル");
  });

  it("既存タグを持つ作品を再オープンすると tags に反映されて mutation に含まれる", async () => {
    const { environment } = renderUpdateArtworkModal();
    resolveArtworkQuery(environment, {
      tags: {
        edges: [{ node: { name: "既存タグ" } }],
      },
    });

    // 開いて閉じる → resetStates でタグがフラグメントから復元される
    await openModal();
    await screen.findByText("神絵の情報編集");
    await userEvent.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() =>
      expect(screen.queryByText("神絵の情報編集")).not.toBeInTheDocument(),
    );

    // 再オープンして保存する
    await openModal();
    await screen.findByText("神絵の情報編集");

    await saveAndResolve(environment, (vars) => {
      expect(vars).toMatchObject({ input: { tags: ["既存タグ"] } });
    });
  });
});
