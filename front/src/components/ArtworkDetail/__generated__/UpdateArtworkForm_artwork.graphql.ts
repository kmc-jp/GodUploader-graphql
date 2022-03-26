/**
 * @generated SignedSource<<514081fadaf2c70cd887c97c445b9273>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type UpdateArtworkForm_artwork$data = {
  readonly id: string;
  readonly title: string;
  readonly caption: string;
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

(node as any).hash = "8dee8ca99b7ccb3a71db45e5ebd29adf";

export default node;
