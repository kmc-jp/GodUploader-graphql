import { graphql } from "react-relay";
import { redirect } from "react-router";
import { fetchQuery } from "relay-runtime";

import RelayEnvironment from "../RelayEnvironment";
import type { RedirectToMyPageQuery } from "./__generated__/RedirectToMyPageQuery.graphql";

const redirectToMyPageQuery = graphql`
  query RedirectToMyPageQuery {
    viewer {
      kmcid
    }
  }
`;

export async function loader() {
  const data = await fetchQuery<RedirectToMyPageQuery>(
    RelayEnvironment,
    redirectToMyPageQuery,
    {},
    { fetchPolicy: "store-or-network" },
  ).toPromise();
  return redirect(data?.viewer ? `/users/${data.viewer.kmcid}` : "/");
}
