import Tooltip from "bootstrap/js/dist/tooltip";
import React, { useCallback, useEffect, useRef } from "react";
import { PreloadedQuery, useFragment, usePreloadedQuery } from "react-relay";
import { Link } from "react-router-dom";
import { graphql } from "babel-plugin-relay/macro";
import { ArtworkDetailQuery } from "./__generated__/ArtworkDetailQuery.graphql";
import { ArtworkDetail_like$key } from "./__generated__/ArtworkDetail_like.graphql";
import { formatDateTime } from "../util";
import { FragmentRefs } from "relay-runtime";

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
        likes(first: 10000000) @connection(key: "ArtworkDetail_likes") {
          __id
          edges {
            node {
              ...ArtworkDetail_like
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
    artworkDetailQuery: PreloadedQuery<ArtworkDetailQuery>;
  };
}

const LikeIcon: React.FC<{ node: ArtworkDetail_like$key }> = ({ node }) => {
  const like = useFragment(
    graphql`
      fragment ArtworkDetail_like on Like {
        account {
          id
          kmcid
        }
      }
    `,
    node
  );
  const ref = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const tooltip = new Tooltip(ref.current);
    return () => {
      // いいねアイコンをクリックしてユーザーページに遷移したときにツールチップが消えるようにする
      tooltip.hide();
    };
  });

  if (!like.account) {
    return null;
  }

  return (
    <Link
      to={`/user/${like.account.kmcid}`}
      data-bs-toggle="tooltip"
      data-bs-placement="top"
      title={like.account.kmcid}
      ref={ref}
    >
      <i className="bi bi-heart-fill"></i>
    </Link>
  );
};

const LikeList: React.FC<{
  likes: {
    readonly __id: string;
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly " $fragmentRefs": FragmentRefs<"ArtworkDetail_like">;
      } | null;
    } | null>;
  };
}> = ({ likes }) => {
  const handleClickLikeButton = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    window.alert("liked");
  }, []);

  return (
    <div className="mb-2">
      {likes.edges?.map((edge, i) => {
        if (!edge) {
          return null;
        }
        const node = edge.node;
        if (!node) {
          return null;
        }

        return <LikeIcon key={i} node={node} />;
      })}{" "}
      <button
        className="btn btn-outline-secondary"
        onClick={handleClickLikeButton}
      >
        +<i className="bi bi-heart-fill"></i>
      </button>
    </div>
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
          {artwork.likes && <LikeList likes={artwork.likes} />}
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
