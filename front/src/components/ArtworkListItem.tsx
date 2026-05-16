import React, { Suspense } from "react";
import { Card, Spinner } from "react-bootstrap";
import { graphql } from "react-relay";
import { useFragment } from "react-relay/hooks";

import CensoredThumbnailImage from "../assets/img/regulation_mark_r18.png";
import { Link } from "./Link";
import { SuspenseImage } from "./SuspenseImage";
import { ArtworkListItem_artwork$key } from "./__generated__/ArtworkListItem_artwork.graphql";

interface ArtworkListItemProps {
  artwork: ArtworkListItem_artwork$key;
}

const LoadingSpinner: React.FC = () => (
  <div style={{ height: 186 }} className="d-flex justify-content-center h-100">
    <Spinner animation="border" role="status" style={{ width: 80, height: 80 }}>
      <span className="visually-hidden">Loading...</span>
    </Spinner>
  </div>
);

export const ArtworkListItem: React.FC<ArtworkListItemProps> = (props) => {
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
    props.artwork,
  );

  const account = artwork.account;
  if (!artwork.topIllust) {
    return null;
  }

  return (
    <Card className="p-1" style={{ height: 320 }}>
      <Suspense fallback={<LoadingSpinner />}>
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
      <Card.Body>
        <h3 className="text-truncate">
          <Link
            to={`/artwork/${artwork.id}`}
            className="card-link text-body stretched-link"
          >
            {artwork.title}
          </Link>
        </h3>
        {account && (
          <Card.Text className="text-truncate">{account.name}</Card.Text>
        )}
        <Card.Text className="text-truncate">{artwork.caption}</Card.Text>
      </Card.Body>
    </Card>
  );
};
