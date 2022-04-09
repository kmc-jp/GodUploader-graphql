/**
 * @generated SignedSource<<a2d668782d279e2af1c56610feca8e29>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type FolderIdQuery$variables = {
  folderId: number;
};
export type FolderIdQueryVariables = FolderIdQuery$variables;
export type FolderIdQuery$data = {
  readonly artworkByFolderId: {
    readonly id: string;
  } | null;
};
export type FolderIdQueryResponse = FolderIdQuery$data;
export type FolderIdQuery = {
  variables: FolderIdQueryVariables;
  response: FolderIdQuery$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "folderId"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "folderId",
        "variableName": "folderId"
      }
    ],
    "concreteType": "Artwork",
    "kind": "LinkedField",
    "name": "artworkByFolderId",
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
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "FolderIdQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "FolderIdQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "8441292886f2c82a1a8ce17c090e3d61",
    "id": null,
    "metadata": {},
    "name": "FolderIdQuery",
    "operationKind": "query",
    "text": "query FolderIdQuery(\n  $folderId: Int!\n) {\n  artworkByFolderId(folderId: $folderId) {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "7d61ff70bfcd506ad731b15c4c63cbe8";

export default node;
