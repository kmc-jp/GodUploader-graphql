/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkLikeList_like = {
    readonly account: {
        readonly id: string;
        readonly kmcid: string;
    } | null;
    readonly " $refType": "ArtworkLikeList_like";
};
export type ArtworkLikeList_like$data = ArtworkLikeList_like;
export type ArtworkLikeList_like$key = {
    readonly " $data"?: ArtworkLikeList_like$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkLikeList_like">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtworkLikeList_like",
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
(node as any).hash = '975f528f7d6050ba8e1bc66f33b0ed02';
export default node;
