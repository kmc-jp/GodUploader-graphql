import { graphql } from "babel-plugin-relay/macro";
import React, { useCallback } from "react";
import InfiniteScroll from "react-infinite-scroller";
import {
  useLazyLoadQuery,
  usePaginationFragment,
} from "react-relay";
import { useParams } from "react-router-dom";

import { ArtworkListItem } from "../components/ArtworkListItem";
import { UpdateAccountModal } from "./UserDetail/UpdateInfoForm";
import { ArtworkListPaginationQuery } from "./__generated__/ArtworkListPaginationQuery.graphql";
import { UserDetailQuery } from "./__generated__/UserDetailQuery.graphql";
import { UserDetail_artworks$key } from "./__generated__/UserDetail_artworks.graphql";

const userDetailQuery = graphql`
  query UserDetailQuery($kmcid: String!) {
    viewer {
      id
    }
    accountByKmcid(kmcid: $kmcid) {
      id
      kmcid
      name
      ...UserDetail_artworks
    }
  }
`;

export const UserDetail: React.FC = () => {
  const { kmcid } = useParams<{ kmcid: string }>();
  const { viewer, accountByKmcid: user } = useLazyLoadQuery<UserDetailQuery>(
    userDetailQuery,
    { kmcid },
    { fetchPolicy: "store-and-network" }
  );

  if (!user) {
    return <div>user not found</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="text-center mb-4">{user.name}の作品置場</h2>
          {user.id === viewer?.id && <UpdateAccountModal account={user} />}
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
      <InfiniteScroll
        loadMore={handleLoadArtworks}
        hasMore={hasPrevious && !isLoadingPrevious}
        loader={
          <div key={0} className="d-flex justify-content-center">
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Uploading...</span>
            </div>
          </div>
        }
      >
        <div className="row row-cols-1 row-cols-lg-4">
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
      </InfiniteScroll>
    </div>
  );
};
