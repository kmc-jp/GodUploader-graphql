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

const renderUploadArtwork = () => {
  const environment = createMockEnvironment();

  // Auto-resolve all incoming queries with generated mock data.
  environment.mock.queueOperationResolver((operation) =>
    MockPayloadGenerator.generate(operation, {
      Account: () => ({ kmcid: "testuser" }),
      SlackChannel: () => ({ id: "C039TN7Q1", name: "graphics" }),
    }),
  );

  render(
    <MemoryRouter>
      <RelayEnvironmentProvider environment={environment}>
        <Suspense fallback={<div>Loading...</div>}>
          <UploadArtwork />
        </Suspense>
      </RelayEnvironmentProvider>
    </MemoryRouter>,
  );

  return { environment };
};

const attachFile = (file: File) => {
  const input = document.getElementById("file") as HTMLInputElement;
  fireEvent.change(input, { target: { files: [file] } });
};

const makeImageFile = (name = "test.png") =>
  new File(["(binary)"], name, { type: "image/png" });

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
    await screen.findByRole("button", { name: "アップロードする" });

    attachFile(makeImageFile("art.png"));
    await userEvent.type(
      screen.getByRole("textbox", { name: /タイトル/ }),
      "テスト作品",
    );
    await userEvent.type(
      screen.getByRole("textbox", { name: /キャプション/ }),
      "テストキャプション",
    );
    await userEvent.click(screen.getByRole("radio", { name: "全年齢" }));

    await userEvent.click(
      screen.getByRole("button", { name: "アップロードする" }),
    );

    await waitFor(() => {
      expect(environment.mock.getAllOperations().length).toBeGreaterThan(0);
    });

    act(() => {
      environment.mock.resolveMostRecentOperation((operation) => {
        expect(operation.request.variables).toMatchObject({
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
        return MockPayloadGenerator.generate(operation);
      });
    });
  });

  it("タグを追加すると mutation の tags に反映される", async () => {
    const { environment } = renderUploadArtwork();
    await screen.findByRole("button", { name: "アップロードする" });

    attachFile(makeImageFile());
    await userEvent.type(
      screen.getByRole("textbox", { name: /タイトル/ }),
      "タグテスト",
    );
    await userEvent.click(screen.getByRole("radio", { name: "全年齢" }));

    const tagsInput = document.getElementById("tags") as HTMLInputElement;
    await userEvent.type(tagsInput, "風景{Enter}");

    await userEvent.click(
      screen.getByRole("button", { name: "アップロードする" }),
    );

    await waitFor(() => {
      expect(environment.mock.getAllOperations().length).toBeGreaterThan(0);
    });

    act(() => {
      environment.mock.resolveMostRecentOperation((operation) => {
        expect(operation.request.variables).toMatchObject({
          input: {
            tags: ["風景"],
          },
        });
        return MockPayloadGenerator.generate(operation);
      });
    });
  });

  it("Slack通知をオンにして送信すると shareOption が SHARE_TO_SLACK_WITH_IMAGE になる", async () => {
    const { environment } = renderUploadArtwork();
    await screen.findByRole("button", { name: "アップロードする" });

    attachFile(makeImageFile());
    await userEvent.type(
      screen.getByRole("textbox", { name: /タイトル/ }),
      "Slack通知テスト",
    );
    await userEvent.click(screen.getByRole("radio", { name: "全年齢" }));

    // Enable Slack notification (showThumbnail defaults to true)
    await userEvent.click(
      screen.getByRole("checkbox", { name: /Slackに通知する/ }),
    );

    await userEvent.click(
      screen.getByRole("button", { name: "アップロードする" }),
    );

    await waitFor(() => {
      expect(environment.mock.getAllOperations().length).toBeGreaterThan(0);
    });

    act(() => {
      environment.mock.resolveMostRecentOperation((operation) => {
        expect(operation.request.variables).toMatchObject({
          input: {
            shareOption: "SHARE_TO_SLACK_WITH_IMAGE",
          },
        });
        return MockPayloadGenerator.generate(operation);
      });
    });
  });
});
