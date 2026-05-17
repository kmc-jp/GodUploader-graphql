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

  return (
    <ArtworkInformationProvider>
      <UpdateArtworkModal artworkKey={data.node} />
    </ArtworkInformationProvider>
  );
};

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

describe("UpdateArtworkModal", () => {
  it("モーダルは初期状態で非表示、「情報の編集」ボタンクリックで表示される", async () => {
    const { environment } = renderUpdateArtworkModal();
    resolveArtworkQuery(environment);

    await screen.findByRole("button", { name: "情報の編集" });
    expect(screen.queryByText("神絵の情報編集")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "情報の編集" }));

    expect(await screen.findByText("神絵の情報編集")).toBeInTheDocument();
  });

  it("フォームに値を入力して送信すると UpdateArtworkMutation が正しい変数で呼ばれる", async () => {
    const { environment } = renderUpdateArtworkModal();
    resolveArtworkQuery(environment);

    await screen.findByRole("button", { name: "情報の編集" });
    await userEvent.click(screen.getByRole("button", { name: "情報の編集" }));

    const titleInput = await screen.findByRole("textbox", { name: /タイトル/ });
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "新しいタイトル");

    const captionInput = screen.getByRole("textbox", { name: /キャプション/ });
    await userEvent.clear(captionInput);
    await userEvent.type(captionInput, "新しいキャプション");

    await userEvent.click(screen.getByRole("radio", { name: "R-18" }));

    await userEvent.click(screen.getByRole("button", { name: "保存する" }));

    await waitFor(() => {
      expect(environment.mock.getAllOperations().length).toBeGreaterThan(0);
    });

    act(() => {
      environment.mock.resolveMostRecentOperation((operation) => {
        expect(operation.request.variables).toMatchObject({
          input: {
            id: ARTWORK_ID,
            title: "新しいタイトル",
            caption: "新しいキャプション",
            rating: "r_18",
            tags: [],
          },
        });
        return MockPayloadGenerator.generate(operation);
      });
    });
  });

  it("モーダルを閉じると resetStates が呼ばれ、再オープン時に fragment の値が反映される", async () => {
    const { environment } = renderUpdateArtworkModal();
    resolveArtworkQuery(environment, { title: "既存のタイトル" });

    await screen.findByRole("button", { name: "情報の編集" });

    // Open then close to trigger resetStates
    await userEvent.click(screen.getByRole("button", { name: "情報の編集" }));
    await screen.findByText("神絵の情報編集");
    await userEvent.click(screen.getByRole("button", { name: "Close" }));

    await waitFor(() =>
      expect(screen.queryByText("神絵の情報編集")).not.toBeInTheDocument(),
    );

    // Re-open — title should now be populated from the fragment
    await userEvent.click(screen.getByRole("button", { name: "情報の編集" }));
    const titleInput = await screen.findByRole("textbox", { name: /タイトル/ });
    expect(titleInput).toHaveValue("既存のタイトル");
  });
});
