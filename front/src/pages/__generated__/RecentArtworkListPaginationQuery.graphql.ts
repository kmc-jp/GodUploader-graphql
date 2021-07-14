/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type RecentArtworkListPaginationQueryVariables = {
    count?: number | null;
    cursor?: string | null;
    safeOnly?: boolean | null;
};
export type RecentArtworkListPaginationQueryResponse = {
    readonly " $fragmentRefs": FragmentRefs<"RecentArtworks_artworks">;
};
export type RecentArtworkListPaginationQuery = {
    readonly response: RecentArtworkListPaginationQueryResponse;
    readonly variables: RecentArtworkListPaginationQueryVariables;
};



/*
query RecentArtworkListPaginationQuery(
  $safeOnly: Boolean = true
) {
  ...RecentArtworks_artworks_1MgKj9
}

fragment ArtworkListItem_artwork on Artwork {
  id
  title
  caption
  nsfw
  topIllust {
    thumbnailUrl
    id
  }
  account {
    name
    id
  }
}

fragment RecentArtworks_artworks_1MgKj9 on Query {
  artworks(first: 8, sort: [CREATED_AT_DESC], safeOnly: $safeOnly) {
    edges {
      node {
        ...ArtworkListItem_artwork
        id
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": 40,
    "kind": "LocalArgument",
    "name": "count"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "cursor"
  },
  {
    "defaultValue": true,
    "kind": "LocalArgument",
    "name": "safeOnly"
  }
],
v1 = {
  "kind": "Variable",
  "name": "safeOnly",
  "variableName": "safeOnly"
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RecentArtworkListPaginationQuery",
    "selections": [
      {
        "args": [
          {
            "kind": "Variable",
            "name": "count",
            "variableName": "count"
          },
          {
            "kind": "Variable",
            "name": "cursor",
            "variableName": "cursor"
          },
          (v1/*: any*/)
        ],
        "kind": "FragmentSpread",
        "name": "RecentArtworks_artworks"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RecentArtworkListPaginationQuery",
    "selections": [
      {
        "alias": null,
        "args": [
          {
            "kind": "Literal",
            "name": "first",
            "value": 8
          },
          (v1/*: any*/),
          {
            "kind": "Literal",
            "name": "sort",
            "value": [
              "CREATED_AT_DESC"
            ]
          }
        ],
        "concreteType": "ArtworkConnection",
        "kind": "LinkedField",
        "name": "artworks",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ArtworkEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Artwork",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
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
                    "args": null,
                    "kind": "ScalarField",
                    "name": "nsfw",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Illust",
                    "kind": "LinkedField",
                    "name": "topIllust",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "thumbnailUrl",
                        "storageKey": null
                      },
                      (v2/*: any*/)
                    ],
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
                        "name": "name",
                        "storageKey": null
                      },
                      (v2/*: any*/)
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
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "b13a369d27452a9fa0d5aa517d82a3c1",
    "id": null,
    "metadata": {},
    "name": "RecentArtworkListPaginationQuery",
    "operationKind": "query",
    "text": "query RecentArtworkListPaginationQuery(\n  $safeOnly: Boolean = true\n) {\n  ...RecentArtworks_artworks_1MgKj9\n}\n\nfragment ArtworkListItem_artwork on Artwork {\n  id\n  title\n  caption\n  nsfw\n  topIllust {\n    thumbnailUrl\n    id\n  }\n  account {\n    name\n    id\n  }\n}\n\nfragment RecentArtworks_artworks_1MgKj9 on Query {\n  artworks(first: 8, sort: [CREATED_AT_DESC], safeOnly: $safeOnly) {\n    edges {\n      node {\n        ...ArtworkListItem_artwork\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();
(node as any).hash = '9724d7bf8b6308b55161a01c8002f2e0';
export default node;
