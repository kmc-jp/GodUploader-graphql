import { graphql } from "babel-plugin-relay/macro";
import { commitMutation, Environment, MutationConfig } from "relay-runtime";
import { UpdateAccountMutation } from "./__generated__/UpdateAccountMutation.graphql";

export const commitUpdateAccountMutation = (
  environment: Environment,
  config: Omit<MutationConfig<UpdateAccountMutation>, "mutation">
) => {
  return commitMutation<UpdateAccountMutation>(environment, {
    mutation: graphql`
      mutation UpdateAccountMutation($input: UpdateAccountInput!) {
        updateAccount(input: $input) {
          account {
            id
            kmcid
            name
          }
        }
      }
    `,
    ...config,
  });
};
