import { GetServerSideProps } from "next";
import React, { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { fetchQuery, usePaginationFragment } from "react-relay";
import { graphql } from "react-relay";

import { ArtworkListItem } from "../components/ArtworkListItem";
import { initEnvironment } from "../lib/RelayEnvironment";
import {
  artworksQuery,
  artworksQuery$data,
} from "./__generated__/artworksQuery.graphql";
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

interface RecentArtworksProps {
  artworks: artworksQuery$data;
}

const RecentArtworks: React.VFC<RecentArtworksProps> = ({ artworks }) => {
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

export const getServerSideProps: GetServerSideProps<RecentArtworksProps> =
  async () => {
    const environment = initEnvironment();
    const data = await fetchQuery<artworksQuery>(
      environment,
      graphql`
        query artworksQuery {
          ...artworks_artworks
        }
      `,
      {}
    ).toPromise();

    if (!data) {
      return { notFound: true };
    }

    const initialRecords = environment.getStore().getSource().toJSON();
    return { props: { artworks: data, initialRecords } };
  };

export default RecentArtworks;
