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



const node: ReaderFragment = (function(){
var v0 = [
  "artworks"
];
return {
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
    "connection": [
      {
        "count": "count",
        "cursor": "cursor",
        "direction": "forward",
        "path": (v0/*: any*/)
      }
    ],
    "refetch": {
      "connection": {
        "forward": {
          "count": "count",
          "cursor": "cursor"
        },
        "backward": null,
        "path": (v0/*: any*/)
      },
      "fragmentPathInResult": [],
      "operation": require('./RecentArtworkListPaginationQuery.graphql.ts')
    }
  },
  "name": "RecentArtworks_artworks",
  "selections": [
    {
      "alias": "artworks",
      "args": [
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
      "name": "__RecentArtworks_artworks_connection",
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
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "__typename",
                  "storageKey": null
                },
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "ArtworkListItem_artwork"
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "cursor",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "PageInfo",
          "kind": "LinkedField",
          "name": "pageInfo",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "endCursor",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "hasNextPage",
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
})();
(node as any).hash = '0337ac8fd74b57dc06b1ba85a11624ea';
export default node;
