import { graphql } from "babel-plugin-relay/macro";
import React, { useMemo } from "react";
import { useLazyLoadQuery } from "react-relay";
import { Link, useParams } from "react-router-dom";

import { UserLikesQuery } from "./__generated__/UserLikesQuery.graphql";

export const UserLikes: React.VFC = () => {
  const { kmcid } = useParams<{ kmcid: string }>();
  const { user } = useLazyLoadQuery<UserLikesQuery>(
    graphql`
      query UserLikesQuery($kmcid: String!) {
        user: accountByKmcid(kmcid: $kmcid) {
          name
          likes {
            edges {
              node {
                id
                artwork {
                  id
                  title
                }
              }
            }
          }
        }
      }
    `,
    { kmcid },
    { fetchPolicy: "store-and-network" }
  );
  const aggregatedLikes = useMemo(() => {
    const edges = user?.likes?.edges;
    if (!edges) {
      return [];
    }

    return edges.flatMap((edge) => (edge?.node ? [edge.node] : []));
  }, [user?.likes?.edges]);

  if (!user) {
    return <div>user not found</div>;
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-center mb-4">{user.name}がいいねした作品一覧</h2>
      </div>
      <div className="card-body">
        <ul>
          {aggregatedLikes.map((node) => {
            if (!node.artwork) {
              return null;
            }

            return (
              <li key={node.id}>
                <Link to={`/artwork/${node.artwork.id}`}>
                  {node.artwork.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
