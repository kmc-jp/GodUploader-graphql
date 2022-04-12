/**
 * @generated SignedSource<<cc4fe781afba80d70ae0268999611631>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type TagsQuery$variables = {};
export type TagsQuery$data = {
  readonly allTags: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly name: string;
        readonly artworksCount: number;
      } | null;
    } | null>;
  } | null;
};
export type TagsQuery = {
  variables: TagsQuery$variables;
  response: TagsQuery$data;
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
    "name": "TagsQuery",
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
    "name": "TagsQuery",
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
    "cacheID": "d48b2be3f2f6bd871cbc46c588c6b315",
    "id": null,
    "metadata": {},
    "name": "TagsQuery",
    "operationKind": "query",
    "text": "query TagsQuery {\n  allTags(sort: [UPDATED_AT_DESC]) {\n    edges {\n      node {\n        name\n        artworksCount\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c21a329086271c16f01fc0b7bdda5f1c";

export default node;
