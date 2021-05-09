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
                readonly name: string;
                readonly foldersCount: number;
            } | null;
        } | null>;
    } | null;
    readonly safeArtworks: {
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
  activeAccounts(sort: [FOLDERS_COUNT_DESC]) {
    edges {
      node {
        id
        name
        foldersCount
      }
    }
  }
  safeArtworks(first: 8, sort: [CREATED_AT_DESC]) {
    edges {
      node {
        ...ArtworkListItem_artwork
        id
      }
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
        "FOLDERS_COUNT_DESC"
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
            (v1/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "foldersCount",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": "activeAccounts(sort:[\"FOLDERS_COUNT_DESC\"])"
},
v3 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 8
  },
  {
    "kind": "Literal",
    "name": "sort",
    "value": [
      "CREATED_AT_DESC"
    ]
  }
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
        "alias": null,
        "args": (v3/*: any*/),
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
        "storageKey": "safeArtworks(first:8,sort:[\"CREATED_AT_DESC\"])"
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
        "args": (v3/*: any*/),
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
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "safeArtworks(first:8,sort:[\"CREATED_AT_DESC\"])"
      }
    ]
  },
  "params": {
    "cacheID": "e0ebbbcce89efa1fb2346dc6c359a99f",
    "id": null,
    "metadata": {},
    "name": "IndexQuery",
    "operationKind": "query",
    "text": "query IndexQuery {\n  activeAccounts(sort: [FOLDERS_COUNT_DESC]) {\n    edges {\n      node {\n        id\n        name\n        foldersCount\n      }\n    }\n  }\n  safeArtworks(first: 8, sort: [CREATED_AT_DESC]) {\n    edges {\n      node {\n        ...ArtworkListItem_artwork\n        id\n      }\n    }\n  }\n}\n\nfragment ArtworkListItem_artwork on Artwork {\n  id\n  title\n  caption\n  illusts(first: 1) {\n    edges {\n      node {\n        filename\n        id\n      }\n    }\n  }\n  account {\n    name\n    id\n  }\n}\n"
  }
};
})();
(node as any).hash = '667bef34c9128d04ccdf0cdd109c3084';
export default node;
