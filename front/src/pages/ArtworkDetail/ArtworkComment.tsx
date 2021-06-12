import React from "react";
import { useFragment } from "react-relay";
import { graphql } from "babel-plugin-relay/macro";
import { ArtworkComment_comments$key } from "./__generated__/ArtworkComment_comments.graphql";
import { ArtworkDetailQueryResponse } from "../__generated__/ArtworkDetailQuery.graphql";

interface Props {
  artwork: NonNullable<ArtworkDetailQueryResponse["node"]>;
}

export const ArtworkComment: React.VFC<Props> = ({ artwork }) => {
  const { comments } = useFragment<ArtworkComment_comments$key>(
    graphql`
      fragment ArtworkComment_comments on Artwork {
        comments(last: 1000000) {
          edges {
            node {
              text
              createdAt
              account {
                kmcid
              }
            }
          }
        }
      }
    `,
    artwork
  );
  if (!comments?.edges) {
    return null;
  }

  const edges = Array.from(comments.edges);
  edges.reverse();

  return (
    <ul className="list-group">
      {edges.map((edge, i) => {
        if (!edge) {
          return null;
        }

        const { node } = edge;
        if (!node) {
          return null;
        }

        return (
          <li key={i} className="list-group-item d-flex align-items-start">
            <div className="ms2 me-auto">
              <div className="fw-bold">{node.account?.kmcid}</div>
              {node.text}
            </div>
            {node.createdAt}
          </li>
        );
      })}
    </ul>
  );
};
