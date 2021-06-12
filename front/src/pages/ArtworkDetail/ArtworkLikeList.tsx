import React, { useCallback } from "react";
import { useFragment, useRelayEnvironment } from "react-relay";
import { Link } from "react-router-dom";
import { graphql } from "babel-plugin-relay/macro";
import {
  ArtworkLikeList_likes,
  ArtworkLikeList_likes$key,
} from "./__generated__/ArtworkLikeList_likes.graphql";
import { useTooltip } from "../../hooks/useTooltip";
import clsx from "clsx";
import { commitLikeArtworkMutation } from "../../mutation/LikeArtwork";
import { ArtworkDetailQueryResponse } from "../__generated__/ArtworkDetailQuery.graphql";

type Viewer = {
  readonly id: string;
} | null;

interface Props {
  artwork: NonNullable<ArtworkDetailQueryResponse['node']>;
  viewer: Viewer;
}

const viewerLikedArtwork = (
  viewer: Viewer,
  likes: NonNullable<ArtworkLikeList_likes>["likes"]
) =>
  viewer &&
  likes?.edges?.length &&
  likes?.edges?.some((edge) => edge?.node?.account?.id === viewer.id);

export const LikeList: React.FC<Props> = ({ artwork, viewer }) => {
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

  const handleClickLikeButton = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (!(likes && likes.__id && artwork && artwork.id)) {
      return;
    }
    commitLikeArtworkMutation(environment, { artworkId: artwork.id }, [ likes.__id ])
  }, [artwork, environment, likes]);

  if (!(likes && likes.edges)) {
    return null;
  }

  const viewerLiked = viewerLikedArtwork(viewer, likes)

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

        return <LikeIcon key={i} like={node} />;
      })}{" "}
      <button
        className={clsx("btn", viewerLiked ? "btn-secondary" : "btn-outline-secondary")}
        onClick={handleClickLikeButton}
      >
        +<i className="bi bi-heart-fill"></i>
      </button>
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
  const ref = useTooltip<HTMLAnchorElement>()

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
