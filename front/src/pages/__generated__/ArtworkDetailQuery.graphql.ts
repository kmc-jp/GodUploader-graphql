/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkDetailQueryVariables = {
    id: string;
};
export type ArtworkDetailQueryResponse = {
    readonly viewer: {
        readonly id: string;
    } | null;
    readonly node: {
        readonly id?: string;
        readonly title?: string;
        readonly caption?: string;
        readonly createdAt?: string;
        readonly account?: {
            readonly id: string;
            readonly kmcid: string;
            readonly name: string;
        } | null;
        readonly tags?: {
            readonly edges: ReadonlyArray<{
                readonly node: {
                    readonly id: string;
                    readonly name: string;
                } | null;
            } | null>;
        } | null;
        readonly " $fragmentRefs": FragmentRefs<"IllustCarousel_illusts" | "ArtworkLikeList_likes" | "ArtworkComment_comments">;
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
  viewer {
    id
  }
  node(id: $id) {
    __typename
    ... on Artwork {
      id
      title
      caption
      createdAt
      account {
        id
        kmcid
        name
      }
      ...IllustCarousel_illusts
      ...ArtworkLikeList_likes
      ...ArtworkComment_comments
      tags {
        edges {
          node {
            id
            name
          }
        }
      }
    }
    id
  }
}

fragment ArtworkComment_comments on Artwork {
  comments(last: 1000000) {
    edges {
      node {
        text
        createdAt
        account {
          kmcid
          id
        }
        id
        __typename
      }
      cursor
    }
    pageInfo {
      hasPreviousPage
      startCursor
    }
  }
}

fragment ArtworkLikeList_likes on Artwork {
  likes(first: 10000000) {
    edges {
      node {
        account {
          id
          kmcid
        }
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

fragment IllustCarousel_illusts on Artwork {
  illusts {
    edges {
      node {
        id
        imageUrl
      }
    }
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
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "concreteType": "Account",
  "kind": "LinkedField",
  "name": "viewer",
  "plural": false,
  "selections": [
    (v1/*: any*/)
  ],
  "storageKey": null
},
v3 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
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
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "kmcid",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "concreteType": "Account",
  "kind": "LinkedField",
  "name": "account",
  "plural": false,
  "selections": [
    (v1/*: any*/),
    (v7/*: any*/),
    (v8/*: any*/)
  ],
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "TagConnection",
  "kind": "LinkedField",
  "name": "tags",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "TagEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Tag",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            (v1/*: any*/),
            (v8/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v12 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10000000
  }
],
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v14 = {
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
v15 = [
  {
    "kind": "Literal",
    "name": "last",
    "value": 1000000
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtworkDetailQuery",
    "selections": [
      (v2/*: any*/),
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              (v1/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v9/*: any*/),
              (v10/*: any*/),
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "IllustCarousel_illusts"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "ArtworkLikeList_likes"
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "ArtworkComment_comments"
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
      (v2/*: any*/),
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v11/*: any*/),
          (v1/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v9/*: any*/),
              {
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
                          (v1/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "imageUrl",
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
              {
                "alias": null,
                "args": (v12/*: any*/),
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
                              (v1/*: any*/),
                              (v7/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v1/*: any*/),
                          (v11/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v13/*: any*/)
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
                  },
                  (v14/*: any*/)
                ],
                "storageKey": "likes(first:10000000)"
              },
              {
                "alias": null,
                "args": (v12/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "ArtworkDetail_likes",
                "kind": "LinkedHandle",
                "name": "likes"
              },
              {
                "alias": null,
                "args": (v15/*: any*/),
                "concreteType": "CommentConnection",
                "kind": "LinkedField",
                "name": "comments",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "CommentEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Comment",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "text",
                            "storageKey": null
                          },
                          (v6/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Account",
                            "kind": "LinkedField",
                            "name": "account",
                            "plural": false,
                            "selections": [
                              (v7/*: any*/),
                              (v1/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v1/*: any*/),
                          (v11/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v13/*: any*/)
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
                        "name": "hasPreviousPage",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "startCursor",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v14/*: any*/)
                ],
                "storageKey": "comments(last:1000000)"
              },
              {
                "alias": null,
                "args": (v15/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "ArtworkComment_comments",
                "kind": "LinkedHandle",
                "name": "comments"
              },
              (v10/*: any*/)
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
    "cacheID": "c20cfe54321b8bdacfcf1a6834e493cf",
    "id": null,
    "metadata": {},
    "name": "ArtworkDetailQuery",
    "operationKind": "query",
    "text": "query ArtworkDetailQuery(\n  $id: ID!\n) {\n  viewer {\n    id\n  }\n  node(id: $id) {\n    __typename\n    ... on Artwork {\n      id\n      title\n      caption\n      createdAt\n      account {\n        id\n        kmcid\n        name\n      }\n      ...IllustCarousel_illusts\n      ...ArtworkLikeList_likes\n      ...ArtworkComment_comments\n      tags {\n        edges {\n          node {\n            id\n            name\n          }\n        }\n      }\n    }\n    id\n  }\n}\n\nfragment ArtworkComment_comments on Artwork {\n  comments(last: 1000000) {\n    edges {\n      node {\n        text\n        createdAt\n        account {\n          kmcid\n          id\n        }\n        id\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      hasPreviousPage\n      startCursor\n    }\n  }\n}\n\nfragment ArtworkLikeList_likes on Artwork {\n  likes(first: 10000000) {\n    edges {\n      node {\n        account {\n          id\n          kmcid\n        }\n        id\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment IllustCarousel_illusts on Artwork {\n  illusts {\n    edges {\n      node {\n        id\n        imageUrl\n      }\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '39d726fa448384583c87a7125a47c982';
export default node;
