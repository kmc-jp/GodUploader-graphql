import { graphql } from "babel-plugin-relay/macro";
import React, { ChangeEventHandler, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useLazyLoadQuery, usePaginationFragment } from "react-relay";
import { useHistory, useLocation } from "react-router-dom";

import { ArtworkListItem } from "../components/ArtworkListItem";
import { RecentArtworkListPaginationQuery } from "./__generated__/RecentArtworkListPaginationQuery.graphql";
import type {
  ArtworkRatingEnum,
  RecentArtworksQuery,
} from "./__generated__/RecentArtworksQuery.graphql";
import { RecentArtworks_artworks$key } from "./__generated__/RecentArtworks_artworks.graphql";

const useRatingParam = (): [string, ArtworkRatingEnum[]] => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  switch (queryParams.get("mode")) {
    case "all":
      return ["all", ["safe", "r_18", "r_18g"]];
    case "r_18":
      return ["r_18", ["r_18"]];
    case "r_18g":
      return ["r_18g", ["r_18g"]];
    default:
      return ["safe", ["safe"]];
  }
};

const ArtworkList: React.VFC<{
  artworks: RecentArtworks_artworks$key;
}> = ({ artworks: queryRef }) => {
  const {
    data: { artworks },
    loadNext,
    hasNext,
    isLoadingNext,
  } = usePaginationFragment<
    RecentArtworkListPaginationQuery,
    RecentArtworks_artworks$key
  >(
    graphql`
      fragment RecentArtworks_artworks on Query
      @argumentDefinitions(
        cursor: { type: "String" }
        count: { type: "Int", defaultValue: 40 }
      )
      @refetchable(queryName: "RecentArtworkListPaginationQuery") {
        artworks(
          first: $count
          after: $cursor
          sort: [CREATED_AT_DESC]
          rating: $rating
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

export const RecentArtworks: React.VFC = () => {
  const [selectedRating, rating] = useRatingParam();
  console.log(rating);
  const artworks = useLazyLoadQuery<RecentArtworksQuery>(
    graphql`
      query RecentArtworksQuery($rating: [ArtworkRatingEnum!]!) {
        ...RecentArtworks_artworks
      }
    `,
    { rating },
    { fetchPolicy: "store-and-network" }
  );
  const history = useHistory();
  const handleChangeRating = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    (e) => {
      history.push(`artworks?mode=${e.target.value}`);
    },
    [history]
  );

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="text-center flex-fill">最新の絵</h2>
          <div className="d-flex justify-content-end">
            <div>
              <select
                id="rating-select"
                className="form-select"
                value={selectedRating}
                onChange={handleChangeRating}
              >
                <option value="safe">全年齢</option>
                <option value="r_18">R-18</option>
                <option value="r_18g">R-18G</option>
                <option value="all">全て (NSFW含む)</option>
              </select>
            </div>
          </div>
        </div>
        <div className="card-body">
          <ArtworkList artworks={artworks} />
        </div>
      </div>
    </div>
  );
};
