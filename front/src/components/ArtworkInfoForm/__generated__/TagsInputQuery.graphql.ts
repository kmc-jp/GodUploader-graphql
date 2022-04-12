/**
 * @generated SignedSource<<d0ee6e4b61826cfeabb773b7471045bd>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type TagsInputQuery$variables = {};
export type TagsInputQuery$data = {
  readonly allTags: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly name: string;
        readonly artworksCount: number;
      } | null;
    } | null>;
  } | null;
};
export type TagsInputQuery = {
  variables: TagsInputQuery$variables;
  response: TagsInputQuery$data;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v1 = {
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
    "name": "TagsInputQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
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
                  (v0/*: any*/),
                  (v1/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
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
    "name": "TagsInputQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
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
                  (v0/*: any*/),
                  (v1/*: any*/),
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
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "0cd128606c84984607d085506ce0d0a9",
    "id": null,
    "metadata": {},
    "name": "TagsInputQuery",
    "operationKind": "query",
    "text": "query TagsInputQuery {\n  allTags {\n    edges {\n      node {\n        name\n        artworksCount\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "d91113a880564a2abc668636f514efae";

export default node;
