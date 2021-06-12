/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkComment_comments = {
    readonly comments: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly text: string;
                readonly createdAt: string;
                readonly account: {
                    readonly kmcid: string;
                } | null;
            } | null;
        } | null>;
    } | null;
    readonly " $refType": "ArtworkComment_comments";
};
export type ArtworkComment_comments$data = ArtworkComment_comments;
export type ArtworkComment_comments$key = {
    readonly " $data"?: ArtworkComment_comments$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkComment_comments">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtworkComment_comments",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "last",
          "value": 1000000
        }
      ],
      "concreteType": "CommentConnection",
      "kind": "LinkedField",
      "name": "comments",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "CommentEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Comment",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "text",
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "createdAt",
                  "storageKey": null
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
      "storageKey": "comments(last:1000000)"
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
(node as any).hash = '58e59e707a7661fc47ca25d958a5ad68';
export default node;
