/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type RecentArtworks_artworks = {
    readonly artworks: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly " $fragmentRefs": FragmentRefs<"ArtworkListItem_artwork">;
            } | null;
        } | null>;
    } | null;
    readonly " $refType": "RecentArtworks_artworks";
};
export type RecentArtworks_artworks$data = RecentArtworks_artworks;
export type RecentArtworks_artworks$key = {
    readonly " $data"?: RecentArtworks_artworks$data;
    readonly " $fragmentRefs": FragmentRefs<"RecentArtworks_artworks">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [
    {
      "defaultValue": 40,
      "kind": "LocalArgument",
      "name": "count"
    },
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "cursor"
    },
    {
      "defaultValue": true,
      "kind": "LocalArgument",
      "name": "safeOnly"
    }
  ],
  "kind": "Fragment",
  "metadata": {
    "refetch": {
      "connection": null,
      "fragmentPathInResult": [],
      "operation": require('./RecentArtworkListPaginationQuery.graphql.ts')
    }
  },
  "name": "RecentArtworks_artworks",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 8
        },
        {
          "kind": "Variable",
          "name": "safeOnly",
          "variableName": "safeOnly"
        },
        {
          "kind": "Literal",
          "name": "sort",
          "value": [
            "CREATED_AT_DESC"
          ]
        }
      ],
      "concreteType": "ArtworkConnection",
      "kind": "LinkedField",
      "name": "artworks",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "ArtworkEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Artwork",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "ArtworkListItem_artwork"
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Query",
  "abstractKey": null
};
(node as any).hash = '9724d7bf8b6308b55161a01c8002f2e0';
export default node;
