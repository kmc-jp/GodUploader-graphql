/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type UpdateArtworkInput = {
    id: string;
    title: string;
    caption: string;
    tags: Array<string>;
    clientMutationId?: string | null;
};
export type UpdateArtworkMutationVariables = {
    input: UpdateArtworkInput;
};
export type UpdateArtworkMutationResponse = {
    readonly updateArtwork: {
        readonly artwork: {
            readonly id: string;
        } | null;
    } | null;
};
export type UpdateArtworkMutation = {
    readonly response: UpdateArtworkMutationResponse;
    readonly variables: UpdateArtworkMutationVariables;
};



/*
mutation UpdateArtworkMutation(
  $input: UpdateArtworkInput!
) {
  updateArtwork(input: $input) {
    artwork {
      id
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
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "UpdateArtworkPayload",
    "kind": "LinkedField",
    "name": "updateArtwork",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
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
    "name": "UpdateArtworkMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UpdateArtworkMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ef58b2beecab4c1538ea200425739fb9",
    "id": null,
    "metadata": {},
    "name": "UpdateArtworkMutation",
    "operationKind": "mutation",
    "text": "mutation UpdateArtworkMutation(\n  $input: UpdateArtworkInput!\n) {\n  updateArtwork(input: $input) {\n    artwork {\n      id\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '7e9471ed2304a724bfa54fed091907ad';
export default node;
