/**
 * @generated SignedSource<<8684de938606c0b95e580c50d480ed89>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type RedirectToMyPageQuery$variables = {};
export type RedirectToMyPageQuery$data = {
  readonly viewer: {
    readonly kmcid: string;
  } | null;
};
export type RedirectToMyPageQuery = {
  response: RedirectToMyPageQuery$data;
  variables: RedirectToMyPageQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "kmcid",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "RedirectToMyPageQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Account",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          (v0/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "RedirectToMyPageQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Account",
        "kind": "LinkedField",
        "name": "viewer",
        "plural": false,
        "selections": [
          (v0/*: any*/),
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
    ]
  },
  "params": {
    "cacheID": "a40385d14028dda6069658a45d119f25",
    "id": null,
    "metadata": {},
    "name": "RedirectToMyPageQuery",
    "operationKind": "query",
    "text": "query RedirectToMyPageQuery {\n  viewer {\n    kmcid\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "5a15b32b60ffc6502f40c5a06d55b32a";

export default node;
