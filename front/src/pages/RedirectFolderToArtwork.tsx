import { graphql } from "babel-plugin-relay/macro";
import React from "react";
import { PreloadedQuery, usePreloadedQuery } from "react-relay";
import { Redirect } from "react-router-dom";

import { RedirectFolderToArtworkQuery } from "./__generated__/RedirectFolderToArtworkQuery.graphql";

const redirectFolderToArtworkQuery = graphql`
  query RedirectFolderToArtworkQuery($folderId: Int!) {
    artworkByFolderId(folderId: $folderId) {
      id
    }
  }
`;

interface Props {
  prepared: {
    redirectFolderToArtworkQuery: PreloadedQuery<RedirectFolderToArtworkQuery>;
  };
}

export const RedirectFolderToArtwork: React.VFC<Props> = ({ prepared }) => {
  const { artworkByFolderId: artwork } = usePreloadedQuery(
    redirectFolderToArtworkQuery,
    prepared.redirectFolderToArtworkQuery
  );

  if (!artwork) {
    return <div>artwork not found</div>;
  }

  return <Redirect to={`/artwork/${artwork.id}`} />;
};
