/**
 * @generated SignedSource<<34b490c3dbeda7c5cff97f50393b6b9d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type ArtworkRatingEnum = "safe" | "r_18" | "r_18g" | "%future added value";
export type UpdateArtworkInput = {
  id: string;
  title: string;
  caption: string;
  tags: ReadonlyArray<string>;
  rating?: ArtworkRatingEnum | null;
  clientMutationId?: string | null;
};
export type UpdateArtworkMutation$variables = {
  input: UpdateArtworkInput;
};
export type UpdateArtworkMutationVariables = UpdateArtworkMutation$variables;
export type UpdateArtworkMutation$data = {
  readonly updateArtwork: {
    readonly artwork: {
      readonly id: string;
      readonly title: string;
      readonly caption: string;
      readonly rating: ArtworkRatingEnum;
      readonly tags: {
        readonly edges: ReadonlyArray<{
          readonly node: {
            readonly name: string;
          } | null;
        } | null>;
      } | null;
    } | null;
  } | null;
};
export type UpdateArtworkMutationResponse = UpdateArtworkMutation$data;
export type UpdateArtworkMutation = {
  variables: UpdateArtworkMutationVariables;
  response: UpdateArtworkMutation$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "caption",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rating",
  "storageKey": null
},
v6 = {
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
    "name": "UpdateArtworkMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateArtworkPayload",
        "kind": "LinkedField",
        "name": "updateArtwork",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Artwork",
            "kind": "LinkedField",
            "name": "artwork",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "TagConnection",
                "kind": "LinkedField",
                "name": "tags",
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
                          (v6/*: any*/)
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
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "UpdateArtworkMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateArtworkPayload",
        "kind": "LinkedField",
        "name": "updateArtwork",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Artwork",
            "kind": "LinkedField",
            "name": "artwork",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "TagConnection",
                "kind": "LinkedField",
                "name": "tags",
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
                          (v6/*: any*/),
                          (v2/*: any*/)
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
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "7ee0513f40b884341cf553a200b6dc3c",
    "id": null,
    "metadata": {},
    "name": "UpdateArtworkMutation",
    "operationKind": "mutation",
    "text": "mutation UpdateArtworkMutation(\n  $input: UpdateArtworkInput!\n) {\n  updateArtwork(input: $input) {\n    artwork {\n      id\n      title\n      caption\n      rating\n      tags {\n        edges {\n          node {\n            name\n            id\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "2780761dd232ff8520d718d00f433808";

export default node;
