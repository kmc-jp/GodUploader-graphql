import React, { ChangeEventHandler, useCallback } from "react";
import { Card, Form, Spinner } from "react-bootstrap";
import { graphql } from "react-relay";
import {
  PreloadedQuery,
  usePreloadedQuery,
  usePaginationFragment,
} from "react-relay";
import { useLoaderData, useNavigate } from "react-router";

import { ArtworkListItem } from "../components/ArtworkListItem";
import { InfiniteScroll } from "../components/InfiniteScroll";
import { RecentArtworkListPaginationQuery } from "./__generated__/RecentArtworkListPaginationQuery.graphql";
import type {
  ArtworkRatingEnum,
  RecentArtworksQuery,
} from "./__generated__/RecentArtworksQuery.graphql";
import { RecentArtworks_artworks$key } from "./__generated__/RecentArtworks_artworks.graphql";

export const recentArtworksQuery = graphql`
  query RecentArtworksQuery($rating: [ArtworkRatingEnum!]!) {
    ...RecentArtworks_artworks
  }
`;

export function modeToRating(mode: string | null): ArtworkRatingEnum[] {
  switch (mode) {
    case "all":
      return ["safe", "r_18", "r_18g"];
    case "r_18":
      return ["r_18"];
    case "r_18g":
      return ["r_18g"];
    default:
      return ["safe"];
  }
}

function ratingToMode(rating: ArtworkRatingEnum[]): string {
  if (rating.length === 3) return "all";
  if (rating.length === 1) return rating[0];
  return "safe";
}

const ArtworkList: React.FC<{
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
    queryRef,
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
          <Spinner animation="border" variant="light" role="status">
            <span className="visually-hidden">Uploading...</span>
          </Spinner>
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

export const RecentArtworks: React.FC = () => {
  const queryRef = useLoaderData() as PreloadedQuery<RecentArtworksQuery>;
  const data = usePreloadedQuery<RecentArtworksQuery>(
    recentArtworksQuery,
    queryRef,
  );

  const navigate = useNavigate();
  const handleChangeRating = useCallback<ChangeEventHandler<HTMLSelectElement>>(
    (e) => {
      navigate(`/artworks?mode=${e.target.value}`);
    },
    [navigate],
  );

  const selectedRating = ratingToMode(
    queryRef.variables.rating as ArtworkRatingEnum[],
  );

  return (
    <div>
      <Card>
        <Card.Header>
          <h2 className="text-center flex-fill">最新の絵</h2>
          <div className="d-flex justify-content-end">
            <div>
              <Form.Select
                id="rating-select"
                value={selectedRating}
                onChange={handleChangeRating}
              >
                <option value="safe">全年齢</option>
                <option value="r_18">R-18</option>
                <option value="r_18g">R-18G</option>
                <option value="all">全て (NSFW含む)</option>
              </Form.Select>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <ArtworkList artworks={data} />
        </Card.Body>
      </Card>
    </div>
  );
};
