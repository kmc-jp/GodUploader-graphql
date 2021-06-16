/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type SlackChannelListQueryVariables = {};
export type SlackChannelListQueryResponse = {
    readonly allSlackChannels: ReadonlyArray<{
        readonly id: string;
        readonly name: string;
    } | null>;
};
export type SlackChannelListQuery = {
    readonly response: SlackChannelListQueryResponse;
    readonly variables: SlackChannelListQueryVariables;
};



/*
query SlackChannelListQuery {
  allSlackChannels {
    id
    name
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "SlackChannel",
    "kind": "LinkedField",
    "name": "allSlackChannels",
    "plural": true,
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
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "SlackChannelListQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SlackChannelListQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "ef5a933d8603249d8f24b658cbda1da4",
    "id": null,
    "metadata": {},
    "name": "SlackChannelListQuery",
    "operationKind": "query",
    "text": "query SlackChannelListQuery {\n  allSlackChannels {\n    id\n    name\n  }\n}\n"
  }
};
})();
(node as any).hash = '6a707d6c55c4aa814cc3940eba20e002';
export default node;
