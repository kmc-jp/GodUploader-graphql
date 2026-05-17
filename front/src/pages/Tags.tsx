import React from "react";
import { Badge, Card } from "react-bootstrap";
import { graphql } from "react-relay";
import { PreloadedQuery, usePreloadedQuery } from "react-relay";
import { useLoaderData } from "react-router";

import { Link } from "../components/Link";
import { TagsQuery } from "./__generated__/TagsQuery.graphql";

export const tagsQuery = graphql`
  query TagsQuery {
    allTags(sort: [UPDATED_AT_DESC]) {
      edges {
        node {
          name
          artworksCount
        }
      }
    }
  }
`;

export const Tags: React.FC = () => {
  const queryRef = useLoaderData() as PreloadedQuery<TagsQuery>;
  const { allTags } = usePreloadedQuery<TagsQuery>(tagsQuery, queryRef);

  return (
    <div>
      <Card>
        <Card.Header>
          <h2 className="text-center">タグまとめ</h2>
        </Card.Header>
        <Card.Body>
          <div className="d-flex flex-wrap justify-content-between">
            {allTags?.edges.map((edge, i) => {
              if (!(edge && edge.node)) {
                return null;
              }
              const node = edge.node;
              return (
                <div key={i} className="py-1">
                  <Link
                    to={`/tagged_artworks/${node.name}`}
                    type="button"
                    className="btn btn-outline-secondary text-center w-100 d-flex justify-content-between flex-fill"
                  >
                    <div className="me-auto">#{node.name}</div>
                    <Badge bg="secondary" pill className="ms-1">
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
