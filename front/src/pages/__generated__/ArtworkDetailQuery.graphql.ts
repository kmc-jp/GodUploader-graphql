/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkDetailQueryVariables = {
    id: string;
};
export type ArtworkDetailQueryResponse = {
    readonly node: {
        readonly title?: string;
        readonly caption?: string;
        readonly createdAt?: string;
        readonly account?: {
            readonly kmcid: string;
            readonly name: string;
        } | null;
        readonly illusts?: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly id: string;
                    readonly filename: string;
                } | null;
            } | null>;
        } | null;
        readonly likes?: {
            readonly __id: string;
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly " $fragmentRefs": FragmentRefs<"ArtworkDetail_like">;
                } | null;
            } | null>;
        } | null;
        readonly tags?: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly tag: {
                        readonly id: string;
                        readonly name: string;
                    } | null;
                } | null;
            } | null>;
        } | null;
    } | null;
};
export type ArtworkDetailQuery = {
    readonly response: ArtworkDetailQueryResponse;
    readonly variables: ArtworkDetailQueryVariables;
};



/*
query ArtworkDetailQuery(
  $id: ID!
) {
  node(id: $id) {
    __typename
    ... on Artwork {
      title
      caption
      createdAt
      account {
        kmcid
        name
        id
      }
      illusts {
        edges {
          node {
            id
            filename
          }
        }
      }
      likes(first: 10000000) {
        edges {
          node {
            ...ArtworkDetail_like
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
      tags {
        edges {
          node {
            tag {
              id
              name
            }
            id
          }
        }
      }
    }
    id
  }
}

fragment ArtworkDetail_like on Like {
  account {
    id
    kmcid
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "caption",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "kmcid",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
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
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "filename",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v11 = {
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
v12 = {
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
v13 = {
  "alias": null,
  "args": null,
  "concreteType": "Tag",
  "kind": "LinkedField",
  "name": "tag",
  "plural": false,
  "selections": [
    (v7/*: any*/),
    (v6/*: any*/)
  ],
  "storageKey": null
},
v14 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10000000
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtworkDetailQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Account",
                "kind": "LinkedField",
                "name": "account",
                "plural": false,
                "selections": [
                  (v5/*: any*/),
                  (v6/*: any*/)
                ],
                "storageKey": null
              },
              (v8/*: any*/),
              {
                "alias": "likes",
                "args": null,
                "concreteType": "LikeConnection",
                "kind": "LinkedField",
                "name": "__ArtworkDetail_likes_connection",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "LikeEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Like",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v9/*: any*/),
                          {
                            "args": null,
                            "kind": "FragmentSpread",
                            "name": "ArtworkDetail_like"
                          }
                        ],
                        "storageKey": null
                      },
                      (v10/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v11/*: any*/),
                  (v12/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "ArtworkTagRelationConnection",
                "kind": "LinkedField",
                "name": "tags",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ArtworkTagRelationEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "ArtworkTagRelation",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v13/*: any*/)
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
            "type": "Artwork",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ArtworkDetailQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v9/*: any*/),
          (v7/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Account",
                "kind": "LinkedField",
                "name": "account",
                "plural": false,
                "selections": [
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/)
                ],
                "storageKey": null
              },
              (v8/*: any*/),
              {
                "alias": null,
                "args": (v14/*: any*/),
                "concreteType": "LikeConnection",
                "kind": "LinkedField",
                "name": "likes",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "LikeEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Like",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Account",
                            "kind": "LinkedField",
                            "name": "account",
                            "plural": false,
                            "selections": [
                              (v7/*: any*/),
                              (v5/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v7/*: any*/),
                          (v9/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v10/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v11/*: any*/),
                  (v12/*: any*/)
                ],
                "storageKey": "likes(first:10000000)"
              },
              {
                "alias": null,
                "args": (v14/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "ArtworkDetail_likes",
                "kind": "LinkedHandle",
                "name": "likes"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "ArtworkTagRelationConnection",
                "kind": "LinkedField",
                "name": "tags",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ArtworkTagRelationEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "ArtworkTagRelation",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v13/*: any*/),
                          (v7/*: any*/)
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
            "type": "Artwork",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "f5d2200bb298c0a2cbf5b87fea73433e",
    "id": null,
    "metadata": {
      "connection": [
        {
          "count": null,
          "cursor": null,
          "direction": "forward",
          "path": [
            "node",
            "likes"
          ]
        }
      ]
    },
    "name": "ArtworkDetailQuery",
    "operationKind": "query",
    "text": "query ArtworkDetailQuery(\n  $id: ID!\n) {\n  node(id: $id) {\n    __typename\n    ... on Artwork {\n      title\n      caption\n      createdAt\n      account {\n        kmcid\n        name\n        id\n      }\n      illusts {\n        edges {\n          node {\n            id\n            filename\n          }\n        }\n      }\n      likes(first: 10000000) {\n        edges {\n          node {\n            ...ArtworkDetail_like\n            id\n            __typename\n          }\n          cursor\n        }\n        pageInfo {\n          endCursor\n          hasNextPage\n        }\n      }\n      tags {\n        edges {\n          node {\n            tag {\n              id\n              name\n            }\n            id\n          }\n        }\n      }\n    }\n    id\n  }\n}\n\nfragment ArtworkDetail_like on Like {\n  account {\n    id\n    kmcid\n  }\n}\n"
  }
};
})();
(node as any).hash = '7618a6d53faea51e31d0fcb4a7c8b7e4';
export default node;
