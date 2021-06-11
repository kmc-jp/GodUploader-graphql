import React from "react";
import { PreloadedQuery, usePreloadedQuery } from "react-relay";
import { Link } from "react-router-dom";
import { graphql } from "babel-plugin-relay/macro";
import { ArtworkDetailQuery } from "./__generated__/ArtworkDetailQuery.graphql";
import { formatDateTime } from "../util";

export const artworkDetailQuery = graphql`
  query ArtworkDetailQuery($id: ID!) {
    node(id: $id) {
      ... on Artwork {
        title
        caption
        createdAt
        account {
          kmcid
          name
        }
        illusts {
          edges {
            node {
              id
              filename
            }
          }
        }
        likes {
          edges {
            node {
              account {
                id
                kmcid
              }
            }
          }
        }
        tags {
          edges {
            node {
              tag {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`;

interface ArtworkDetailProps {
  prepared: {
    artworkDetailQuery: PreloadedQuery<ArtworkDetailQuery, Record<string, any>>;
  };
}

export const ArtworkDetail: React.FC<ArtworkDetailProps> = ({ prepared }) => {
  const { node: artwork } = usePreloadedQuery<ArtworkDetailQuery>(
    artworkDetailQuery,
    prepared.artworkDetailQuery
  );
  if (!artwork) {
    return <div>作品が見つかりません</div>;
  }
  const createdAt = new Date(artwork.createdAt!)

  return (
    <div>
      <div className="card">
        <div className="card-header text-center">
          <h2>{artwork.title}</h2>
          <p>{artwork.caption}</p>
          <p>
            <Link to={`/user/${artwork.account?.kmcid}`}>
              {artwork.account?.name}
            </Link>
          </p>
          <p>{formatDateTime(createdAt)}</p>
        </div>
        <div className="card-body">
          <ul>
            {artwork.tags?.edges.map((edge) => {
              const tag = edge?.node?.tag!;
              return (
                <li key={tag.id} className="text-center">
                  <Link to={`/tagged_artworks/${tag.name}`}>{tag.name}</Link>
                </li>
              );
            })}
          </ul>
          {artwork.illusts?.edges.map((edge) => {
            if (!edge) {
              return null;
            }
            const node = edge.node;
            return (
              <img
                src={`http://localhost:5000/public/illusts/${node?.filename}`}
                key={node?.id}
                alt=""
                className="mw-100"
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
