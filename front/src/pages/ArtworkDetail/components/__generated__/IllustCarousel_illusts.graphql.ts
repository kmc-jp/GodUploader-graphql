/**
 * @generated SignedSource<<7d770dabd8db31596779fcabbea72d0d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type IllustCarousel_illusts$data = {
  readonly illusts: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly imageUrl: string;
        readonly thumbnailUrl: string;
      } | null;
    } | null>;
  } | null;
  readonly " $fragmentType": "IllustCarousel_illusts";
};
export type IllustCarousel_illusts = IllustCarousel_illusts$data;
export type IllustCarousel_illusts$key = {
  readonly " $data"?: IllustCarousel_illusts$data;
  readonly " $fragmentSpreads": FragmentRefs<"IllustCarousel_illusts">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "IllustCarousel_illusts",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "IllustConnection",
      "kind": "LinkedField",
      "name": "illusts",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "IllustEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Illust",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
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
                  "name": "imageUrl",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "thumbnailUrl",
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

(node as any).hash = "792772302942d400c6387a46c3e3cb28";

export default node;
