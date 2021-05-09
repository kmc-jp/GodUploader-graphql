import { PreloadedQuery, usePreloadedQuery } from "react-relay";
import { graphql } from "babel-plugin-relay/macro";
import React from "react";
import type { IndexQuery } from "./__generated__/IndexQuery.graphql";

export const indexQuery = graphql`
  query IndexQuery {
    activeAccounts(sort: [FOLDERS_COUNT_DESC]) {
      edges {
        node {
          id
          name
          foldersCount
        }
      }
    }
    safeArtworks(first: 8, sort: [CREATED_AT_DESC]) {
      edges {
        node {
          id
          title
          caption
          illusts(first: 1) {
            edges {
              node {
                filename
              }
            }
          }
          account {
            name
          }
        }
      }
    }
  }
`;

interface IndexProps {
  prepared?: {
    indexQuery: PreloadedQuery<IndexQuery, Record<string, unknown>>;
  };
}

export const Index: React.VFC<IndexProps> = ({ prepared }) => {
  const { safeArtworks, activeAccounts } = usePreloadedQuery<IndexQuery>(
    indexQuery,
    prepared!.indexQuery
  );
  const artworkCount = safeArtworks?.edges?.length || 0;

  return (
    <div>
      <div>
        <h2>最新{artworkCount}件の絵</h2>
        {safeArtworks?.edges.map((edge) => {
          if (!edge) {
            return null;
          }
          const node = edge.node!;
          const firstIllust = node.illusts!.edges![0]!.node!;
          const account = node.account!;

          return (
            <div key={`newer-illusts-${node.id}`}>
              <img
                src={`http://localhost:5000/public/thumbnail/${firstIllust.filename}`}
                alt={node?.title}
              />
              <div className="caption">
                <h3>{node?.title}</h3>
                <p>{account.name}</p>
                <p>{node?.caption}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <h2>利用者達</h2>
        {activeAccounts?.edges.map((edge) => {
          if (!edge) {
            return null;
          }
          const node = edge.node!;
          return (
            <div key={`accounts-${node.id}`}>
              {node.name}({node.foldersCount})
            </div>
          );
        })}
      </div>
    </div>
  );
};
