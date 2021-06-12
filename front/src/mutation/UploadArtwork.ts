import { graphql } from "babel-plugin-relay/macro";
import { Environment, commitMutation } from "react-relay";
import { UploadableMap } from "relay-runtime";
import {
  UploadArtworkInput,
  UploadArtworkMutation,
  UploadArtworkMutationResponse,
} from "./__generated__/UploadArtworkMutation.graphql";

type UploadableReturnType = {
  [K in number]: File;
};

export const makeUploadables = (files: FileList): UploadableReturnType => {
  const uploadables: UploadableReturnType = {};
  for (let i = 0; i < files.length; i++) {
    uploadables[i] = files[i];
  }
  return uploadables;
};

export const commitUploadArtworkMutation = (
  environment: Environment,
  input: UploadArtworkInput,
  uploadables: UploadableMap,
  onCompleted?: (response: UploadArtworkMutationResponse) => void
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
    onCompleted,
  });
};
