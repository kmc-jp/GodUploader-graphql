/**
 * @generated SignedSource<<2a4cf3997d5f6684b0947122ea01080b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type ArtworkListItem_artwork$data = {
  readonly account: {
    readonly name: string;
  } | null;
  readonly caption: string;
  readonly id: string;
  readonly nsfw: boolean;
  readonly title: string;
  readonly topIllust: {
    readonly thumbnailUrl: string;
  } | null;
  readonly " $fragmentType": "ArtworkListItem_artwork";
};
export type ArtworkListItem_artwork$key = {
  readonly " $data"?: ArtworkListItem_artwork$data;
  readonly " $fragmentSpreads": FragmentRefs<"ArtworkListItem_artwork">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtworkListItem_artwork",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
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
        }
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
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "name",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};

(node as any).hash = "7e366bd9ec07d8f09e5e2155ac5d0b14";

export default node;
