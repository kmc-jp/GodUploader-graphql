/**
 * @generated SignedSource<<662e47a1b6938dcf2856f4d23b29e1bb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type ArtworkRatingEnum = "safe" | "r_18" | "r_18g" | "%future added value";
export type SlackShareOptionEnum = "NONE" | "SHARE_TO_SLACK" | "SHARE_TO_SLACK_WITH_IMAGE" | "%future added value";
export type TwitterShareOption = {
  share: boolean,
  userName: string,
}
export type UploadArtworkInput = {
  title: string;
  caption: string;
  tags: ReadonlyArray<string>;
  rating: ArtworkRatingEnum;
  shareOption?: SlackShareOptionEnum | null;
  twitterShareOption: TwitterShareOption;
  channelId?: string | null;
  twitterShareOption?: TwitterShareOption | null;
  files: ReadonlyArray<null>;
  clientMutationId?: string | null;
};
export type TwitterShareOption = {
  share: boolean;
  username?: string | null;
};
export type UploadArtworkMutation$variables = {
  connections: ReadonlyArray<string>;
  input: UploadArtworkInput;
};
export type UploadArtworkMutation$data = {
  readonly uploadArtwork: {
    readonly artwork: {
      readonly id: string;
    } | null;
  } | null;
};
export type UploadArtworkMutation = {
  variables: UploadArtworkMutation$variables;
  response: UploadArtworkMutation$data;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "connections"
  },
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
  "concreteType": "Artwork",
  "kind": "LinkedField",
  "name": "artwork",
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
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "UploadArtworkMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UploadArtworkPayload",
        "kind": "LinkedField",
        "name": "uploadArtwork",
        "plural": false,
        "selections": [
          (v2/*: any*/)
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
    "name": "UploadArtworkMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UploadArtworkPayload",
        "kind": "LinkedField",
        "name": "uploadArtwork",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "appendNode",
            "key": "",
            "kind": "LinkedHandle",
            "name": "artwork",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "connections"
              },
              {
                "kind": "Literal",
                "name": "edgeTypeName",
                "value": "ArtworkEdge"
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "e67ea75ff96603ef41b070b644364a6e",
    "id": null,
    "metadata": {},
    "name": "UploadArtworkMutation",
    "operationKind": "mutation",
    "text": "mutation UploadArtworkMutation(\n  $input: UploadArtworkInput!\n) {\n  uploadArtwork(input: $input) {\n    artwork {\n      id\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "fb8f373e074e65e416568c933388eee4";

export default node;
