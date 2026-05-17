import React from "react";
import { Card } from "react-bootstrap";
import { graphql } from "react-relay";
import { PreloadedQuery, usePreloadedQuery } from "react-relay";
import { useLoaderData, useParams } from "react-router";

import { ArtworkListItem } from "../components/ArtworkListItem";
import { UpdateTagModal } from "../components/TaggedArtworks/UpdateTagModal";
import { TaggedArtworksQuery } from "./__generated__/TaggedArtworksQuery.graphql";

export const taggedArtworksQuery = graphql`
  query TaggedArtworksQuery($tag: String!) {
    tagByName(name: $tag) {
      ...UpdateTagModal_tag
      editFreezed
    }
    taggedArtworks(tag: $tag, sort: [CREATED_AT_DESC]) {
      edges {
        node {
          ...ArtworkListItem_artwork
        }
      }
    }
  }
`;

export const TaggedArtworks: React.FC = () => {
  const { tag = "" } = useParams<{ tag: string }>();
  const decodedTag = decodeURIComponent(tag);
  const queryRef = useLoaderData() as PreloadedQuery<TaggedArtworksQuery>;
  const { tagByName, taggedArtworks } = usePreloadedQuery<TaggedArtworksQuery>(
    taggedArtworksQuery,
    queryRef,
  );

  if (!tagByName) {
    return <div>タグはありません</div>;
  }

  return (
    <div>
      <Card>
        <Card.Header>
          <h2 className="text-center">タグ&quot;{decodedTag}&quot;の絵たち</h2>
          {!tagByName.editFreezed && (
            <div className="d-flex justify-content-center mb-2">
              <UpdateTagModal tagKey={tagByName} />
            </div>
          )}
        </Card.Header>
        <Card.Body>
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
        </Card.Body>
      </Card>
    </div>
  );
};
