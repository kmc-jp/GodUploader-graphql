import React, { useCallback } from "react";
import { Card, Spinner } from "react-bootstrap";
import { graphql } from "react-relay";
import { PreloadedQuery, usePreloadedQuery, usePaginationFragment } from "react-relay";
import { useLoaderData } from "react-router";

import { ArtworkListItem } from "../components/ArtworkListItem";
import { InfiniteScroll } from "../components/InfiniteScroll";
import { UpdateAccountModal } from "../components/UserDetail/UpdateInfoForm";
import { ArtworkListPaginationQuery } from "./__generated__/ArtworkListPaginationQuery.graphql";
import { UserDetailQuery } from "./__generated__/UserDetailQuery.graphql";
import { UserDetail_artworks$key } from "./__generated__/UserDetail_artworks.graphql";

export const userDetailQuery = graphql`
  query UserDetailQuery($kmcid: String!) {
    user: accountByKmcid(kmcid: $kmcid) {
      id
      kmcid
      name
      isYou
      ...UpdateInfoForm_account
      ...UserDetail_artworks
    }
  }
`;

export const UserDetail: React.FC = () => {
  const queryRef = useLoaderData() as PreloadedQuery<UserDetailQuery>;
  const { user } = usePreloadedQuery<UserDetailQuery>(userDetailQuery, queryRef);

  if (!user) {
    return <div>user not found</div>;
  }

  return (
    <div>
      <Card>
        <Card.Header>
          <h2 className="text-center mb-4">{user.name}の作品置場</h2>
          {user.isYou && <UpdateAccountModal account={user} />}
        </Card.Header>
        <ArtworkList user={user} />
      </Card>
    </div>
  );
};

const ArtworkList: React.FC<{ user: UserDetail_artworks$key }> = ({ user }) => {
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
    user,
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
    <Card.Body>
      <InfiniteScroll
        loadMore={handleLoadArtworks}
        hasMore={hasPrevious && !isLoadingPrevious}
        loader={
          <div key={0} className="d-flex justify-content-center">
            <Spinner animation="border" variant="light" role="status">
              <span className="visually-hidden">Uploading...</span>
            </Spinner>
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
    </Card.Body>
  );
};
