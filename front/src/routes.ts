import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("./pages/Index.tsx"),
  route("/users/:kmcid", "./pages/UserDetail.tsx"),
  route("/my", "./pages/RedirectToMyPage.tsx"),
  route("/artworks", "./pages/RecentArtworks.tsx"),
  route("/artwork/new", "./pages/UploadArtwork.tsx"),
  route("/artwork/:id", "./pages/ArtworkDetail.tsx"),
  route("/illust/:folder_id", "./pages/RedirectFolderToArtwork.tsx"),
  route("/tags", "./pages/Tags.tsx"),
  route("/tagged_artworks/:tag", "./pages/TaggedArtworks.tsx"),
  route("/tegaki", "./pages/TegakiDU.tsx"),
  route("*", "./pages/NotFound.tsx"),
] satisfies RouteConfig;
