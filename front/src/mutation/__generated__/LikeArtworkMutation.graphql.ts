/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type LikeArtworkInput = {
    artworkId: string;
    clientMutationId?: string | null;
};
export type LikeArtworkMutationVariables = {
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
    "name": "input"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "LikeArtworkPayload",
    "kind": "LinkedField",
    "name": "likeArtwork",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Like",
        "kind": "LinkedField",
        "name": "like",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Account",
            "kind": "LinkedField",
            "name": "account",
            "plural": false,
            "selections": [
              (v1/*: any*/),
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
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "LikeArtworkMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LikeArtworkMutation",
    "selections": (v2/*: any*/)
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
(node as any).hash = '28e21ab099ee7a87f7c3099ce9b947b8';
export default node;