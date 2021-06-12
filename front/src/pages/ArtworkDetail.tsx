import React from "react";
import { PreloadedQuery, usePreloadedQuery } from "react-relay";
import { Link } from "react-router-dom";
import { graphql } from "babel-plugin-relay/macro";
import { ArtworkDetailQuery } from "./__generated__/ArtworkDetailQuery.graphql";
import { formatDateTime } from "../util";
import { LikeList } from "./ArtworkDetail/ArtworkLikeList";

export const artworkDetailQuery = graphql`
  query ArtworkDetailQuery($id: ID!) {
    viewer {
      id
    }
    node(id: $id) {
      ... on Artwork {
        id
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
        ...ArtworkLikeList_likes
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
    artworkDetailQuery: PreloadedQuery<ArtworkDetailQuery>;
  };
}

export const ArtworkDetail: React.FC<ArtworkDetailProps> = ({ prepared }) => {
  const { viewer, node: artwork } = usePreloadedQuery<ArtworkDetailQuery>(
    artworkDetailQuery,
    prepared.artworkDetailQuery
  );
  if (!artwork) {
    return <div>作品が見つかりません</div>;
  }
  const createdAt = new Date(artwork.createdAt!);

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
          <div className="row">
            <ul className="breadcrumb px-2 py-2 bg-light">
              <li className="breadcrumb-item">タグ</li>
              {artwork.tags?.edges.map((edge) => {
                const tag = edge?.node?.tag!;
                return (
                  <li key={tag.id} className="text-center breadcrumb-item">
                    <Link to={`/tagged_artworks/${tag.name}`}>{tag.name}</Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <LikeList artwork={artwork} viewer={viewer} />
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
