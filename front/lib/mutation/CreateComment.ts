import { graphql } from "babel-plugin-relay/macro";
import { Environment, commitMutation } from "react-relay";
import type { MutationConfig } from "relay-runtime";

import type { CreateCommentMutation } from "./__generated__/CreateCommentMutation.graphql";

export const commitCreateCommentMutation = (
  environment: Environment,
  config: Omit<MutationConfig<CreateCommentMutation>, "mutation">
) => {
  return commitMutation<CreateCommentMutation>(environment, {
    mutation: graphql`
      mutation CreateCommentMutation(
        $connections: [ID!]!
        $input: CreateCommentInput!
      ) {
        createComment(input: $input) {
          comment
            @appendNode(
              connections: $connections
              edgeTypeName: "CommentEdge"
            ) {
            text
            createdAt
            account {
              kmcid
            }
          }
        }
      }
    `,
    ...config,
  });
};
