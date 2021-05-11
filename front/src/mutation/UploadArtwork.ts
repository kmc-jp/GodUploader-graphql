import { graphql } from "babel-plugin-relay/macro";
import { Environment, commitMutation } from "react-relay";
import { UploadArtworkInput, UploadArtworkMutation, UploadArtworkMutationResponse } from "./__generated__/UploadArtworkMutation.graphql"

export const commitUploadArtworkMutation = (
  environment: Environment,
  input: UploadArtworkInput,
  files: FileList,
  onCompleted?: (response: UploadArtworkMutationResponse) => void,
) => {
  const uploadables = Array.from(files).reduce((file, current, i) => { (current as any)[i] = file; return current}, {});
  console.log(Array.from(files));
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
    onCompleted,
  });
};
