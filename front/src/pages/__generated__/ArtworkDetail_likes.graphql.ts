/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkDetail_likes = {
    readonly edges: ReadonlyArray<{
        readonly node: {
            readonly account: {
                readonly id: string;
                readonly kmcid: string;
            } | null;
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
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "LikeConnection",
  "abstractKey": null
};
(node as any).hash = '0df89427a164f1e44b70e1a9c529d1bf';
export default node;
