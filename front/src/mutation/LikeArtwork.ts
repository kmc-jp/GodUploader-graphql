import { graphql } from "babel-plugin-relay/macro";
import { Environment, commitMutation } from "react-relay";
import {
  LikeArtworkInput,
  LikeArtworkMutation,
} from "./__generated__/LikeArtworkMutation.graphql";

export const commitLikeArtworkMutation = (
  environment: Environment,
  input: LikeArtworkInput,
  connections?: string[],
) => {
  return commitMutation<LikeArtworkMutation>(environment, {
    mutation: graphql`
      mutation LikeArtworkMutation(
        $connections: [ID!]!
        $input: LikeArtworkInput!
      ) {
        likeArtwork(input: $input) {
          like @prependNode(connections: $connections, edgeTypeName: "LikeEdge") {
            id
            account {
              id
              kmcid
            }
          }
        }
      }
    `,
    variables: { input, connections: connections || [] },
  });
};
