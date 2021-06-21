import { graphql } from "babel-plugin-relay/macro";
import React from "react";
import { PreloadedQuery, usePreloadedQuery } from "react-relay";
import { useParams } from "react-router-dom";

import { ArtworkListItem } from "../components/ArtworkListItem";
import { TaggedArtworksQuery } from "./__generated__/TaggedArtworksQuery.graphql";

export const taggedArtworksQuery = graphql`
  query TaggedArtworksQuery($tag: String!) {
    taggedArtworks(tag: $tag, sort: [CREATED_AT_DESC]) {
      edges {
        node {
          ...ArtworkListItem_artwork
        }
      }
    }
  }
`;

interface IndexProps {
  prepared: {
    taggedArtworksQuery: PreloadedQuery<TaggedArtworksQuery>;
  };
}

export const TaggedArtworks: React.VFC<IndexProps> = ({ prepared }) => {
  const { taggedArtworks } = usePreloadedQuery<TaggedArtworksQuery>(
    taggedArtworksQuery,
    prepared.taggedArtworksQuery
  );
  const { tag } = useParams<{ tag: string }>();

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="text-center">タグ"{tag}"の絵たち</h2>
        </div>
        <div className="card-body">
          <div className="row row-cols-1 row-cols-lg-4">
            {taggedArtworks?.edges.map((edge, i) => {
              if (!(edge && edge.node)) {
                return null;
              }

              return (
                <div key={i} className="col p-2">
                  <ArtworkListItem artwork={edge.node} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
