import { graphql } from "react-relay";
import { useLazyLoadQuery } from "react-relay";
import { Navigate } from "react-router";

import type { RedirectToMyPageQuery } from "./__generated__/RedirectToMyPageQuery.graphql";

export const RedirectToMyPage: React.FC = () => {
  const { viewer } = useLazyLoadQuery<RedirectToMyPageQuery>(
    graphql`
      query RedirectToMyPageQuery {
        viewer {
          kmcid
        }
      }
    `,
    {},
    { fetchPolicy: "store-or-network" },
  );
  if (!viewer) {
    return <Navigate to="/" replace />;
  }

  return <Navigate to={`/users/${viewer.kmcid}`} replace />;
};
