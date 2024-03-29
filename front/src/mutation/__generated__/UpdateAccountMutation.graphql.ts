/**
 * @generated SignedSource<<c62f36ec50a9aa4a68f884c0bc94ee03>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type UpdateAccountInput = {
  clientMutationId?: string | null;
  name: string;
};
export type UpdateAccountMutation$variables = {
  input: UpdateAccountInput;
};
export type UpdateAccountMutation$data = {
  readonly updateAccount: {
    readonly account: {
      readonly id: string;
      readonly kmcid: string;
      readonly name: string;
    } | null;
  } | null;
};
export type UpdateAccountMutation = {
  response: UpdateAccountMutation$data;
  variables: UpdateAccountMutation$variables;
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
    "concreteType": "UpdateAccountPayload",
    "kind": "LinkedField",
    "name": "updateAccount",
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
            "name": "kmcid",
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
    "name": "UpdateAccountMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UpdateAccountMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "46d3ed1b20d58b5ac7f0e5f93ab8526f",
    "id": null,
    "metadata": {},
    "name": "UpdateAccountMutation",
    "operationKind": "mutation",
    "text": "mutation UpdateAccountMutation(\n  $input: UpdateAccountInput!\n) {\n  updateAccount(input: $input) {\n    account {\n      id\n      kmcid\n      name\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "e0a6a72baf781f4374711281b5326d02";

export default node;
