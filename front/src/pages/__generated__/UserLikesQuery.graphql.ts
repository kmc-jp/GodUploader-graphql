/**
 * @generated SignedSource<<bbe412637415bab92a5d71fd3f710149>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type UserLikesQuery$variables = {
  kmcid: string;
};
export type UserLikesQueryVariables = UserLikesQuery$variables;
export type UserLikesQuery$data = {
  readonly user: {
    readonly name: string;
    readonly likes: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly id: string;
          readonly artwork: {
            readonly id: string;
            readonly title: string;
          } | null;
        } | null;
      } | null>;
    } | null;
  } | null;
};
export type UserLikesQueryResponse = UserLikesQuery$data;
export type UserLikesQuery = {
  variables: UserLikesQueryVariables;
  response: UserLikesQuery$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "kmcid"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "kmcid",
    "variableName": "kmcid"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
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
            (v3/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "Artwork",
              "kind": "LinkedField",
              "name": "artwork",
              "plural": false,
              "selections": [
                (v3/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "title",
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
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "UserLikesQuery",
    "selections": [
      {
        "alias": "user",
        "args": (v1/*: any*/),
        "concreteType": "Account",
        "kind": "LinkedField",
        "name": "accountByKmcid",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v4/*: any*/)
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
    "name": "UserLikesQuery",
    "selections": [
      {
        "alias": "user",
        "args": (v1/*: any*/),
        "concreteType": "Account",
        "kind": "LinkedField",
        "name": "accountByKmcid",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v4/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "67c10909b332b55c4cf7d8ccdd0219b4",
    "id": null,
    "metadata": {},
    "name": "UserLikesQuery",
    "operationKind": "query",
    "text": "query UserLikesQuery(\n  $kmcid: String!\n) {\n  user: accountByKmcid(kmcid: $kmcid) {\n    name\n    likes {\n      edges {\n        node {\n          id\n          artwork {\n            id\n            title\n          }\n        }\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "39228a9aa40b41391c813c41f5444e22";

export default node;
