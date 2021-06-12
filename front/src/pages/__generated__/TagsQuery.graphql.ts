/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type TagsQueryVariables = {};
export type TagsQueryResponse = {
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
    readonly response: TagsQueryResponse;
    readonly variables: TagsQueryVariables;
};



/*
query TagsQuery {
  allTags(sort: ID_ASC) {
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
    "kind": "Literal",
    "name": "sort",
    "value": "ID_ASC"
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
        "storageKey": "allTags(sort:\"ID_ASC\")"
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
        "storageKey": "allTags(sort:\"ID_ASC\")"
      }
    ]
  },
  "params": {
    "cacheID": "7801605fe5b35057318fd5dc7fe91f63",
    "id": null,
    "metadata": {},
    "name": "TagsQuery",
    "operationKind": "query",
    "text": "query TagsQuery {\n  allTags(sort: ID_ASC) {\n    edges {\n      node {\n        name\n        artworksCount\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '0bd7d53dcfa703d13289696d0f459e17';
export default node;
