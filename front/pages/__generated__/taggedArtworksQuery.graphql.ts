/**
 * @generated SignedSource<<ed7319dc33739ba542f4ba0c8506d236>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type taggedArtworksQuery$variables = {
  tag: string;
};
export type taggedArtworksQueryVariables = taggedArtworksQuery$variables;
export type taggedArtworksQuery$data = {
  readonly tagByName: {
    readonly editFreezed: boolean;
    readonly " $fragmentSpreads": FragmentRefs<"UpdateTagModal_tag">;
  } | null;
  readonly taggedArtworks: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly " $fragmentSpreads": FragmentRefs<"ArtworkListItem_artwork">;
      } | null;
    } | null>;
  } | null;
};
export type taggedArtworksQueryResponse = taggedArtworksQuery$data;
export type taggedArtworksQuery = {
  variables: taggedArtworksQueryVariables;
  response: taggedArtworksQuery$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "tag"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "name",
    "variableName": "tag"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "editFreezed",
  "storageKey": null
},
v3 = [
  {
    "kind": "Literal",
    "name": "sort",
    "value": [
      "CREATED_AT_DESC"
    ]
  },
  {
    "kind": "Variable",
    "name": "tag",
    "variableName": "tag"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "taggedArtworksQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Tag",
        "kind": "LinkedField",
        "name": "tagByName",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "UpdateTagModal_tag"
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "ArtworkConnection",
        "kind": "LinkedField",
        "name": "taggedArtworks",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ArtworkEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Artwork",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "ArtworkListItem_artwork"
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
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "taggedArtworksQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Tag",
        "kind": "LinkedField",
        "name": "tagByName",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          (v5/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "canonicalName",
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "ArtworkConnection",
        "kind": "LinkedField",
        "name": "taggedArtworks",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ArtworkEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Artwork",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "title",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "caption",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "nsfw",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Illust",
                    "kind": "LinkedField",
                    "name": "topIllust",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "thumbnailUrl",
                        "storageKey": null
                      },
                      (v4/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Account",
                    "kind": "LinkedField",
                    "name": "account",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      (v4/*: any*/)
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
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "adda4de810a282905bb49e2f76766e7c",
    "id": null,
    "metadata": {},
    "name": "taggedArtworksQuery",
    "operationKind": "query",
    "text": "query taggedArtworksQuery(\n  $tag: String!\n) {\n  tagByName(name: $tag) {\n    ...UpdateTagModal_tag\n    editFreezed\n    id\n  }\n  taggedArtworks(tag: $tag, sort: [CREATED_AT_DESC]) {\n    edges {\n      node {\n        ...ArtworkListItem_artwork\n        id\n      }\n    }\n  }\n}\n\nfragment ArtworkListItem_artwork on Artwork {\n  id\n  title\n  caption\n  nsfw\n  topIllust {\n    thumbnailUrl\n    id\n  }\n  account {\n    name\n    id\n  }\n}\n\nfragment UpdateTagModal_tag on Tag {\n  id\n  name\n  canonicalName\n}\n"
  }
};
})();

(node as any).hash = "f44a75fb7ff3f750fe121f1db4953d52";

export default node;
