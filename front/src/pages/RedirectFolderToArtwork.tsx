import { graphql } from "babel-plugin-relay/macro";
import React from "react";
import { useLazyLoadQuery } from "react-relay";
import { Redirect, useParams } from "react-router-dom";

import { RedirectFolderToArtworkQuery } from "./__generated__/RedirectFolderToArtworkQuery.graphql";

export const RedirectFolderToArtwork: React.VFC = () => {
  const { folder_id } = useParams<{ folder_id: string }>();
  const { artworkByFolderId: artwork } =
    useLazyLoadQuery<RedirectFolderToArtworkQuery>(
      graphql`
        query RedirectFolderToArtworkQuery($folderId: Int!) {
          artworkByFolderId(folderId: $folderId) {
            id
          }
        }
      `,
      { folderId: Number(folder_id) }
    );

  if (!artwork) {
    return <div>artwork not found</div>;
  }

  return <Redirect to={`/artwork/${artwork.id}`} />;
};
