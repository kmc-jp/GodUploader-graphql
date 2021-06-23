import { graphql } from "babel-plugin-relay/macro";
import { PreloadedQuery, usePreloadedQuery } from "react-relay";
import { Redirect } from "react-router-dom";

import type { RedirectToMyPageQuery } from "./__generated__/RedirectToMyPageQuery.graphql";

const redirectToMyPageQuery = graphql`
  query RedirectToMyPageQuery {
    viewer {
      kmcid
    }
  }
`;

interface Props {
  prepared: {
    viewer: PreloadedQuery<RedirectToMyPageQuery>;
  };
}

export const RedirectToMyPage: React.VFC<Props> = ({ prepared }) => {
  const { viewer } = usePreloadedQuery(redirectToMyPageQuery, prepared.viewer);
  if (!viewer) {
    return <Redirect to="/" />;
  }

  return <Redirect to={`/users/${viewer.kmcid}`} />;
};
