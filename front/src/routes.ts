import { lazy } from "react";
import { RouteConfig } from "react-router-config";

import { Index } from "./pages/Index";
import { RecentArtworks } from "./pages/RecentArtworks";
import { RedirectFolderToArtwork } from "./pages/RedirectFolderToArtwork";
import { RedirectToMyPage } from "./pages/RedirectToMyPage";
import { TaggedArtworks } from "./pages/TaggedArtworks";
import { Tags } from "./pages/Tags";
import { UploadArtwork } from "./pages/UploadArtwork";
import { UserDetail } from "./pages/UserDetail";

export const routes: RouteConfig[] = [
  {
    path: "/",
    exact: true,
    component: Index,
  },
  {
    path: "/users/:kmcid",
    component: UserDetail,
  },
  {
    path: "/my",
    component: RedirectToMyPage,
  },
  {
    path: "/artworks",
    component: RecentArtworks,
  },
  {
    path: "/artwork/new",
    component: UploadArtwork,
  },
  {
    path: "/artwork/:id",
    component: lazy(
      () =>
        import(/* webpackChunkName: 'ArtworkDetail' */ "./pages/ArtworkDetail")
    ),
  },
  {
    path: "/illust/:folder_id",
    component: RedirectFolderToArtwork,
  },
  {
    path: "/tags",
    component: Tags,
  },
  {
    path: "/tagged_artworks/:tag",
    component: TaggedArtworks,
  },
  {
    path: "/tegaki",
    component: lazy(
      () => import(/* webpackChunkName: 'TegakiDU' */ "./pages/TegakiDU")
    ),
  },
  {
    path: "*",
    component: lazy(
      () => import(/* webpackChunkName: 'NotFound' */ "./pages/NotFound")
    ),
  },
];
