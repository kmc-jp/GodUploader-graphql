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
    userDetailQuery: PreloadedQuery<UserDetailQuery, Record<string, any>>;
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
      <h2>{user.name}の作品置場</h2>
      {artworkEdges.map((edge, i) => {
        if (!edge) {
          return null;
        }

        return <ArtworkListItem artwork={edge.node!} key={i} />;
      })}
    </div>
  );
};
