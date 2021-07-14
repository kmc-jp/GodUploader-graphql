import { graphql } from "babel-plugin-relay/macro";
import React, { useCallback } from "react";
import InfiniteScroll from "react-infinite-scroller";
import {
  PreloadedQuery,
  usePaginationFragment,
  usePreloadedQuery,
} from "react-relay";

import { ArtworkListItem } from "../components/ArtworkListItem";
import type { RecentArtworksQuery } from "./__generated__/RecentArtworksQuery.graphql";
import { RecentArtworks_artworks$key } from "./__generated__/RecentArtworks_artworks.graphql";

interface RecentArtworksProps {
  prepared: {
    recentArtworksQuery: PreloadedQuery<RecentArtworksQuery>;
  };
}

const ArtworkList: React.VFC<{ queryRef: RecentArtworks_artworks$key }> = ({
  queryRef,
}) => {
  const {
    data: { artworks },
    loadNext,
    hasNext,
    isLoadingNext,
  } = usePaginationFragment(
    graphql`
      fragment RecentArtworks_artworks on Query
      @argumentDefinitions(
        cursor: { type: "String" }
        count: { type: "Int", defaultValue: 40 }
        safeOnly: { type: "Boolean", defaultValue: true }
      )
      @refetchable(queryName: "RecentArtworkListPaginationQuery") {
        artworks(
          first: $count
          after: $cursor
          sort: [CREATED_AT_DESC]
          safeOnly: $safeOnly
        ) @connection(key: "RecentArtworks_artworks") {
          edges {
            node {
              ...ArtworkListItem_artwork
            }
          }
        }
      }
    `,
    queryRef
  );

  const handleLoadArtworks = useCallback(() => {
    if (!hasNext || isLoadingNext) {
      return;
    }

    loadNext(20);
  }, [hasNext, isLoadingNext, loadNext]);

  return (
    <InfiniteScroll
      loadMore={handleLoadArtworks}
      hasMore={hasNext && !isLoadingNext}
      loader={
        <div key={0} className="d-flex justify-content-center">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Uploading...</span>
          </div>
        </div>
      }
    >
      <div className="row row-cols-1 row-cols-lg-4">
        {artworks?.edges.map((edge, i) => {
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
  );
};

export const RecentArtworks: React.VFC<RecentArtworksProps> = ({
  prepared,
}) => {
  const fragmentKey = usePreloadedQuery<RecentArtworksQuery>(
    graphql`
      query RecentArtworksQuery {
        ...RecentArtworks_artworks
      }
    `,
    prepared.recentArtworksQuery
  );

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="text-center">最新の絵</h2>
        </div>
        <div className="card-body">
          <ArtworkList queryRef={fragmentKey} />
        </div>
      </div>
    </div>
  );
};