import { graphql } from "babel-plugin-relay/macro";
import React, { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useLazyLoadQuery, usePaginationFragment } from "react-relay";

import { ArtworkListItem } from "../components/ArtworkListItem";
import { artworksQuery } from "./__generated__/artworksQuery.graphql";
import { artworks_artworks$key } from "./__generated__/artworks_artworks.graphql";

const ArtworkList: React.VFC<{
  artworks: artworks_artworks$key;
  includeNsfw: boolean;
}> = ({ artworks: queryRef, includeNsfw }) => {
  const {
    data: { artworks },
    refetch,
    loadNext,
    hasNext,
    isLoadingNext,
  } = usePaginationFragment(
    graphql`
      fragment artworks_artworks on Query
      @argumentDefinitions(
        cursor: { type: "String" }
        count: { type: "Int", defaultValue: 40 }
        safeOnly: { type: "Boolean", defaultValue: true }
      )
      @refetchable(queryName: "artworksPaginationQuery") {
        artworks(
          first: $count
          after: $cursor
          sort: [CREATED_AT_DESC]
          safeOnly: $safeOnly
        ) @connection(key: "artworks_artworks") {
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

  useEffect(() => {
    refetch({ safeOnly: !includeNsfw });
  }, [includeNsfw, refetch]);

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

export const RecentArtworks: React.VFC = () => {
  const artworks = useLazyLoadQuery<artworksQuery>(
    graphql`
      query artworksQuery {
        ...artworks_artworks
      }
    `,
    {},
    { fetchPolicy: "store-and-network" }
  );

  const [includeNsfw, setIncludeNsfw] = useState(false);

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="text-center">最新の絵</h2>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="flexSwitchCheckDefault"
              checked={includeNsfw}
              onChange={(e) => setIncludeNsfw(e.target.checked)}
            />
            <label
              className="form-check-label"
              htmlFor="flexSwitchCheckDefault"
            >
              NSFWなイラストを含める
            </label>
          </div>
        </div>
        <div className="card-body">
          <ArtworkList artworks={artworks} includeNsfw={includeNsfw} />
        </div>
      </div>
    </div>
  );
};
