import React, { useCallback } from "react";
import { useFragment, useRelayEnvironment } from "react-relay";
import { Link } from "react-router-dom";
import { graphql } from "babel-plugin-relay/macro";
import type { ArtworkLikeList_likes$key } from "./__generated__/ArtworkLikeList_likes.graphql";
import { useTooltip } from "../../hooks/useTooltip";
import { commitLikeArtworkMutation } from "../../mutation/LikeArtwork";
import { ArtworkDetailQueryResponse } from "../__generated__/ArtworkDetailQuery.graphql";

interface Props {
  artwork: NonNullable<ArtworkDetailQueryResponse["node"]>;
}

export const LikeList: React.FC<Props> = ({ artwork }) => {
  const { likes } = useFragment<ArtworkLikeList_likes$key>(
    graphql`
      fragment ArtworkLikeList_likes on Artwork {
        likes(first: 10000000) @connection(key: "ArtworkDetail_likes") {
          __id
          edges {
            node {
              account {
                id
                kmcid
              }
            }
          }
        }
      }
    `,
    artwork
  );
  const environment = useRelayEnvironment();

  const handleClickLikeButton = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (!(likes && likes.__id && artwork && artwork.id)) {
        return;
      }
      commitLikeArtworkMutation(environment, {
        variables: {
          input: { artworkId: artwork.id },
          connections: [likes.__id],
        },
      });
    },
    [artwork, environment, likes]
  );

  const buttonRef = useTooltip<HTMLButtonElement>();

  if (!(likes && likes.edges)) {
    return null;
  }

  return (
    <div className="mb-2">
      <button
        className="btn btn-sm btn-outline-secondary"
        ref={buttonRef}
        data-bs-toggle="tooltip"
        data-bs-placement="top"
        data-bs-html="true"
        title={`<i class="bi bi-heart-fill"></i> をつける`}
        onClick={handleClickLikeButton}
      >
        +<i className="bi bi-heart-fill"></i>
      </button>{" "}
      {likes.edges.map((edge, i) => {
        if (!edge) {
          return null;
        }
        const node = edge.node;
        if (!node) {
          return null;
        }

        return <LikeIcon key={i} like={node} />;
      })}{" "}
    </div>
  );
};

const LikeIcon: React.FC<{
  like: {
    readonly account: {
      readonly id: string;
      readonly kmcid: string;
    } | null;
  };
}> = ({ like }) => {
  const ref = useTooltip<HTMLAnchorElement>();

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
