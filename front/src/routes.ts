import { loadQuery } from "react-relay";
import App from "./App";
import { Index, indexQuery } from "./pages/Index";
import { ArtworkDetail, artworkDetailQuery } from "./pages/ArtworkDetail";
import { TaggedArtworks, taggedArtworksQuery } from "./pages/TaggedArtworks";
import { UserDetail, userDetailQuery } from "./pages/UserDetail";
import { RouteConfig } from "./routing";
import { UploadArtwork } from "./pages/UploadArtwork";

export const routes: RouteConfig[] = [
  {
    component: App,
    routes: [
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
        path: "/user/:kmcid",
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
    ],
  },
];
