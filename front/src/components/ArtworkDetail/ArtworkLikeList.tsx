import React, { useCallback } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { graphql } from "react-relay";
import { useFragment, useRelayEnvironment } from "react-relay";

import { commitLikeArtworkMutation } from "../../mutation/LikeArtwork";
import { Link } from "../Link";
import type { ArtworkLikeList_likes$key } from "./__generated__/ArtworkLikeList_likes.graphql";

interface Props {
  artwork: ArtworkLikeList_likes$key;
}

export const LikeList: React.FC<Props> = ({ artwork }) => {
  const { artworkId, likes } = useFragment<ArtworkLikeList_likes$key>(
    graphql`
      fragment ArtworkLikeList_likes on Artwork {
        artworkId: id
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
    artwork,
  );
  const environment = useRelayEnvironment();

  const handleClickLikeButton = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      if (!(likes && likes.__id)) {
        return;
      }
      commitLikeArtworkMutation(environment, {
        variables: {
          input: { artworkId },
          connections: [likes.__id],
        },
      });
    },
    [artworkId, environment, likes],
  );

  if (!(likes && likes.edges)) {
    return null;
  }

  return (
    <div>
      <OverlayTrigger
        placement="top"
        overlay={
          <Tooltip>
            <i className="bi bi-heart-fill"></i> をつける
          </Tooltip>
        }
      >
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={handleClickLikeButton}
        >
          +<i className="bi bi-heart-fill"></i>
        </button>
      </OverlayTrigger>{" "}
      {likes.edges.map((edge, i) => {
        if (!edge) {
          return null;
        }
        const node = edge.node;
        if (!node) {
          return null;
        }

        return <LikeIcon key={i} like={node} />;
      })}
    </div>
  );
};

interface LikeIconProps {
  like: {
    readonly account:
      | {
          readonly id: string;
          readonly kmcid: string;
        }
      | null
      | undefined;
  };
}

const LikeIcon: React.FC<LikeIconProps> = ({ like }) => {
  if (!like.account) {
    return null;
  }

  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip>{like.account.kmcid}</Tooltip>}
    >
      <Link to={`/users/${like.account.kmcid}`}>
        <i className="bi bi-heart-fill"></i>
      </Link>
    </OverlayTrigger>
  );
};
