import { GetServerSideProps } from "next";
import { fetchQuery } from "react-relay";
import { graphql } from "react-relay";

import RelayEnvironment from "../lib/RelayEnvironment";
import { myQuery } from "./__generated__/myQuery.graphql";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const data = await fetchQuery<myQuery>(
    RelayEnvironment,
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
