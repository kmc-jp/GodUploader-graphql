/**
 * @generated SignedSource<<9c85f9f8220d7be9f52c0d5325bba67e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type UpdateInfoForm_account$data = {
  readonly kmcid: string;
  readonly name: string;
  readonly " $fragmentType": "UpdateInfoForm_account";
};
export type UpdateInfoForm_account$key = {
  readonly " $data"?: UpdateInfoForm_account$data;
  readonly " $fragmentSpreads": FragmentRefs<"UpdateInfoForm_account">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UpdateInfoForm_account",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "kmcid",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    }
  ],
  "type": "Account",
  "abstractKey": null
};

(node as any).hash = "4acb97f2d49c919dffb897eb7ede8723";

export default node;
