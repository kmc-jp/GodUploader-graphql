/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type IndexQueryVariables = {};
export type IndexQueryResponse = {
    readonly accounts: {
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
                readonly id: string;
                readonly title: string;
                readonly caption: string;
                readonly illusts: {
                    readonly edges: ReadonlyArray<{
                        readonly node: {
                            readonly filename: string;
                        } | null;
                    } | null>;
                } | null;
                readonly account: {
                    readonly name: string;
                } | null;
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
  accounts(sort: [FOLDERS_COUNT_DESC]) {
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
    }
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
  "name": "accounts",
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
  "storageKey": "accounts(sort:[\"FOLDERS_COUNT_DESC\"])"
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
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "caption",
  "storageKey": null
},
v6 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 1
  }
],
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "filename",
  "storageKey": null
};
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
                  (v0/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": (v6/*: any*/),
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
                              (v7/*: any*/)
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
                      (v1/*: any*/)
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
                  (v4/*: any*/),
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": (v6/*: any*/),
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
                              (v7/*: any*/),
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
    "cacheID": "af86dade238ceb452e7f3ac6d6e81c13",
    "id": null,
    "metadata": {},
    "name": "IndexQuery",
    "operationKind": "query",
    "text": "query IndexQuery {\n  accounts(sort: [FOLDERS_COUNT_DESC]) {\n    edges {\n      node {\n        id\n        name\n        foldersCount\n      }\n    }\n  }\n  safeArtworks(first: 8, sort: [CREATED_AT_DESC]) {\n    edges {\n      node {\n        id\n        title\n        caption\n        illusts(first: 1) {\n          edges {\n            node {\n              filename\n              id\n            }\n          }\n        }\n        account {\n          name\n          id\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '3fd8f2624afbe2d9d869f1d48aefc053';
export default node;
