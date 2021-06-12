/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type IndexQueryVariables = {};
export type IndexQueryResponse = {
    readonly activeAccounts: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly id: string;
                readonly kmcid: string;
                readonly name: string;
                readonly artworksCount: number;
            } | null;
        } | null>;
    } | null;
    readonly safeArtworks: {
        readonly __id: string;
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly " $fragmentRefs": FragmentRefs<"ArtworkListItem_artwork">;
            } | null;
        } | null>;
    } | null;
};
export type IndexQuery = {
    readonly response: IndexQueryResponse;
    readonly variables: IndexQueryVariables;
};



/*
query IndexQuery {
  activeAccounts(sort: [ARTWORKS_COUNT_DESC]) {
    edges {
      node {
        id
        kmcid
        name
        artworksCount
      }
    }
  }
  safeArtworks(first: 8, sort: [CREATED_AT_DESC]) {
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

fragment ArtworkListItem_artwork on Artwork {
  id
  title
  caption
  illusts(first: 1) {
    edges {
      node {
        filename
        id
      }
    }
  }
  account {
    name
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": [
    {
      "kind": "Literal",
      "name": "sort",
      "value": [
        "ARTWORKS_COUNT_DESC"
      ]
    }
  ],
  "concreteType": "AccountConnection",
  "kind": "LinkedField",
  "name": "activeAccounts",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "AccountEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Account",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            (v0/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "kmcid",
              "storageKey": null
            },
            (v1/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "artworksCount",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": "activeAccounts(sort:[\"ARTWORKS_COUNT_DESC\"])"
},
v3 = {
  "kind": "Literal",
  "name": "sort",
  "value": [
    "CREATED_AT_DESC"
  ]
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v6 = {
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
},
v7 = {
  "kind": "ClientExtension",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "__id",
      "storageKey": null
    }
  ]
},
v8 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 8
  },
  (v3/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "IndexQuery",
    "selections": [
      (v2/*: any*/),
      {
        "alias": "safeArtworks",
        "args": [
          (v3/*: any*/)
        ],
        "concreteType": "ArtworkConnection",
        "kind": "LinkedField",
        "name": "__Index_safeArtworks_connection",
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
                  (v4/*: any*/),
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "ArtworkListItem_artwork"
                  }
                ],
                "storageKey": null
              },
              (v5/*: any*/)
            ],
            "storageKey": null
          },
          (v6/*: any*/),
          (v7/*: any*/)
        ],
        "storageKey": "__Index_safeArtworks_connection(sort:[\"CREATED_AT_DESC\"])"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "IndexQuery",
    "selections": [
      (v2/*: any*/),
      {
        "alias": null,
        "args": (v8/*: any*/),
        "concreteType": "ArtworkConnection",
        "kind": "LinkedField",
        "name": "safeArtworks",
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
                  (v0/*: any*/),
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
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "first",
                        "value": 1
                      }
                    ],
                    "concreteType": "IllustConnection",
                    "kind": "LinkedField",
                    "name": "illusts",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "IllustEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Illust",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "filename",
                                "storageKey": null
                              },
                              (v0/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": "illusts(first:1)"
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Account",
                    "kind": "LinkedField",
                    "name": "account",
                    "plural": false,
                    "selections": [
                      (v1/*: any*/),
                      (v0/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v4/*: any*/)
                ],
                "storageKey": null
              },
              (v5/*: any*/)
            ],
            "storageKey": null
          },
          (v6/*: any*/),
          (v7/*: any*/)
        ],
        "storageKey": "safeArtworks(first:8,sort:[\"CREATED_AT_DESC\"])"
      },
      {
        "alias": null,
        "args": (v8/*: any*/),
        "filters": [
          "sort"
        ],
        "handle": "connection",
        "key": "Index_safeArtworks",
        "kind": "LinkedHandle",
        "name": "safeArtworks"
      }
    ]
  },
  "params": {
    "cacheID": "c8a10c89cbb69adc83bb40ab6f1ab23e",
    "id": null,
    "metadata": {
      "connection": [
        {
          "count": null,
          "cursor": null,
          "direction": "forward",
          "path": [
            "safeArtworks"
          ]
        }
      ]
    },
    "name": "IndexQuery",
    "operationKind": "query",
    "text": "query IndexQuery {\n  activeAccounts(sort: [ARTWORKS_COUNT_DESC]) {\n    edges {\n      node {\n        id\n        kmcid\n        name\n        artworksCount\n      }\n    }\n  }\n  safeArtworks(first: 8, sort: [CREATED_AT_DESC]) {\n    edges {\n      node {\n        ...ArtworkListItem_artwork\n        id\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment ArtworkListItem_artwork on Artwork {\n  id\n  title\n  caption\n  illusts(first: 1) {\n    edges {\n      node {\n        filename\n        id\n      }\n    }\n  }\n  account {\n    name\n    id\n  }\n}\n"
  }
};
})();
(node as any).hash = 'f5f04e275c8d6e7bb77b2350fb78afa1';
export default node;
