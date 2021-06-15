import { graphql } from "babel-plugin-relay/macro";
import { Environment, commitMutation } from "react-relay";
import { MutationConfig } from "relay-runtime";
import type { UploadArtworkMutation } from "./__generated__/UploadArtworkMutation.graphql";

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
  config: Omit<MutationConfig<UploadArtworkMutation>, "mutation">
) => {
  return commitMutation<UploadArtworkMutation>(environment, {
    mutation: graphql`
      mutation UploadArtworkMutation(
        $connections: [ID!]!
        $input: UploadArtworkInput!
      ) {
        uploadArtwork(input: $input) {
          artwork
            @appendNode(
              connections: $connections
              edgeTypeName: "ArtworkEdge"
            ) {
            id
          }
        }
      }
    `,
    ...config,
  });
};
