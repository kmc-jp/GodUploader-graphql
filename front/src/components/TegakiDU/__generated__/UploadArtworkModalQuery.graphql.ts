/**
 * @generated SignedSource<<d9b741ec79b0806765a1c14fa8ef276d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type UploadArtworkModalQuery$variables = {};
export type UploadArtworkModalQuery$data = {
  readonly viewer: {
    readonly kmcid: string;
  } | null;
};
export type UploadArtworkModalQuery = {
  variables: UploadArtworkModalQuery$variables;
  response: UploadArtworkModalQuery$data;
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
    "name": "UploadArtworkModalQuery",
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
    "name": "UploadArtworkModalQuery",
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
    "cacheID": "10e32f3e8a4bc2e52f3f601403241274",
    "id": null,
    "metadata": {},
    "name": "UploadArtworkModalQuery",
    "operationKind": "query",
    "text": "query UploadArtworkModalQuery {\n  viewer {\n    kmcid\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "88320a4db4396cbc3583d6e25e595c1c";

export default node;
