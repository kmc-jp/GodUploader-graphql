/**
 * @generated SignedSource<<d5e0833f53386ab056ff1a865b2fb67f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ArtworkRatingEnum = "safe" | "r_18" | "r_18g" | "%future added value";
export type RecentArtworkListPaginationQuery$variables = {
  count?: number | null;
  cursor?: string | null;
  rating?: ReadonlyArray<ArtworkRatingEnum> | null;
};
export type RecentArtworkListPaginationQueryVariables = RecentArtworkListPaginationQuery$variables;
export type RecentArtworkListPaginationQuery$data = {
  readonly " $fragmentSpreads": FragmentRefs<"RecentArtworks_artworks">;
};
export type RecentArtworkListPaginationQueryResponse = RecentArtworkListPaginationQuery$data;
export type RecentArtworkListPaginationQuery = {
  variables: RecentArtworkListPaginationQueryVariables;
  response: RecentArtworkListPaginationQuery$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
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
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "rating"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "cursor"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count"
  },
  {
    "kind": "Variable",
    "name": "rating",
    "variableName": "rating"
  },
  {
    "kind": "Literal",
    "name": "sort",
    "value": [
      "CREATED_AT_DESC"
    ]
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RecentArtworkListPaginationQuery",
    "selections": [
      {
        "args": [
          {
            "kind": "Variable",
            "name": "count",
            "variableName": "count"
          },
          {
            "kind": "Variable",
            "name": "cursor",
            "variableName": "cursor"
          }
        ],
        "kind": "FragmentSpread",
        "name": "RecentArtworks_artworks"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RecentArtworkListPaginationQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
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
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "title",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "caption",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "nsfw",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Illust",
                    "kind": "LinkedField",
                    "name": "topIllust",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "thumbnailUrl",
                        "storageKey": null
                      },
                      (v2/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Account",
                    "kind": "LinkedField",
                    "name": "account",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "name",
                        "storageKey": null
                      },
                      (v2/*: any*/)
                    ],
                    "storageKey": null
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
      },
      {
        "alias": null,
        "args": (v1/*: any*/),
        "filters": [
          "sort",
          "rating"
        ],
        "handle": "connection",
        "key": "RecentArtworks_artworks",
        "kind": "LinkedHandle",
        "name": "artworks"
      }
    ]
  },
  "params": {
    "cacheID": "613394103cb23a71fd0bc87f79d97ef9",
    "id": null,
    "metadata": {},
    "name": "RecentArtworkListPaginationQuery",
    "operationKind": "query",
    "text": "query RecentArtworkListPaginationQuery(\n  $count: Int = 40\n  $cursor: String\n  $rating: [ArtworkRatingEnum!]\n) {\n  ...RecentArtworks_artworks_1G22uz\n}\n\nfragment ArtworkListItem_artwork on Artwork {\n  id\n  title\n  caption\n  nsfw\n  topIllust {\n    thumbnailUrl\n    id\n  }\n  account {\n    name\n    id\n  }\n}\n\nfragment RecentArtworks_artworks_1G22uz on Query {\n  artworks(first: $count, after: $cursor, sort: [CREATED_AT_DESC], rating: $rating) {\n    edges {\n      node {\n        ...ArtworkListItem_artwork\n        id\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "1b159a6ec54b3d298fedc3caafae6001";

export default node;
