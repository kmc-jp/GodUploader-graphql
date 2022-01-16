/**
 * @generated SignedSource<<2effdd78f4a3b7e878189e72d6c31727>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type DeleteArtworkInput = {
  id: string;
  clientMutationId?: string | null;
};
export type DeleteArtworkMutation$variables = {
  connections: ReadonlyArray<string>;
  input: DeleteArtworkInput;
};
export type DeleteArtworkMutationVariables = DeleteArtworkMutation$variables;
export type DeleteArtworkMutation$data = {
  readonly deleteArtwork: {
    readonly deletedArtworkId: string | null;
  } | null;
};
export type DeleteArtworkMutationResponse = DeleteArtworkMutation$data;
export type DeleteArtworkMutation = {
  variables: DeleteArtworkMutationVariables;
  response: DeleteArtworkMutation$data;
};

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
  "name": "deletedArtworkId",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "DeleteArtworkMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DeleteArtworkPayload",
        "kind": "LinkedField",
        "name": "deleteArtwork",
        "plural": false,
        "selections": [
          (v2/*: any*/)
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
    "name": "DeleteArtworkMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DeleteArtworkPayload",
        "kind": "LinkedField",
        "name": "deleteArtwork",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "deleteEdge",
            "key": "",
            "kind": "ScalarHandle",
            "name": "deletedArtworkId",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "connections"
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "5e2f0a6753b37311138f875e0f88cde9",
    "id": null,
    "metadata": {},
    "name": "DeleteArtworkMutation",
    "operationKind": "mutation",
    "text": "mutation DeleteArtworkMutation(\n  $input: DeleteArtworkInput!\n) {\n  deleteArtwork(input: $input) {\n    deletedArtworkId\n  }\n}\n"
  }
};
})();

(node as any).hash = "f58f8842a9eef2551da0b514cb0e9aca";

export default node;
