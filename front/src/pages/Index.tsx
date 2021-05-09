import { graphql, usePreloadedQuery, PreloadedQuery } from "react-relay";
import React from "react";
import type { IndexQuery } from "./__generated__/IndexQuery.graphql";

export const indexQuery = graphql`
  query IndexQuery {
    accounts(sort: [FOLDERS_COUNT_DESC]) {
      edges {
        node {
          name
          foldersCount
        }
      }
    }
    safeArtworks(first: 8, sort: [CREATED_AT_DESC]) {
      edges {
        node {
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

interface Props {
  prepared: {
    homeQuery: PreloadedQuery<IndexQuery, Record<string, unknown>>;
  };
}

export const Index: React.VFC<Props> = ({ prepared }: Props) => {
  const { safeArtworks, accounts } = usePreloadedQuery<IndexQuery>(
    indexQuery,
    prepared.homeQuery
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
            <div>
              <img src={firstIllust.filename} alt={node?.title} />
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
        {accounts?.edges.map((edge) => {
          if (!edge) {
            return null;
          }
          const node = edge.node!;
          return <div>{node.name}({node.foldersCount})</div>
        })}
      </div>
    </div>
  );
};
