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
    <div className="card">
      <Link to={`/artwork/${artwork.id}`} className="text-body" style={{textOverflow: "ellipsis"}}>
        <img
          src={`http://localhost:5000/public/thumbnail/${firstIllust.filename}`}
          alt={artwork?.title}
          style={{ width: "auto", height: 128, objectFit: "contain" }}
          className="card-img-top"
        />
        <div className="card-body">
          <h3>{artwork?.title}</h3>
          <p className="card-text">{account!.name}</p>
        </div>
      </Link>
    </div>
  );
};
