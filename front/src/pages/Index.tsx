import React from "react";
import { Badge, Card } from "react-bootstrap";
import { graphql } from "react-relay";
import { PreloadedQuery, usePreloadedQuery } from "react-relay";
import { useLoaderData } from "react-router";

import { ArtworkListItem } from "../components/ArtworkListItem";
import { Link } from "../components/Link";
import type { IndexQuery } from "./__generated__/IndexQuery.graphql";

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
    safeArtworks: artworks(first: 8, sort: [CREATED_AT_DESC], rating: [safe])
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

export const Index: React.FC = () => {
  const queryRef = useLoaderData() as PreloadedQuery<IndexQuery>;
  const { safeArtworks, activeAccounts } = usePreloadedQuery<IndexQuery>(
    indexQuery,
    queryRef,
  );
  const artworkCount = safeArtworks?.edges?.length || 0;

  return (
    <div>
      {safeArtworks && safeArtworks.edges ? (
        <Card className="mb-5">
          <Card.Header>
            <h2 className="text-center">最新{artworkCount}件の絵</h2>
          </Card.Header>
          <Card.Body>
            <div className="row row-cols-1 row-cols-lg-4">
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
            <Link
              to="/artworks"
              type="button"
              className="btn btn-lg btn-outline-secondary w-100 text-center"
            >
              もっと見る
            </Link>
          </Card.Body>
        </Card>
      ) : (
        <Card className="mb-5" /> // fallback
      )}
      <Card>
        <Card.Header>
          <h2 className="text-center">利用者達</h2>
        </Card.Header>
        <Card.Body>
          <div className="row row-cols-2 row-cols-lg-4">
            {activeAccounts?.edges.map((edge, i) => {
              if (!(edge && edge.node)) {
                return null;
              }
              const node = edge.node;
              return (
                <div key={i} className="col py-1">
                  <Link
                    to={`/users/${node.kmcid}`}
                    type="button"
                    className="btn btn-outline-secondary text-center w-100 d-flex justify-content-between"
                  >
                    {node.name}
                    <Badge bg="secondary" pill>
                      {node.artworksCount}
                    </Badge>
                  </Link>
                </div>
              );
            })}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
