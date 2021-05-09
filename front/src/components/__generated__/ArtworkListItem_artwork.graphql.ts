/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkListItem_artwork = {
    readonly id: string;
    readonly title: string;
    readonly caption: string;
    readonly illusts: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly filename: string;
            } | null;
        } | null>;
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
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 1
        }
      ],
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
                  "name": "filename",
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "illusts(first:1)"
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
(node as any).hash = '262b3d29c56d4c24946944ee7dc3c73a';
export default node;
