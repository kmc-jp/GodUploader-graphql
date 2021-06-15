/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type RedirectFolderToArtworkQueryVariables = {
    folderId: number;
};
export type RedirectFolderToArtworkQueryResponse = {
    readonly artworkByFolderId: {
        readonly id: string;
    } | null;
};
export type RedirectFolderToArtworkQuery = {
    readonly response: RedirectFolderToArtworkQueryResponse;
    readonly variables: RedirectFolderToArtworkQueryVariables;
};



/*
query RedirectFolderToArtworkQuery(
  $folderId: Int!
) {
  artworkByFolderId(folderId: $folderId) {
    id
  }
}
*/

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
    "name": "RedirectFolderToArtworkQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RedirectFolderToArtworkQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "1d8c01ee133937af1d556e53123f1af5",
    "id": null,
    "metadata": {},
    "name": "RedirectFolderToArtworkQuery",
    "operationKind": "query",
    "text": "query RedirectFolderToArtworkQuery(\n  $folderId: Int!\n) {\n  artworkByFolderId(folderId: $folderId) {\n    id\n  }\n}\n"
  }
};
})();
(node as any).hash = '3dff7ab3fce90fa26183ba13a217c971';
export default node;
