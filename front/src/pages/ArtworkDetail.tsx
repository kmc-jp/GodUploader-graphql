import React from "react";
import { PreloadedQuery, usePreloadedQuery } from "react-relay";
import { Link } from "react-router-dom";
import { graphql } from "babel-plugin-relay/macro";
import { ArtworkDetailQuery } from "./__generated__/ArtworkDetailQuery.graphql";

export const artworkDetailQuery = graphql`
  query ArtworkDetailQuery($id: ID!) {
    node(id: $id) {
      ... on Artwork {
        title
        caption
        createdAt
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

  return (
    <div>
      <h2>{artwork.title}</h2>
      <p>{artwork.caption}</p>
      <ul>
        {artwork.tags?.edges.map(edge => {
          const tag = edge?.node?.tag!;
          return <li key={tag.id}><Link to={`/tagged_artworks/${tag.name}`}>{tag.name}</Link></li>
        })}
      </ul>
      <p>{artwork.createdAt as any}</p>
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
          />
        );
      })}
    </div>
  );
};
