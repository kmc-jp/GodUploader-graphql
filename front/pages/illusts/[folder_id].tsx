import { graphql } from "babel-plugin-relay/macro";
import { GetServerSideProps } from "next";
import { fetchQuery } from "react-relay";

import RelayEnvironment from "../../lib/RelayEnvironment";
import { RedirectFolderToArtworkQuery } from "./__generated__/RedirectFolderToArtworkQuery.graphql";

export const getServerSideProps: GetServerSideProps<{ folder_id: string }> =
  async (ctx) => {
    const folderId = ctx.params?.folder_id;
    if (!(typeof folderId === "string")) {
      return { notFound: true };
    }

    const data = await fetchQuery<RedirectFolderToArtworkQuery>(
      RelayEnvironment,
      graphql`
        query RedirectFolderToArtworkQuery($folderId: Int!) {
          artworkByFolderId(folderId: $folderId) {
            id
          }
        }
      `,
      { folderId }
    ).toPromise();

    if (typeof data?.artworkByFolderId?.id === "string") {
      return {
        redirect: {
          statusCode: 302,
          destination: `/artwork/${data?.artworkByFolderId?.id}`,
        },
      };
    }

    return { notFound: true };
  };
