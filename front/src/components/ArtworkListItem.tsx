import React, { Suspense } from "react";
import { graphql } from "react-relay";
import { useFragment } from "react-relay/hooks";
import { Link } from "react-router-dom";

import CensoredThumbnailImage from "../assets/img/regulation_mark_r18.png";
import { SuspenseImage } from "./SuspenseImage";
import { ArtworkListItem_artwork$key } from "./__generated__/ArtworkListItem_artwork.graphql";

interface ArtworkListItemProps {
  artwork: ArtworkListItem_artwork$key;
}

const Spinner: React.VFC = () => (
  <div style={{ height: 186 }}>
    <div className="d-flex justify-content-center h-100">
      <div
        className="spinner-border"
        role="status"
        style={{ width: 80, height: 80 }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
);

export const ArtworkListItem: React.VFC<ArtworkListItemProps> = (props) => {
  const artwork = useFragment(
    graphql`
      fragment ArtworkListItem_artwork on Artwork {
        id
        title
        caption
        nsfw
        topIllust {
          thumbnailUrl
        }
        account {
          name
        }
      }
    `,
    props.artwork
  );

  const account = artwork.account;
  if (!artwork.topIllust) {
    return null;
  }

  return (
    <div className="card p-1" style={{ height: 320 }}>
      <Suspense fallback={<Spinner />}>
        <SuspenseImage
          src={
            artwork.nsfw
              ? CensoredThumbnailImage
              : artwork.topIllust.thumbnailUrl
          }
          alt={artwork.title}
          style={{
            maxWidth: "100%",
            height: 186,
            objectFit: "contain",
            display: "block",
          }}
          className="card-img-top mx-auto my-0"
        />
      </Suspense>
      <div className="card-body">
        <h3 className="text-truncate">
          <Link
            to={`/artwork/${artwork.id}`}
            className="card-link text-body stretched-link"
          >
            {artwork.title}
          </Link>
        </h3>
        {account && <p className="card-text text-truncate">{account.name}</p>}
        <p className="card-text text-truncate">{artwork.caption}</p>
      </div>
    </div>
  );
};
