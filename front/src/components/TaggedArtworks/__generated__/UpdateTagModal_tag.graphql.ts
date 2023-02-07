/**
 * @generated SignedSource<<4a10fd506c4de50120d5d0c3f6f13ea4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type UpdateTagModal_tag$data = {
  readonly canonicalName: string;
  readonly id: string;
  readonly name: string;
  readonly " $fragmentType": "UpdateTagModal_tag";
};
export type UpdateTagModal_tag$key = {
  readonly " $data"?: UpdateTagModal_tag$data;
  readonly " $fragmentSpreads": FragmentRefs<"UpdateTagModal_tag">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UpdateTagModal_tag",
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
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "canonicalName",
      "storageKey": null
    }
  ],
  "type": "Tag",
  "abstractKey": null
};

(node as any).hash = "0d4e22022cfffb1e386cefd59ae2cfd6";

export default node;
