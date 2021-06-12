/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkDetail_likes = {
    readonly edges: ReadonlyArray<{
        readonly node: {
            readonly " $fragmentRefs": FragmentRefs<"ArtworkDetail_like">;
        } | null;
    } | null>;
    readonly " $refType": "ArtworkDetail_likes";
};
export type ArtworkDetail_likes$data = ArtworkDetail_likes;
export type ArtworkDetail_likes$key = {
    readonly " $data"?: ArtworkDetail_likes$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkDetail_likes">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtworkDetail_likes",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "LikeEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Like",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "ArtworkDetail_like"
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "LikeConnection",
  "abstractKey": null
};
(node as any).hash = '389e4dc7abf2d6c1678a0da6eb82fdd9';
export default node;
