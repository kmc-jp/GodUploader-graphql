import { graphql } from "babel-plugin-relay/macro";
import { useRouter } from "next/router";
import React, { useCallback } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useLazyLoadQuery, usePaginationFragment } from "react-relay";

import { ArtworkListItem } from "../../components/ArtworkListItem";
import { UpdateAccountModal } from "../../components/UserDetail/UpdateInfoForm";
import { ArtworkListPaginationQuery } from "./__generated__/ArtworkListPaginationQuery.graphql";
import { KmcidQuery } from "./__generated__/KmcidQuery.graphql";
import { Kmcid_artworks$key } from "./__generated__/Kmcid_artworks.graphql";

export const UserDetail: React.FC = () => {
  const router = useRouter();
  const { kmcid } = router.query;
  const { user } = useLazyLoadQuery<KmcidQuery>(
    graphql`
      query KmcidQuery($kmcid: String!) {
        user: accountByKmcid(kmcid: $kmcid) {
          id
          kmcid
          name
          isYou
          ...UpdateInfoForm_account
          ...Kmcid_artworks
        }
      }
    `,
    { kmcid: typeof kmcid === "string" ? kmcid : kmcid[0] },
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
          {user.isYou && <UpdateAccountModal account={user} />}
        </div>
        <ArtworkList user={user} />
      </div>
    </div>
  );
};

const ArtworkList: React.VFC<{ user: Kmcid_artworks$key }> = ({ user }) => {
  const {
    data: { artworks },
    loadPrevious,
    hasPrevious,
    isLoadingPrevious,
  } = usePaginationFragment<ArtworkListPaginationQuery, Kmcid_artworks$key>(
    graphql`
      fragment Kmcid_artworks on Account
      @argumentDefinitions(
        cursor: { type: "String" }
        count: { type: "Int", defaultValue: 40 }
      )
      @refetchable(queryName: "ArtworkListPaginationQuery") {
        artworks(last: $count, before: $cursor)
          @connection(key: "Kmcid_artworks") {
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
