import React from "react";
import { PreloadedQuery, usePreloadedQuery } from "react-relay";
import { graphql } from "babel-plugin-relay/macro";
import { UserDetailQuery } from "./__generated__/UserDetailQuery.graphql";
import { ArtworkListItem } from "../components/ArtworkListItem";

export const userDetailQuery = graphql`
  query UserDetailQuery($kmcid: String!) {
    accountByKmcid(kmcid: $kmcid) {
      name
      artworks {
        edges {
          node {
            ...ArtworkListItem_artwork
          }
        }
      }
    }
  }
`;

interface UserDetailProps {
  prepared: {
    userDetailQuery: PreloadedQuery<UserDetailQuery>;
  };
}

export const UserDetail: React.FC<UserDetailProps> = ({ prepared }) => {
  const { accountByKmcid: user } = usePreloadedQuery(
    userDetailQuery,
    prepared.userDetailQuery
  );
  if (!user) {
    return <div>user not found</div>;
  }
  const artworkEdges = user.artworks!.edges.slice().reverse();

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="text-center">{user.name}の作品置場</h2>
        </div>
        <div className="card-body">
          <div className="row row-cols-4">
            {artworkEdges.map((edge, i) => {
              if (!edge) {
                return null;
              }

              return (
                <div key={i} className="col p-2">
                  <ArtworkListItem artwork={edge.node!} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
