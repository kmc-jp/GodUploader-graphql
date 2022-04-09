import { GetServerSideProps } from "next";
import { fetchQuery } from "react-relay";
import { graphql } from "react-relay";

import { initEnvironment } from "../lib/RelayEnvironment";
import { myQuery } from "./__generated__/myQuery.graphql";

export default () => null;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const environment = initEnvironment();
  const data = await fetchQuery<myQuery>(
    environment,
    graphql`
      query myQuery {
        viewer {
          kmcid
        }
      }
    `,
    {}
  ).toPromise();

  if (typeof data?.viewer?.kmcid === "string") {
    return {
      redirect: {
        statusCode: 302,
        destination: `/users/${data?.viewer?.kmcid}`,
      },
    };
  }

  return {
    redirect: {
      statusCode: 302,
      destination: "/",
    },
  };
};
