import { graphql } from "babel-plugin-relay/macro";
import { Environment, commitMutation } from "react-relay";
import { MutationConfig, UploadableMap } from "relay-runtime";

import type { UploadArtworkMutation } from "./__generated__/UploadArtworkMutation.graphql";

export const makeUploadablesFromFileList = (
  objectPath: string,
  files: FileList
): UploadableMap =>
  Object.fromEntries<File>(
    Array.from(files, (file, i) => [`${objectPath}.${i}`, file])
  );

export const makeUploadablesFromBlob = (
  objectPath: string,
  blob: Blob
): UploadableMap => ({ [`${objectPath}.0`]: blob });

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
