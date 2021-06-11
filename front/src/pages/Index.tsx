import { PreloadedQuery, usePreloadedQuery } from "react-relay";
import { graphql } from "babel-plugin-relay/macro";
import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"

import type { IndexQuery } from "./__generated__/IndexQuery.graphql";
import { ArtworkListItem } from "../components/ArtworkListItem";

export const indexQuery = graphql`
  query IndexQuery {
    activeAccounts(sort: [ARTWORKS_COUNT_DESC]) {
      edges {
        node {
          id
          kmcid
          name
          artworksCount
        }
      }
    }
    safeArtworks(first: 8, sort: [CREATED_AT_DESC]) {
      edges {
        node {
          ...ArtworkListItem_artwork
        }
      }
    }
  }
`;

interface IndexProps {
  prepared: {
    indexQuery: PreloadedQuery<IndexQuery, Record<string, unknown>>;
  };
}

export const Index: React.VFC<IndexProps> = ({ prepared }) => {
  const { safeArtworks, activeAccounts } = usePreloadedQuery<IndexQuery>(
    indexQuery,
    prepared.indexQuery
  );
  const artworkCount = safeArtworks?.edges?.length || 0;

  return (
    <div>
      <div>
          <h2>最新{artworkCount}件の絵</h2>
        <div>
          {safeArtworks?.edges.map((edge, i) => {
            if (!edge) {
              return null;
            }

            return (
              <div key={i}>
                <ArtworkListItem artwork={edge.node!} />
              </div>
            );
          })}
        </div>
      </div>
      <div>
        <h2>
          利用者達
        </h2>
        {activeAccounts?.edges.map((edge) => {
          if (!edge) {
            return null;
          }
          const node = edge.node!;
          return (
            <div key={`accounts-${node.id}`}>
              <Link to={`/user/${node.kmcid}`}>
                {node.name}({node.artworksCount})
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
