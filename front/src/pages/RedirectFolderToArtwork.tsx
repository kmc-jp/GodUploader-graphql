import { graphql } from "react-relay";
import { LoaderFunctionArgs, redirect } from "react-router";
import { fetchQuery } from "relay-runtime";

import RelayEnvironment from "../RelayEnvironment";
import { RedirectFolderToArtworkQuery } from "./__generated__/RedirectFolderToArtworkQuery.graphql";

const redirectFolderToArtworkQuery = graphql`
  query RedirectFolderToArtworkQuery($folderId: Int!) {
    artworkByFolderId(folderId: $folderId) {
      id
    }
  }
`;

export async function loader({ params }: LoaderFunctionArgs) {
  const folderId = Number(params.folder_id);
  const data = await fetchQuery<RedirectFolderToArtworkQuery>(
    RelayEnvironment,
    redirectFolderToArtworkQuery,
    { folderId },
  ).toPromise();

  if (!data?.artworkByFolderId) {
    throw new Response("Not Found", { status: 404 });
  }

  return redirect(`/artwork/${data.artworkByFolderId.id}`);
}
