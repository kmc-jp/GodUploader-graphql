/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkListItem_artwork = {
    readonly id: string;
    readonly title: string;
    readonly caption: string;
    readonly nsfw: boolean;
    readonly topIllust: {
        readonly filename: string;
    } | null;
    readonly account: {
        readonly name: string;
    } | null;
    readonly " $refType": "ArtworkListItem_artwork";
};
export type ArtworkListItem_artwork$data = ArtworkListItem_artwork;
export type ArtworkListItem_artwork$key = {
    readonly " $data"?: ArtworkListItem_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkListItem_artwork">;
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
          "name": "filename",
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
(node as any).hash = '8bc35f82950e82690b3e92d04dba7e2e';
export default node;
