import { graphql } from "babel-plugin-relay/macro";
import { Environment, commitMutation } from "react-relay";
import type { MutationConfig } from "relay-runtime";
import type { LikeArtworkMutation } from "./__generated__/LikeArtworkMutation.graphql";

export const commitLikeArtworkMutation = (
  environment: Environment,
  config: Omit<MutationConfig<LikeArtworkMutation>, "mutation">
) => {
  return commitMutation<LikeArtworkMutation>(environment, {
    mutation: graphql`
      mutation LikeArtworkMutation(
        $connections: [ID!]!
        $input: LikeArtworkInput!
      ) {
        likeArtwork(input: $input) {
          like
            @appendNode(connections: $connections, edgeTypeName: "LikeEdge") {
            id
            account {
              id
              kmcid
            }
          }
        }
      }
    `,
    ...config,
  });
};
