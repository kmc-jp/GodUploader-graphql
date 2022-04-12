/**
 * @generated SignedSource<<67d7708c4c3be59a2b9e684fcc170519>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type ArtworkRatingEnum = "safe" | "r_18" | "r_18g" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type UpdateArtworkForm_artwork$data = {
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
  readonly " $fragmentType": "UpdateArtworkForm_artwork";
};
export type UpdateArtworkForm_artwork = UpdateArtworkForm_artwork$data;
export type UpdateArtworkForm_artwork$key = {
  readonly " $data"?: UpdateArtworkForm_artwork$data;
  readonly " $fragmentSpreads": FragmentRefs<"UpdateArtworkForm_artwork">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UpdateArtworkForm_artwork",
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
      "name": "rating",
      "storageKey": null
    },
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
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};

(node as any).hash = "968e05fd935b0d1d4659f273c429f3f7";

export default node;
