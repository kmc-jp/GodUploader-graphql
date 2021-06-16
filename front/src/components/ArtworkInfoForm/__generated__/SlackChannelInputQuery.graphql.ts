/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
export type SlackChannelInputQueryVariables = {};
export type SlackChannelInputQueryResponse = {
    readonly allSlackChannels: ReadonlyArray<{
        readonly id: string;
        readonly name: string;
    } | null>;
};
export type SlackChannelInputQuery = {
    readonly response: SlackChannelInputQueryResponse;
    readonly variables: SlackChannelInputQueryVariables;
};



/*
query SlackChannelInputQuery {
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
    "name": "SlackChannelInputQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SlackChannelInputQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "9ed28239a1042837f996bedfcff0c247",
    "id": null,
    "metadata": {},
    "name": "SlackChannelInputQuery",
    "operationKind": "query",
    "text": "query SlackChannelInputQuery {\n  allSlackChannels {\n    id\n    name\n  }\n}\n"
  }
};
})();
(node as any).hash = '5a637c9f1771b836829179b7784ef074';
export default node;
