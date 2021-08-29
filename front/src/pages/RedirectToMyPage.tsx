import { graphql } from "babel-plugin-relay/macro";
import { useLazyLoadQuery } from "react-relay";
import { Redirect } from "react-router-dom";

import type { RedirectToMyPageQuery } from "./__generated__/RedirectToMyPageQuery.graphql";

const redirectToMyPageQuery = graphql`
  query RedirectToMyPageQuery {
    viewer {
      kmcid
    }
  }
`;

export const RedirectToMyPage: React.VFC = () => {
  const { viewer } = useLazyLoadQuery<RedirectToMyPageQuery>(
    redirectToMyPageQuery,
    {},
    { fetchPolicy: "store-or-network" }
  );
  if (!viewer) {
    return <Redirect to="/" />;
  }

  return <Redirect to={`/users/${viewer.kmcid}`} />;
};
