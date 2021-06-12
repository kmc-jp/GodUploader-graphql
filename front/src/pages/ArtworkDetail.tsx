import React from "react";
import { PreloadedQuery, useFragment, usePreloadedQuery } from "react-relay";
import { Link } from "react-router-dom";
import { graphql } from "babel-plugin-relay/macro";
import { ArtworkDetailQuery } from "./__generated__/ArtworkDetailQuery.graphql";
import { ArtworkDetail_likes$key } from "./__generated__/ArtworkDetail_likes.graphql";
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
          ...ArtworkDetail_likes
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
    artworkDetailQuery: PreloadedQuery<ArtworkDetailQuery>;
  };
}

const LikeList: React.FC<{ likesKey: ArtworkDetail_likes$key }> = ({
  likesKey,
}) => {
  const { edges } = useFragment(
    graphql`
      fragment ArtworkDetail_likes on LikeConnection {
        edges {
          node {
            account {
              id
              kmcid
            }
          }
        }
      }
    `,
    likesKey
  );
  return (
    <>
      {edges?.map((edge, i) => {
        if (!edge) {
          return null;
        }
        const node = edge.node;

        return (
          <Link
            key={i}
            to={`/users/${node?.account?.kmcid}`}
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title={node?.account?.kmcid}
          >
            <i className="bi bi-heart-fill"></i>
          </Link>
        );
      })}
    </>
  );
};

export const ArtworkDetail: React.FC<ArtworkDetailProps> = ({ prepared }) => {
  const { node: artwork } = usePreloadedQuery<ArtworkDetailQuery>(
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
          <div className="mb-2">
            <LikeList likesKey={artwork.likes!} />
          </div>
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
