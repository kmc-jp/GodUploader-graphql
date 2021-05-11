import { graphql } from "babel-plugin-relay/macro";
import { Environment, commitMutation } from "react-relay";
import { UploadArtworkInput, UploadArtworkMutation } from "./__generated__/UploadArtworkMutation.graphql"

export const commitUploadArtworkMutation = (
  environment: Environment,
  input: UploadArtworkInput,
  uploadables: { file: File },
) => {
  return commitMutation<UploadArtworkMutation>(environment, {
    mutation: graphql`
      mutation UploadArtworkMutation($input: UploadArtworkInput!) {
        uploadArtwork(input: $input) {
          artwork {
            id
          }
        }
      }
    `,
    variables: { input },
    uploadables,
  });
};
