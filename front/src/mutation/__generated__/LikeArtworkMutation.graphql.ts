/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type LikeArtworkInput = {
    artworkId: string;
    clientMutationId?: string | null;
};
export type LikeArtworkMutationVariables = {
    connections: Array<string>;
    input: LikeArtworkInput;
};
export type LikeArtworkMutationResponse = {
    readonly likeArtwork: {
        readonly like: {
            readonly id: string;
            readonly account: {
                readonly id: string;
                readonly kmcid: string;
            } | null;
        } | null;
    } | null;
};
export type LikeArtworkMutation = {
    readonly response: LikeArtworkMutationResponse;
    readonly variables: LikeArtworkMutationVariables;
};



/*
mutation LikeArtworkMutation(
  $input: LikeArtworkInput!
) {
  likeArtwork(input: $input) {
    like {
      id
      account {
        id
        kmcid
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
    "name": "connections"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "concreteType": "Like",
  "kind": "LinkedField",
  "name": "like",
  "plural": false,
  "selections": [
    (v2/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "Account",
      "kind": "LinkedField",
      "name": "account",
      "plural": false,
      "selections": [
        (v2/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "kmcid",
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
    "name": "LikeArtworkMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "LikeArtworkPayload",
        "kind": "LinkedField",
        "name": "likeArtwork",
        "plural": false,
        "selections": [
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LikeArtworkMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "LikeArtworkPayload",
        "kind": "LinkedField",
        "name": "likeArtwork",
        "plural": false,
        "selections": [
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "appendNode",
            "key": "",
            "kind": "LinkedHandle",
            "name": "like",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "connections"
              },
              {
                "kind": "Literal",
                "name": "edgeTypeName",
                "value": "LikeEdge"
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "8b7414b470ea4ba2d75ec6b2664cda05",
    "id": null,
    "metadata": {},
    "name": "LikeArtworkMutation",
    "operationKind": "mutation",
    "text": "mutation LikeArtworkMutation(\n  $input: LikeArtworkInput!\n) {\n  likeArtwork(input: $input) {\n    like {\n      id\n      account {\n        id\n        kmcid\n      }\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '29584cb546970c87222ce212e1667234';
export default node;
