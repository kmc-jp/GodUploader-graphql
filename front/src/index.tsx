import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { createRoot } from "react-dom/client";
import { loadQuery } from "react-relay";
import { RelayEnvironmentProvider } from "react-relay/hooks";
import { RouterProvider, createBrowserRouter, redirect } from "react-router";

import { App } from "./App";
import RelayEnvironment from "./RelayEnvironment";
import ArtworkDetail, { loader as artworkDetailLoader } from "./pages/ArtworkDetail";
import { Index, indexQuery } from "./pages/Index";
import {
  RecentArtworks,
  recentArtworksQuery,
  modeToRating,
} from "./pages/RecentArtworks";
import { loader as redirectFolderToArtworkLoader } from "./pages/RedirectFolderToArtwork";
import { loader as redirectToMyPageLoader } from "./pages/RedirectToMyPage";
import { TaggedArtworks, taggedArtworksQuery } from "./pages/TaggedArtworks";
import { Tags, tagsQuery } from "./pages/Tags";
import { UploadArtwork, uploadArtworkQuery } from "./pages/UploadArtwork";
import { UserDetail, userDetailQuery } from "./pages/UserDetail";

async function enableMocking() {
  if (import.meta.env.VITE_USE_MSW !== "1") return;
  const { worker } = await import("./mocks/browser");
  return worker.start({ onUnhandledRequest: "warn" });
}

// ルーティング定義よりも先にMSWの設定が完了しないと、うまくリクエストがモックされない
await enableMocking();

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: "/",
        loader: () =>
          loadQuery(
            RelayEnvironment,
            indexQuery,
            {},
            { fetchPolicy: "store-and-network" },
          ),
        Component: Index,
      },
      {
        path: "/users/:kmcid",
        loader: ({ params }) =>
          loadQuery(
            RelayEnvironment,
            userDetailQuery,
            { kmcid: params.kmcid! },
            { fetchPolicy: "store-and-network" },
          ),
        Component: UserDetail,
      },
      {
        path: "/my",
        loader: redirectToMyPageLoader,
      },
      {
        path: "/artworks",
        loader: ({ request }) => {
          const mode = new URL(request.url).searchParams.get("mode");
          const rating = modeToRating(mode);
          return loadQuery(
            RelayEnvironment,
            recentArtworksQuery,
            { rating },
            { fetchPolicy: "store-and-network" },
          );
        },
        Component: RecentArtworks,
      },
      {
        path: "/artwork/new",
        loader: () =>
          loadQuery(
            RelayEnvironment,
            uploadArtworkQuery,
            {},
            { fetchPolicy: "store-or-network" },
          ),
        Component: UploadArtwork,
      },
      {
        path: "/artwork/:id",
        loader: artworkDetailLoader,
        Component: ArtworkDetail,
      },
      {
        path: "/illust/:folder_id",
        loader: redirectFolderToArtworkLoader,
      },
      {
        path: "/tags",
        loader: () =>
          loadQuery(
            RelayEnvironment,
            tagsQuery,
            {},
            { fetchPolicy: "store-and-network" },
          ),
        Component: Tags,
      },
      {
        path: "/tagged_artworks/:tag",
        loader: ({ params }) => {
          const tag = decodeURIComponent(params.tag!);
          if (tag === "R-18") return redirect("/artworks?mode=r_18");
          if (tag === "R-18G") return redirect("/artworks?mode=r_18");
          return loadQuery(
            RelayEnvironment,
            taggedArtworksQuery,
            { tag },
            { fetchPolicy: "store-and-network" },
          );
        },
        Component: TaggedArtworks,
      },
      {
        path: "/tegaki",
        lazy: async () => {
          const { default: Component } = await import(
            /* webpackChunkName: 'TegakiDU' */ "./pages/TegakiDU"
          );
          return { Component };
        },
      },
      {
        path: "*",
        lazy: async () => {
          const { default: Component } = await import(
            /* webpackChunkName: 'NotFound' */ "./pages/NotFound"
          );
          return { Component };
        },
      },
    ],
  },
]);

const root = createRoot(document.getElementById("root")!);
root.render(
  <RelayEnvironmentProvider environment={RelayEnvironment}>
    <RouterProvider router={router} />
  </RelayEnvironmentProvider>,
);
