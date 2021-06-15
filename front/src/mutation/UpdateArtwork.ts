import { graphql } from "babel-plugin-relay/macro";
import { commitMutation, Environment, MutationConfig } from "relay-runtime";
import { UpdateArtworkMutation } from "./__generated__/UpdateArtworkMutation.graphql";

export const commitUpdateArtworkMutation = (
  environment: Environment,
  config: Omit<MutationConfig<UpdateArtworkMutation>, "mutation">
) => {
  return commitMutation<UpdateArtworkMutation>(environment, {
    mutation: graphql`
      mutation UpdateArtworkMutation($input: UpdateArtworkInput!) {
        updateArtwork(input: $input) {
          artwork {
            id
            title
            caption
            tags {
              edges {
                node {
                  name
                }
              }
            }
          }
        }
      }
    `,
    ...config,
  });
};
