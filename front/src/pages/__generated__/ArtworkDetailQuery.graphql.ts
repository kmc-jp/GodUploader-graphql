/**
 * @generated SignedSource<<4c4c4cd87fbecd85eff29f17ebaff02d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ArtworkDetailQuery$variables = {
  id: string;
};
export type ArtworkDetailQueryVariables = ArtworkDetailQuery$variables;
export type ArtworkDetailQuery$data = {
  readonly artworkWithBidirectional: {
    readonly __typename: "Artwork";
    readonly previousArtwork: {
      readonly id: string;
      readonly title: string;
      readonly nsfw: boolean;
      readonly topIllust: {
        readonly thumbnailUrl: string;
      } | null;
    } | null;
    readonly nextArtwork: {
      readonly id: string;
      readonly title: string;
      readonly nsfw: boolean;
      readonly topIllust: {
        readonly thumbnailUrl: string;
      } | null;
    } | null;
    readonly id: string;
    readonly title: string;
    readonly caption: string;
    readonly createdAt: string;
    readonly editable: boolean;
    readonly account: {
      readonly id: string;
      readonly kmcid: string;
      readonly name: string;
    } | null;
    readonly tags: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly id: string;
          readonly name: string;
        } | null;
      } | null>;
    } | null;
    readonly " $fragmentSpreads": FragmentRefs<"UpdateArtworkForm_artwork" | "IllustCarousel_illusts" | "ArtworkLikeList_likes" | "ArtworkComment_comments">;
  } | {
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    readonly __typename: "%other";
  } | null;
};
export type ArtworkDetailQueryResponse = ArtworkDetailQuery$data;
export type ArtworkDetailQuery = {
  variables: ArtworkDetailQueryVariables;
  response: ArtworkDetailQuery$data;
};

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
  "name": "__typename",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
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
  "name": "nsfw",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "thumbnailUrl",
  "storageKey": null
},
v7 = [
  (v3/*: any*/),
  (v4/*: any*/),
  (v5/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": "Illust",
    "kind": "LinkedField",
    "name": "topIllust",
    "plural": false,
    "selections": [
      (v6/*: any*/)
    ],
    "storageKey": null
  }
],
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "caption",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createdAt",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "editable",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "kmcid",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "concreteType": "Account",
  "kind": "LinkedField",
  "name": "account",
  "plural": false,
  "selections": [
    (v3/*: any*/),
    (v11/*: any*/),
    (v12/*: any*/)
  ],
  "storageKey": null
},
v14 = [
  (v3/*: any*/),
  (v4/*: any*/),
  (v5/*: any*/),
  {
    "alias": null,
    "args": null,
    "concreteType": "Illust",
    "kind": "LinkedField",
    "name": "topIllust",
    "plural": false,
    "selections": [
      (v6/*: any*/),
      (v3/*: any*/)
    ],
    "storageKey": null
  }
],
v15 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 10000000
  }
],
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v17 = {
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
v18 = [
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
      {
        "alias": "artworkWithBidirectional",
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Artwork",
                "kind": "LinkedField",
                "name": "previousArtwork",
                "plural": false,
                "selections": (v7/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Artwork",
                "kind": "LinkedField",
                "name": "nextArtwork",
                "plural": false,
                "selections": (v7/*: any*/),
                "storageKey": null
              },
              (v3/*: any*/),
              (v4/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/),
              (v10/*: any*/),
              (v13/*: any*/),
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "UpdateArtworkForm_artwork"
              },
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
              },
              {
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
                          (v3/*: any*/),
                          (v12/*: any*/)
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
        "alias": "artworkWithBidirectional",
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Artwork",
                "kind": "LinkedField",
                "name": "previousArtwork",
                "plural": false,
                "selections": (v14/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Artwork",
                "kind": "LinkedField",
                "name": "nextArtwork",
                "plural": false,
                "selections": (v14/*: any*/),
                "storageKey": null
              },
              (v4/*: any*/),
              (v8/*: any*/),
              (v9/*: any*/),
              (v10/*: any*/),
              (v13/*: any*/),
              {
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
                          (v12/*: any*/),
                          (v3/*: any*/)
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
                          (v3/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "imageUrl",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "webpUrl",
                            "storageKey": null
                          },
                          (v6/*: any*/)
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
                "alias": "artworkId",
                "args": null,
                "kind": "ScalarField",
                "name": "id",
                "storageKey": null
              },
              {
                "alias": null,
                "args": (v15/*: any*/),
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
                              (v3/*: any*/),
                              (v11/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v3/*: any*/),
                          (v2/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v16/*: any*/)
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
                  (v17/*: any*/)
                ],
                "storageKey": "likes(first:10000000)"
              },
              {
                "alias": null,
                "args": (v15/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "ArtworkDetail_likes",
                "kind": "LinkedHandle",
                "name": "likes"
              },
              {
                "alias": null,
                "args": (v18/*: any*/),
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
                          (v9/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Account",
                            "kind": "LinkedField",
                            "name": "account",
                            "plural": false,
                            "selections": [
                              (v11/*: any*/),
                              (v3/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v3/*: any*/),
                          (v2/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v16/*: any*/)
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
                  (v17/*: any*/)
                ],
                "storageKey": "comments(last:1000000)"
              },
              {
                "alias": null,
                "args": (v18/*: any*/),
                "filters": null,
                "handle": "connection",
                "key": "ArtworkComment_comments",
                "kind": "LinkedHandle",
                "name": "comments"
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
    "cacheID": "c7682d4bc9c62ca8724c67b6deaeab6f",
    "id": null,
    "metadata": {},
    "name": "ArtworkDetailQuery",
    "operationKind": "query",
    "text": "query ArtworkDetailQuery(\n  $id: ID!\n) {\n  artworkWithBidirectional: node(id: $id) {\n    __typename\n    ... on Artwork {\n      previousArtwork {\n        id\n        title\n        nsfw\n        topIllust {\n          thumbnailUrl\n          id\n        }\n      }\n      nextArtwork {\n        id\n        title\n        nsfw\n        topIllust {\n          thumbnailUrl\n          id\n        }\n      }\n      id\n      title\n      caption\n      createdAt\n      editable\n      account {\n        id\n        kmcid\n        name\n      }\n      ...UpdateArtworkForm_artwork\n      ...IllustCarousel_illusts\n      ...ArtworkLikeList_likes\n      ...ArtworkComment_comments\n      tags {\n        edges {\n          node {\n            id\n            name\n          }\n        }\n      }\n    }\n    id\n  }\n}\n\nfragment ArtworkComment_comments on Artwork {\n  artworkId: id\n  comments(last: 1000000) {\n    edges {\n      node {\n        text\n        createdAt\n        account {\n          kmcid\n          id\n        }\n        id\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      hasPreviousPage\n      startCursor\n    }\n  }\n}\n\nfragment ArtworkLikeList_likes on Artwork {\n  artworkId: id\n  likes(first: 10000000) {\n    edges {\n      node {\n        account {\n          id\n          kmcid\n        }\n        id\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment IllustCarousel_illusts on Artwork {\n  illusts {\n    edges {\n      node {\n        id\n        imageUrl\n        webpUrl\n        thumbnailUrl\n      }\n    }\n  }\n}\n\nfragment UpdateArtworkForm_artwork on Artwork {\n  id\n  title\n  caption\n  tags {\n    edges {\n      node {\n        name\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "587d323b261cca89d27c6a980d0bdbc6";

export default node;
