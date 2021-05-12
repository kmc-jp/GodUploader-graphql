import React from "react";
import { graphql } from "babel-plugin-relay/macro";
import { useFragment } from "react-relay/hooks";
import { Link as RouterLink } from "react-router-dom";
import { ArtworkListItem_artwork$key } from "./__generated__/ArtworkListItem_artwork.graphql"
import { Card, CardContent, Link, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles({
  root: {
    maxWidth: 400,
  }
});

interface ArtworkListItemProps {
  artwork: ArtworkListItem_artwork$key;
}

export const ArtworkListItem: React.VFC<ArtworkListItemProps> = (props) => {
  const classes = useStyles();

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
    <Card className={classes.root} variant="elevation">
      <CardContent>
        <Link component={RouterLink} to={`/artwork/${artwork.id}`}>
          <img
            src={`http://localhost:5000/public/thumbnail/${firstIllust.filename}`}
            alt={artwork?.title}
            style={{maxHeight: 128}}
          />
          <div className="caption">
            <Typography variant="h6" component="h3">{artwork?.title}</Typography>
            <Typography variant="body2" component="p">{account!.name}</Typography>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};
