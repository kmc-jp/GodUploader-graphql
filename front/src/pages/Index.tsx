import { graphql } from 'react-relay';
import React from 'react';

export const IndexQuery = graphql`
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

export const Index: React.VFC = () => <h2>It works!</h2>
