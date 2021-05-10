import { graphql } from "babel-plugin-relay/macro";
import { Environment, commitMutation } from "react-relay";
import { LikeArtworkInput, LikeArtworkMutation } from "./__generated__/LikeArtworkMutation.graphql"

export const commitLikeArtworkMutation = (
  environment: Environment,
  input: LikeArtworkInput
) => {
  return commitMutation<LikeArtworkMutation>(environment, {
    mutation: graphql`
      mutation LikeArtworkMutation($input: LikeArtworkInput!) {
        likeArtwork(input: $input) {
          like {
            id
            account {
              id
              kmcid
            }
          }
        }
      }
    `,
    variables: { input },
  });
};
