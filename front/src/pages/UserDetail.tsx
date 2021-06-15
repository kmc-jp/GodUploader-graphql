import React, { useCallback } from "react";
import { graphql } from "babel-plugin-relay/macro";
import {
  PreloadedQuery,
  usePaginationFragment,
  usePreloadedQuery,
} from "react-relay";
import { UserDetailQuery } from "./__generated__/UserDetailQuery.graphql";
import { UserDetail_artworks$key } from "./__generated__/UserDetail_artworks.graphql";
import { ArtworkListPaginationQuery } from "./__generated__/ArtworkListPaginationQuery.graphql";
import { ArtworkListItem } from "../components/ArtworkListItem";

export const userDetailQuery = graphql`
  query UserDetailQuery($kmcid: String!) {
    accountByKmcid(kmcid: $kmcid) {
      name
      ...UserDetail_artworks
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

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="text-center">{user.name}の作品置場</h2>
        </div>
        <ArtworkList user={user} />
      </div>
    </div>
  );
};

const ArtworkList: React.VFC<{ user: UserDetail_artworks$key }> = ({
  user,
}) => {
  const {
    data: { artworks },
    loadPrevious,
    hasPrevious,
    isLoadingPrevious,
  } = usePaginationFragment<
    ArtworkListPaginationQuery,
    UserDetail_artworks$key
  >(
    graphql`
      fragment UserDetail_artworks on Account
      @argumentDefinitions(
        cursor: { type: "String" }
        count: { type: "Int", defaultValue: 40 }
      )
      @refetchable(queryName: "ArtworkListPaginationQuery") {
        artworks(last: $count, before: $cursor)
          @connection(key: "UserDetail_artworks") {
          edges {
            node {
              ...ArtworkListItem_artwork
            }
          }
        }
      }
    `,
    user
  );

  const handleLoadArtworks = useCallback(() => {
    if (!hasPrevious || isLoadingPrevious) {
      return;
    }

    loadPrevious(20);
  }, [hasPrevious, isLoadingPrevious, loadPrevious]);

  const edges = artworks?.edges;
  if (!edges) {
    return null;
  }
  const reversedEdges = edges.slice().reverse();

  return (
    <div className="card-body">
      <div className="row row-cols-4">
        {reversedEdges.map((edge, i) => {
          if (!(edge && edge.node)) {
            return null;
          }

          return (
            <div key={i} className="col p-2">
              <ArtworkListItem artwork={edge.node} />
            </div>
          );
        })}
      </div>
      {hasPrevious && (
        <div className="d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-lg btn-secondary w-100"
            onClick={handleLoadArtworks}
            disabled={isLoadingPrevious || !hasPrevious}
          >
            {isLoadingPrevious ? (
              <div className="spinner-border text-light" role="status">
                <span className="visually-hidden">Uploading...</span>
              </div>
            ) : (
              "もっと読み込む"
            )}
          </button>
        </div>
      )}
    </div>
  );
};
