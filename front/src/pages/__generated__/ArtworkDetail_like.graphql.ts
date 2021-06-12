/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkDetail_like = {
    readonly account: {
        readonly id: string;
        readonly kmcid: string;
    } | null;
    readonly " $refType": "ArtworkDetail_like";
};
export type ArtworkDetail_like$data = ArtworkDetail_like;
export type ArtworkDetail_like$key = {
    readonly " $data"?: ArtworkDetail_like$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkDetail_like">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtworkDetail_like",
  "selections": [
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
          "name": "id",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "kmcid",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Like",
  "abstractKey": null
};
(node as any).hash = '88f74ade47fc36e9bad069458d6ee163';
export default node;
