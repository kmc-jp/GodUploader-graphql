/**
 * @generated SignedSource<<947a40bff63c1a40f6465d188a05108d>>
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
        readonly webpUrl: string;
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
                  "name": "webpUrl",
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

(node as any).hash = "e0a5cbaac50ca25ef5d7079e085a396d";

export default node;
