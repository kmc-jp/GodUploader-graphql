import Link from "next/link";
import React from "react";
import { graphql, useFragment } from "react-relay";

import { ArtworkListItem_artwork$key } from "./__generated__/ArtworkListItem_artwork.graphql";

interface ArtworkListItemProps {
  artwork: ArtworkListItem_artwork$key;
}

export const ArtworkListItem: React.VFC<ArtworkListItemProps> = ({
  artwork: _artwork,
}) => {
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
    _artwork
  );
  const account = artwork.account;

  return (
    <div className="card p-1" style={{ height: 320 }}>
      <img
        src={
          artwork.nsfw
            ? "/public/img/regulation_mark_r18.png"
            : artwork.topIllust!.thumbnailUrl
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
      <div className="card-body">
        <h3 className="text-truncate">
          <Link href={`/artwork/${artwork.id}`} passHref>
            <a className="card-link text-body stretched-link">
              {artwork.title}
            </a>
          </Link>
        </h3>
        {account && <p className="card-text text-truncate">{account.name}</p>}
        <p className="card-text text-truncate">{artwork.caption}</p>
      </div>
    </div>
  );
};
