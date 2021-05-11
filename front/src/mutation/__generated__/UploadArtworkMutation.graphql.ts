/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type UploadArtworkInput = {
    title: string;
    caption: string;
    tags?: string | null;
    files: Array<unknown | null>;
    clientMutationId?: string | null;
};
export type UploadArtworkMutationVariables = {
    input: UploadArtworkInput;
};
export type UploadArtworkMutationResponse = {
    readonly uploadArtwork: {
        readonly artwork: {
            readonly id: string;
        } | null;
    } | null;
};
export type UploadArtworkMutation = {
    readonly response: UploadArtworkMutationResponse;
    readonly variables: UploadArtworkMutationVariables;
};



/*
mutation UploadArtworkMutation(
  $input: UploadArtworkInput!
) {
  uploadArtwork(input: $input) {
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
    "concreteType": "UploadArtworkPayload",
    "kind": "LinkedField",
    "name": "uploadArtwork",
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
    "name": "UploadArtworkMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UploadArtworkMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "e67ea75ff96603ef41b070b644364a6e",
    "id": null,
    "metadata": {},
    "name": "UploadArtworkMutation",
    "operationKind": "mutation",
    "text": "mutation UploadArtworkMutation(\n  $input: UploadArtworkInput!\n) {\n  uploadArtwork(input: $input) {\n    artwork {\n      id\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = 'cd8d5c1362da58a7987317c3dae77d19';
export default node;
