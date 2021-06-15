/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type TagsInputQueryVariables = {
    prefix: string;
};
export type TagsInputQueryResponse = {
    readonly tagsByPrefix: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly name: string;
                readonly artworksCount: number;
            } | null;
        } | null>;
    } | null;
};
export type TagsInputQuery = {
    readonly response: TagsInputQueryResponse;
    readonly variables: TagsInputQueryVariables;
};



/*
query TagsInputQuery(
  $prefix: String!
) {
  tagsByPrefix(prefix: $prefix) {
    edges {
      node {
        name
        artworksCount
        id
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "prefix"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "prefix",
    "variableName": "prefix"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "artworksCount",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TagsInputQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "TagConnection",
        "kind": "LinkedField",
        "name": "tagsByPrefix",
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
                  (v2/*: any*/),
                  (v3/*: any*/)
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TagsInputQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "TagConnection",
        "kind": "LinkedField",
        "name": "tagsByPrefix",
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
                  (v2/*: any*/),
                  (v3/*: any*/),
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
    "cacheID": "34e5525568410ff96dd9fd6bc34f43c5",
    "id": null,
    "metadata": {},
    "name": "TagsInputQuery",
    "operationKind": "query",
    "text": "query TagsInputQuery(\n  $prefix: String!\n) {\n  tagsByPrefix(prefix: $prefix) {\n    edges {\n      node {\n        name\n        artworksCount\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = 'c6d5bdb8b65a3dd15cdc4f4dfae582dc';
export default node;
