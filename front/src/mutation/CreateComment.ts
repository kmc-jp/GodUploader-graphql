import { graphql } from "babel-plugin-relay/macro";
import { Environment, commitMutation } from "react-relay";
import { CreateCommentInput } from "./__generated__/CreateCommentMutation.graphql";

export const commitCreateCommentMutation = (
  environment: Environment,
  input: CreateCommentInput,
  connections?: string[]
) => {
  return commitMutation(environment, {
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
    variables: { input, connections: connections || [] },
  });
};
