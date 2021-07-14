import { graphql } from "babel-plugin-relay/macro";
import React from "react";
import { PreloadedQuery, usePreloadedQuery } from "react-relay";

import { ArtworkListItem } from "../components/ArtworkListItem";
import type { RecentArtworksQuery } from "./__generated__/RecentArtworksQuery.graphql";

interface RecentArtworksProps {
  prepared: {
    recentArtworksQuery: PreloadedQuery<RecentArtworksQuery>;
  };
}

export const RecentArtworks: React.VFC<RecentArtworksProps> = ({
  prepared,
}) => {
  const { artworks } = usePreloadedQuery<RecentArtworksQuery>(
    graphql`
      query RecentArtworksQuery($safeOnly: Boolean! = true) {
        artworks(first: 8, sort: [CREATED_AT_DESC], safeOnly: $safeOnly) {
          edges {
            node {
              ...ArtworkListItem_artwork
            }
          }
        }
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
        </div>
      </div>
    </div>
  );
};
