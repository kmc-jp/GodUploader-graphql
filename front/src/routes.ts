import { lazy } from "react";
import { loadQuery } from "react-relay";

import { ArtworkDetail } from "./pages/ArtworkDetail";
import { Index } from "./pages/Index";
import { RedirectFolderToArtwork } from "./pages/RedirectFolderToArtwork";
import { RedirectToMyPage } from "./pages/RedirectToMyPage";
import { TaggedArtworks } from "./pages/TaggedArtworks";
import { Tags } from "./pages/Tags";
import { UploadArtwork } from "./pages/UploadArtwork";
import { UserDetail } from "./pages/UserDetail";
import ArtworkDetailQuery from "./pages/__generated__/ArtworkDetailQuery.graphql";
import IndexQuery from "./pages/__generated__/IndexQuery.graphql";
import RedirectFolderToArtworkQuery from "./pages/__generated__/RedirectFolderToArtworkQuery.graphql";
import RedirectToMyPageQuery from "./pages/__generated__/RedirectToMyPageQuery.graphql";
import TaggedArtworksQuery from "./pages/__generated__/TaggedArtworksQuery.graphql";
import TagsQuery from "./pages/__generated__/TagsQuery.graphql";
import UserDetailQuery from "./pages/__generated__/UserDetailQuery.graphql";
import { RouteConfig } from "./router/renderRoutes";

export const routes: RouteConfig[] = [
  {
    path: "/",
    exact: true,
    component: Index,
    prepare: ({ environment }) => ({
      indexQuery: loadQuery(
        environment,
        IndexQuery,
        {},
        { fetchPolicy: "store-and-network" }
      ),
    }),
  },
  {
    path: "/users/:kmcid",
    component: UserDetail,
    prepare: ({ params, environment }) => ({
      userDetailQuery: loadQuery(
        environment,
        UserDetailQuery,
        { kmcid: params.kmcid },
        { fetchPolicy: "store-and-network" }
      ),
    }),
  },
  {
    path: "/my",
    component: RedirectToMyPage,
    prepare: ({ environment }) => ({
      viewer: loadQuery(
        environment,
        RedirectToMyPageQuery,
        {},
        { fetchPolicy: "store-or-network" }
      ),
    }),
  },
  {
    path: "/artwork/new",
    component: UploadArtwork,
  },
  {
    path: "/artwork/:id",
    component: ArtworkDetail,
    prepare: ({ params, environment }) => ({
      artworkDetailQuery: loadQuery(
        environment,
        ArtworkDetailQuery,
        { id: params.id },
        { fetchPolicy: "store-or-network" }
      ),
    }),
  },
  {
    path: "/illust/:folder_id",
    component: RedirectFolderToArtwork,
    prepare: ({ params, environment }) => ({
      redirectFolderToArtworkQuery: loadQuery(
        environment,
        RedirectFolderToArtworkQuery,
        { folderId: params.folder_id },
        { fetchPolicy: "store-or-network" }
      ),
    }),
  },
  {
    path: "/tags",
    component: Tags,
    prepare: ({ environment }) => ({
      tagsQuery: loadQuery(
        environment,
        TagsQuery,
        {},
        { fetchPolicy: "store-and-network" }
      ),
    }),
  },
  {
    path: "/tagged_artworks/:tag",
    component: TaggedArtworks,
    prepare: ({ params, environment }) => ({
      taggedArtworksQuery: loadQuery(
        environment,
        TaggedArtworksQuery,
        { tag: params.tag },
        { fetchPolicy: "store-and-network" }
      ),
    }),
  },
  {
    path: "/tegaki",
    component: lazy(() => import("./pages/TegakiDU")),
  },
];
