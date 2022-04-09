import { graphql } from "babel-plugin-relay/macro";
import { GetServerSideProps } from "next";
import { fetchQuery } from "react-relay";

import RelayEnvironment from "../../lib/RelayEnvironment";
import { FolderIdQuery } from "./__generated__/FolderIdQuery.graphql";

export const getServerSideProps: GetServerSideProps<{ folder_id: string }> =
  async (ctx) => {
    const folderId = ctx.params?.folder_id;
    if (!(typeof folderId === "string")) {
      return { notFound: true };
    }

    const data = await fetchQuery<FolderIdQuery>(
      RelayEnvironment,
      graphql`
        query FolderIdQuery($folderId: Int!) {
          artworkByFolderId(folderId: $folderId) {
            id
          }
        }
      `,
      { folderId: Number(folderId) }
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
