import { PreloadedQuery, usePreloadedQuery } from "react-relay";
import { graphql } from "babel-plugin-relay/macro";
import React from "react";
import { Link } from "react-router-dom";

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
    safeArtworks(first: 8, sort: [CREATED_AT_DESC])
      @connection(key: "Index_safeArtworks") {
      __id
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
    indexQuery: PreloadedQuery<IndexQuery>;
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
      {safeArtworks && safeArtworks.edges ? (
        <div className="card mb-5">
          <div className="card-header">
            <h2 className="text-center">最新{artworkCount}件の絵</h2>
          </div>
          <div className="card-body">
            <div className="row row-cols-4">
              {safeArtworks.edges.map((edge, i) => {
                if (!edge) {
                  return null;
                }

                if (!edge.node) {
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
      ) : (
        <div className="card mb-5"></div> // fallback
      )}
      <div className="card">
        <div className="card-header">
          <h2 className="text-center">利用者達</h2>
        </div>
        <div className="card-body">
          <div className="row row-cols-4">
            {activeAccounts?.edges.map((edge, i) => {
              if (!edge) {
                return null;
              }
              const node = edge.node!;
              return (
                <div key={i} className="col py-1">
                  <Link
                    to={`/user/${node.kmcid}`}
                    type="button"
                    className="btn btn-outline-secondary"
                    style={{
                      textAlign: "center",
                      width: "100%",
                    }}
                  >
                    {node.name}({node.artworksCount})
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
