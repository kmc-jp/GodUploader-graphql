import { lazy } from "react";
import React from "react";
import { Route, Routes } from 'react-router';
import type { Location } from 'react-router';

import { Index } from "./pages/Index";
import { RecentArtworks } from "./pages/RecentArtworks";
import { RedirectFolderToArtwork } from "./pages/RedirectFolderToArtwork";
import { RedirectToMyPage } from "./pages/RedirectToMyPage";
import { TaggedArtworks } from "./pages/TaggedArtworks";
import { Tags } from "./pages/Tags";
import { UploadArtwork } from "./pages/UploadArtwork";
import { UserDetail } from "./pages/UserDetail";

const ArtworkDetail = lazy(
  () =>
    import(/* webpackChunkName: 'ArtworkDetail' */ "./pages/ArtworkDetail")
);
const TegakiDU = lazy(
  () => import(/* webpackChunkName: 'TegakiDU' */ "./pages/TegakiDU")
);
const NotFound = lazy(
  () => import(/* webpackChunkName: 'NotFound' */ "./pages/NotFound")
);

interface AppRoutesProps {
  location?: Partial<Location> | string;
}

export const AppRoutes: React.FC<AppRoutesProps> = ({ location }) => (
  <Routes location={location}>
    <Route path="/" element={<Index />} />
    <Route path="/users/:kmcid" element={<UserDetail />} />
    <Route path="/my" element={<RedirectToMyPage />} />
    <Route path="/artworks" element={<RecentArtworks />} />
    <Route path="/artwork/new" element={<UploadArtwork />} />
    <Route path="/artwork/:id" element={<ArtworkDetail />} />
    <Route path="/illust/:folder_id" element={<RedirectFolderToArtwork />} />
    <Route path="/tags" element={<Tags />} />
    <Route path="/tagged_artworks/:tag" element={<TaggedArtworks />} />
    <Route path="/tegaki" element={<TegakiDU />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);
