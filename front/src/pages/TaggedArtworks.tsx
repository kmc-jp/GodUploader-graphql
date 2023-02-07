import React from "react";
import { graphql } from "react-relay";
import { useLazyLoadQuery } from "react-relay";
import { Redirect, useParams } from "react-router-dom";

import { ArtworkListItem } from "../components/ArtworkListItem";
import { UpdateTagModal } from "../components/TaggedArtworks/UpdateTagModal";
import { TaggedArtworksQuery } from "./__generated__/TaggedArtworksQuery.graphql";

export const TaggedArtworks: React.VFC = () => {
  const { tag } = useParams<{ tag: string }>();
  // NOTE: # などの文字列がパーセントエンコードされているのでデコードしておく
  const decodedTag = decodeURIComponent(tag);

  if (decodedTag === "R-18") {
    return <Redirect to="/artworks?mode=r_18" />;
  }

  if (decodedTag === "R-18G") {
    return <Redirect to="/artworks?mode=r_18" />;
  }

  return <Inner tag={decodedTag} />;
};

const Inner: React.VFC<{ tag: string }> = ({ tag }) => {
  const { tagByName, taggedArtworks } = useLazyLoadQuery<TaggedArtworksQuery>(
    graphql`
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
    `,
    { tag },
    { fetchPolicy: "store-and-network" }
  );

  if (!tagByName) {
    return <div>タグはありません</div>;
  }

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h2 className="text-center">タグ&quot;{tag}&quot;の絵たち</h2>
          {!tagByName.editFreezed && (
            <div className="d-flex justify-content-center mb-2">
              <UpdateTagModal tagKey={tagByName} />
              <button
                className="btn btn-primary"
                data-bs-toggle="modal"
                data-bs-target="#updateTagModal"
              >
                情報の編集
              </button>
            </div>
          )}
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
