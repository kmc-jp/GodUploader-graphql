import { GetServerSideProps } from "next";
import Link from "next/link";
import React from "react";
import { fetchQuery } from "react-relay";
import { graphql } from "react-relay";

import { ArtworkListItem } from "../components/ArtworkListItem";
import { initEnvironment } from "../lib/RelayEnvironment";
import {
  pagesQuery,
  pagesQueryResponse,
} from "./__generated__/pagesQuery.graphql";

interface IndexProps {
  safeArtworks: pagesQueryResponse["safeArtworks"];
  activeAccounts: pagesQueryResponse["activeAccounts"];
}

const Index: React.VFC<IndexProps> = ({ safeArtworks, activeAccounts }) => {
  const artworkCount = safeArtworks?.edges?.length || 0;

  return (
    <div>
      {safeArtworks && safeArtworks.edges ? (
        <div className="card mb-5">
          <div className="card-header">
            <h2 className="text-center">最新{artworkCount}件の絵</h2>
          </div>
          <div className="card-body">
            <ul className="row row-cols-1 row-cols-lg-4">
              {safeArtworks.edges.map((edge, i) => {
                if (!edge) {
                  return null;
                }

                if (!edge.node) {
                  return null;
                }

                return (
                  <li key={i} className="col p-2">
                    <ArtworkListItem artwork={edge.node} />
                  </li>
                );
              })}
            </ul>
            <Link href="/artworks">
              <a
                type="button"
                className="btn btn-lg btn-outline-secondary w-100 text-center"
              >
                もっと見る
              </a>
            </Link>
          </div>
        </div>
      ) : (
        <div className="card mb-5"></div> // fallback
      )}
      <div className="card">
        <div className="card-header">
          <h2 className="text-center">利用者達</h2>
        </div>
        <div className="card-body">
          <div className="row row-cols-2 row-cols-lg-4">
            {activeAccounts?.edges.map((edge, i) => {
              if (!(edge && edge.node)) {
                return null;
              }
              const node = edge.node;
              return (
                <div key={i} className="col py-1">
                  <Link href={`/users/${node.kmcid}`} passHref>
                    <a
                      type="button"
                      className="btn btn-outline-secondary text-center w-100 d-flex justify-content-between"
                    >
                      {node.name}
                      <span className="badge rounded-pill bg-secondary">
                        {node.artworksCount}
                      </span>
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

export const getServerSideProps: GetServerSideProps<IndexProps> = async () => {
  const environment = initEnvironment();
  const data = await fetchQuery<pagesQuery>(
    environment,
    graphql`
      query pagesQuery {
        activeAccounts(sort: [ARTWORKS_COUNT_DESC]) {
          edges {
            node {
              id
              kmcid
              name
              artworksCount
            }
          }
        }
        safeArtworks: artworks(
          first: 8
          sort: [CREATED_AT_DESC]
          safeOnly: true
        ) @connection(key: "Index_safeArtworks") {
          __id
          edges {
            node {
              ...ArtworkListItem_artwork
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

export default Index;
