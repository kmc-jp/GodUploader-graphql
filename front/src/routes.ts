import { loadQuery } from "react-relay";

import { ArtworkDetail, artworkDetailQuery } from "./pages/ArtworkDetail";
import { Index, indexQuery } from "./pages/Index";
import {
  RedirectFolderToArtwork,
  redirectFolderToArtworkQuery,
} from "./pages/RedirectFolderToArtwork";
import {
  redirectToMyPageQuery,
  RedirectToMyPage,
} from "./pages/RedirectToMyPage";
import { TaggedArtworks, taggedArtworksQuery } from "./pages/TaggedArtworks";
import { Tags, tagsQuery } from "./pages/Tags";
import { TegakiDU } from "./pages/TegakiDU";
import { UploadArtwork } from "./pages/UploadArtwork";
import { UserDetail, userDetailQuery } from "./pages/UserDetail";
import { RouteConfig } from "./routing";

export const routes: RouteConfig[] = [
  {
    path: "/",
    exact: true,
    component: Index,
    prepare: ({ environment }) => ({
      indexQuery: loadQuery(
        environment,
        indexQuery,
        {},
        { fetchPolicy: "store-or-network" }
      ),
    }),
  },
  {
    path: "/users/:kmcid",
    component: UserDetail,
    prepare: ({ params, environment }) => ({
      userDetailQuery: loadQuery(
        environment,
        userDetailQuery,
        { kmcid: params.kmcid },
        { fetchPolicy: "store-or-network" }
      ),
    }),
  },
  {
    path: "/my",
    component: RedirectToMyPage,
    prepare: ({ environment }) => ({
      viewer: loadQuery(
        environment,
        redirectToMyPageQuery,
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
        artworkDetailQuery,
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
        redirectFolderToArtworkQuery,
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
        tagsQuery,
        {},
        { fetchPolicy: "store-or-network" }
      ),
    }),
  },
  {
    path: "/tagged_artworks/:tag",
    component: TaggedArtworks,
    prepare: ({ params, environment }) => ({
      taggedArtworksQuery: loadQuery(
        environment,
        taggedArtworksQuery,
        { tag: params.tag },
        { fetchPolicy: "store-or-network" }
      ),
    }),
  },
  {
    path: "/tegaki",
    component: TegakiDU,
  },
];
