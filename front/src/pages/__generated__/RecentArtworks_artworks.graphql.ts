/**
 * @generated SignedSource<<cc65bd5c030c7e13859cd1fd67b507ab>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment, RefetchableFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type RecentArtworks_artworks$data = {
  readonly artworks: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly " $fragmentSpreads": FragmentRefs<"ArtworkListItem_artwork">;
      } | null;
    } | null>;
  } | null;
  readonly " $fragmentType": "RecentArtworks_artworks";
};
export type RecentArtworks_artworks = RecentArtworks_artworks$data;
export type RecentArtworks_artworks$key = {
  readonly " $data"?: RecentArtworks_artworks$data;
  readonly " $fragmentSpreads": FragmentRefs<"RecentArtworks_artworks">;
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
      "operation": require('./RecentArtworkListPaginationQuery.graphql')
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
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "ArtworkListItem_artwork"
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "__typename",
                  "storageKey": null
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

(node as any).hash = "e6db0821f3726ed002772ce16cb36d3c";

export default node;
