/**
 * @generated SignedSource<<1d2d13516e754ccdd91cd3dfb66e71b3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type UploadArtworkQuery$variables = {};
export type UploadArtworkQuery$data = {
  readonly viewer: {
    readonly kmcid: string;
  } | null;
};
export type UploadArtworkQuery = {
  variables: UploadArtworkQuery$variables;
  response: UploadArtworkQuery$data;
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
    "name": "UploadArtworkQuery",
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
    "name": "UploadArtworkQuery",
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
    "cacheID": "3208f65dad587e47d0153e794a8bf8a5",
    "id": null,
    "metadata": {},
    "name": "UploadArtworkQuery",
    "operationKind": "query",
    "text": "query UploadArtworkQuery {\n  viewer {\n    kmcid\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "682ef29e318f1a0c4b0c804a89858729";

export default node;
