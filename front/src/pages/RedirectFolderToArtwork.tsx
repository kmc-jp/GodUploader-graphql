import React from "react";
import { graphql } from "react-relay";
import { useLazyLoadQuery } from "react-relay";
import { Navigate, useParams } from "react-router";

import { RedirectFolderToArtworkQuery } from "./__generated__/RedirectFolderToArtworkQuery.graphql";

export const RedirectFolderToArtwork: React.VFC = () => {
  const { folder_id = "" } = useParams();
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

  return <Navigate to={`/artwork/${artwork.id}`} replace />;
};

export default RedirectFolderToArtwork;
