/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type RecentArtworksQueryVariables = {};
export type RecentArtworksQueryResponse = {
    readonly " $fragmentRefs": FragmentRefs<"RecentArtworks_artworks">;
};
export type RecentArtworksQuery = {
    readonly response: RecentArtworksQueryResponse;
    readonly variables: RecentArtworksQueryVariables;
};



/*
query RecentArtworksQuery {
  ...RecentArtworks_artworks
}

fragment ArtworkListItem_artwork on Artwork {
  id
  title
  caption
  nsfw
  topIllust {
    thumbnailUrl
    id
  }
  account {
    name
    id
  }
}

fragment RecentArtworks_artworks on Query {
  artworks(first: 40, sort: [CREATED_AT_DESC], safeOnly: true) {
    edges {
      node {
        ...ArtworkListItem_artwork
        id
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 40
  },
  {
    "kind": "Literal",
    "name": "safeOnly",
    "value": true
  },
  {
    "kind": "Literal",
    "name": "sort",
    "value": [
      "CREATED_AT_DESC"
    ]
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "RecentArtworksQuery",
    "selections": [
      {
        "args": null,
        "kind": "FragmentSpread",
        "name": "RecentArtworks_artworks"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "RecentArtworksQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
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
                  (v1/*: any*/),
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
                      (v1/*: any*/)
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
                      (v1/*: any*/)
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
        "storageKey": "artworks(first:40,safeOnly:true,sort:[\"CREATED_AT_DESC\"])"
      },
      {
        "alias": null,
        "args": (v0/*: any*/),
        "filters": [
          "sort",
          "safeOnly"
        ],
        "handle": "connection",
        "key": "RecentArtworks_artworks",
        "kind": "LinkedHandle",
        "name": "artworks"
      }
    ]
  },
  "params": {
    "cacheID": "7514bc108454aa274af73b0393255b21",
    "id": null,
    "metadata": {},
    "name": "RecentArtworksQuery",
    "operationKind": "query",
    "text": "query RecentArtworksQuery {\n  ...RecentArtworks_artworks\n}\n\nfragment ArtworkListItem_artwork on Artwork {\n  id\n  title\n  caption\n  nsfw\n  topIllust {\n    thumbnailUrl\n    id\n  }\n  account {\n    name\n    id\n  }\n}\n\nfragment RecentArtworks_artworks on Query {\n  artworks(first: 40, sort: [CREATED_AT_DESC], safeOnly: true) {\n    edges {\n      node {\n        ...ArtworkListItem_artwork\n        id\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '22345b5c530e7ede196c2e16602ffe8f';
export default node;