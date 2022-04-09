/**
 * @generated SignedSource<<64830330bd965fe20810865f8c24f7ef>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type myQuery$variables = {};
export type myQueryVariables = myQuery$variables;
export type myQuery$data = {
  readonly viewer: {
    readonly kmcid: string;
  } | null;
};
export type myQueryResponse = myQuery$data;
export type myQuery = {
  variables: myQueryVariables;
  response: myQuery$data;
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
    "name": "myQuery",
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
    "name": "myQuery",
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
    "cacheID": "9b3dfef1d56cbc6a6e79753386563f85",
    "id": null,
    "metadata": {},
    "name": "myQuery",
    "operationKind": "query",
    "text": "query myQuery {\n  viewer {\n    kmcid\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "75264a088a268cced3b4b5c99ed63e61";

export default node;
