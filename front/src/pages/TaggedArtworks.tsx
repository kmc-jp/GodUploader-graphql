import { PreloadedQuery, usePreloadedQuery } from "react-relay";
import { graphql } from "babel-plugin-relay/macro";
import React from "react";
import { useRouteMatch } from "react-router";
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
  prepared?: {
    taggedArtworksQuery: PreloadedQuery<TaggedArtworksQuery, Record<string, unknown>>;
  };
}

export const TaggedArtworks: React.VFC<IndexProps> = ({ prepared }) => {
  const { taggedArtworks } = usePreloadedQuery<TaggedArtworksQuery>(
    taggedArtworksQuery,
    prepared!.taggedArtworksQuery
  );
  const match = useRouteMatch<{ tag: string }>();
  const tag = match.params.tag;

  return (
    <div>
      <div>
        <h2>タグ"{tag}"の絵たち</h2>
        {taggedArtworks?.edges.map((edge) => {
          if (!edge) {
            return null;
          }

          return <ArtworkListItem artwork={edge.node!} />
        })}
      </div>
    </div>
  );
};
