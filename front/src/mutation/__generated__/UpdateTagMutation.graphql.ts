/**
 * @generated SignedSource<<1b476c1a7c6177aa9cac92226a0ef985>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type UpdateTagInput = {
  clientMutationId?: string | null;
  id: string;
  name: string;
};
export type UpdateTagMutation$variables = {
  input: UpdateTagInput;
};
export type UpdateTagMutation$data = {
  readonly updateTag: {
    readonly tag: {
      readonly id: string;
      readonly name: string;
    } | null;
  } | null;
};
export type UpdateTagMutation = {
  response: UpdateTagMutation$data;
  variables: UpdateTagMutation$variables;
};

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
    "concreteType": "UpdateTagPayload",
    "kind": "LinkedField",
    "name": "updateTag",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Tag",
        "kind": "LinkedField",
        "name": "tag",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
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
    "name": "UpdateTagMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UpdateTagMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "08ee2d4be734891018e20f96d17ee266",
    "id": null,
    "metadata": {},
    "name": "UpdateTagMutation",
    "operationKind": "mutation",
    "text": "mutation UpdateTagMutation(\n  $input: UpdateTagInput!\n) {\n  updateTag(input: $input) {\n    tag {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "d825c6ee73cc55f1f4ee0d6952ff54d4";

export default node;
