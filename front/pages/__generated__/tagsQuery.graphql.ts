/**
 * @generated SignedSource<<a8268128c34f62fc51d220cc86d9f815>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type tagsQuery$variables = {};
export type tagsQueryVariables = tagsQuery$variables;
export type tagsQuery$data = {
  readonly allTags: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly name: string;
        readonly artworksCount: number;
      } | null;
    } | null>;
  } | null;
};
export type tagsQueryResponse = tagsQuery$data;
export type tagsQuery = {
  variables: tagsQueryVariables;
  response: tagsQuery$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "sort",
    "value": [
      "UPDATED_AT_DESC"
    ]
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "artworksCount",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "tagsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "TagConnection",
        "kind": "LinkedField",
        "name": "allTags",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "TagEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Tag",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  (v2/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "allTags(sort:[\"UPDATED_AT_DESC\"])"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "tagsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "TagConnection",
        "kind": "LinkedField",
        "name": "allTags",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "TagEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Tag",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  (v2/*: any*/),
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
        ],
        "storageKey": "allTags(sort:[\"UPDATED_AT_DESC\"])"
      }
    ]
  },
  "params": {
    "cacheID": "f6c413c849579425b1be36081d256b4b",
    "id": null,
    "metadata": {},
    "name": "tagsQuery",
    "operationKind": "query",
    "text": "query tagsQuery {\n  allTags(sort: [UPDATED_AT_DESC]) {\n    edges {\n      node {\n        name\n        artworksCount\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "8d1c04c5be3875fe31bb6bb7b3680a3b";

export default node;
