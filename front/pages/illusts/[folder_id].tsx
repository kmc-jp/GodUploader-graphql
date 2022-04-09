import { GetServerSideProps } from "next";
import { fetchQuery } from "react-relay";
import { graphql } from "react-relay";

import { initEnvironment } from "../../lib/RelayEnvironment";
import { FolderIdQuery } from "./__generated__/FolderIdQuery.graphql";

export const getServerSideProps: GetServerSideProps<{ folder_id: string }> =
  async (ctx) => {
    const folderId = ctx.params?.folder_id;
    if (!(typeof folderId === "string")) {
      return { notFound: true };
    }

    const environment = initEnvironment()
    const data = await fetchQuery<FolderIdQuery>(
      environment,
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
