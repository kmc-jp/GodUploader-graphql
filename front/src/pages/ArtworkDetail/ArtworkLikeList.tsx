import Tooltip from "bootstrap/js/dist/tooltip";
import React, { useCallback, useEffect, useRef } from "react";
import { useFragment } from "react-relay";
import { Link } from "react-router-dom";
import { graphql } from "babel-plugin-relay/macro";
import { ArtworkLikeList_like$key } from "./__generated__/ArtworkLikeList_like.graphql";
import { ArtworkLikeList_likes$key } from "./__generated__/ArtworkLikeList_likes.graphql";

interface Props {
  artwork: ArtworkLikeList_likes$key;
  viewer: {
    readonly id: string;
  } | null;
}

export const LikeList: React.FC<Props> = ({ artwork, viewer }) => {
  const { likes } = useFragment(
    graphql`
      fragment ArtworkLikeList_likes on Artwork {
        likes(first: 10000000) @connection(key: "ArtworkDetail_likes") {
          __id
          edges {
            node {
              ...ArtworkLikeList_like
            }
          }
        }
      }
    `,
    artwork
  );

  const handleClickLikeButton = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    window.alert("liked");
  }, []);

  if (!(likes && likes.edges)) {
    return null;
  }

  return (
    <div className="mb-2">
      {likes.edges.map((edge, i) => {
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

const LikeIcon: React.FC<{ node: ArtworkLikeList_like$key }> = ({ node }) => {
  const like = useFragment(
    graphql`
      fragment ArtworkLikeList_like on Like {
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
