import React from "react";
import { graphql } from "babel-plugin-relay/macro";
import { useFragment } from "react-relay/hooks";
import { Link } from "react-router-dom";
import { ArtworkListItem_artwork$key } from "./__generated__/ArtworkListItem_artwork.graphql";

interface ArtworkListItemProps {
  artwork: ArtworkListItem_artwork$key;
}

export const ArtworkListItem: React.VFC<ArtworkListItemProps> = (props) => {
  const artwork = useFragment(
    graphql`
      fragment ArtworkListItem_artwork on Artwork {
        id
        title
        caption
        illusts(first: 1) {
          edges {
            node {
              filename
            }
          }
        }
        account {
          name
        }
      }
    `,
    props.artwork
  );
  const firstIllust = artwork.illusts!.edges![0]!.node!;
  const account = artwork.account;

  return (
    <div className="card p-1" style={{height: 320}}>
      <img
        src={`http://localhost:5000/public/thumbnail/${firstIllust.filename}`}
        alt={artwork?.title}
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
          <Link to={`/artwork/${artwork.id}`} className="card-link text-body stretched-link">{artwork?.title}</Link>
        </h3>
        <p className="card-text text-truncate">{account!.name}</p>
        <p className="card-text text-truncate">{artwork.caption}</p>
      </div>
    </div>
  );
};
