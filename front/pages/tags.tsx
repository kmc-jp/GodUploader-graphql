import { GetServerSideProps } from "next";
import Link from "next/link";
import React from "react";
import { fetchQuery, useLazyLoadQuery } from "react-relay";
import { graphql } from "react-relay";

import { initEnvironment } from "../lib/RelayEnvironment";
import { tagsQuery, tagsQuery$data } from "./__generated__/tagsQuery.graphql";

interface TagsProps {
  allTags: tagsQuery$data["allTags"];
}

const Tags: React.VFC<TagsProps> = ({ allTags }) => {
  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="text-center">タグまとめ</h2>
        </div>
        <div className="card-body">
          <div className="d-flex flex-wrap justify-content-between">
            {allTags?.edges.map((edge, i) => {
              if (!(edge && edge.node)) {
                return null;
              }
              const node = edge.node;
              return (
                <div key={i} className="py-1">
                  <Link href={`/tagged_artworks/${node.name}`} passHref>
                    <a
                      type="button"
                      className="btn btn-outline-secondary text-center w-100 d-flex justify-content-between flex-fill"
                    >
                      <div className="me-auto">#{node.name}</div>
                      <div className="badge rounded-pill bg-secondary">
                        {node.artworksCount}
                      </div>
                    </a>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<TagsProps> = async () => {
  const environment = initEnvironment();
  const data = await fetchQuery<tagsQuery>(
    environment,
    graphql`
      query tagsQuery {
        allTags(sort: [UPDATED_AT_DESC]) {
          edges {
            node {
              name
              artworksCount
            }
          }
        }
      }
    `,
    {}
  ).toPromise();

  if (!data) {
    return { notFound: true };
  }

  const initialRecords = environment.getStore().getSource().toJSON();
  return { props: { ...data, initialRecords } };
};

export default Tags;
