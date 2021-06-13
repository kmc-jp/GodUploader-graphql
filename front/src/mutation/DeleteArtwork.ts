import { graphql } from "babel-plugin-relay/macro";
import { commitMutation, Environment, MutationConfig } from "relay-runtime";
import { DeleteArtworkMutation } from "./__generated__/DeleteArtworkMutation.graphql";

export const commitDeleteArtworkMutation = (
  environment: Environment,
  config: Omit<MutationConfig<DeleteArtworkMutation>, 'mutation'>
) => {
  return commitMutation<DeleteArtworkMutation>(environment, {
    mutation: graphql`
      mutation DeleteArtworkMutation(
        $connections: [ID!]!
        $input: DeleteArtworkInput!
      ) {
        deleteArtwork(input: $input) {
          deletedArtworkId @deleteEdge(connections: $connections)
        }
      }
    `,
    ...config,
  });
};
