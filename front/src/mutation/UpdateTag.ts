import { graphql } from "babel-plugin-relay/macro";
import { Environment, commitMutation } from "react-relay";
import type { MutationConfig } from "relay-runtime";

import type { UpdateTagMutation } from "./__generated__/UpdateTagMutation.graphql";

export const commitUpdateTagMutation = (
  environment: Environment,
  config: Omit<MutationConfig<UpdateTagMutation>, "mutation">
) => {
  return commitMutation<UpdateTagMutation>(environment, {
    mutation: graphql`
      mutation UpdateTagMutation($input: UpdateTagInput!) {
        updateTag(input: $input) {
          tag {
            id
            name
          }
        }
      }
    `,
    ...config,
  });
};
