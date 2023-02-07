/**
 * @generated SignedSource<<a4ffd0e35b19574dbebcad9bf5b3136b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
export type ArtworkRatingEnum = "r_18" | "r_18g" | "safe" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type UpdateArtworkForm_artwork$data = {
  readonly caption: string;
  readonly id: string;
  readonly rating: ArtworkRatingEnum;
  readonly tags: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly name: string;
      } | null;
    } | null>;
  } | null;
  readonly title: string;
  readonly " $fragmentType": "UpdateArtworkForm_artwork";
};
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
