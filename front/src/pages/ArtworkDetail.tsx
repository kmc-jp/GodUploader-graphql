import React from "react";
import {
  PreloadedQuery,
  usePreloadedQuery,
  useRelayEnvironment,
} from "react-relay";
import { Link, useHistory } from "react-router-dom";
import { graphql } from "babel-plugin-relay/macro";
import { ArtworkDetailQuery } from "./__generated__/ArtworkDetailQuery.graphql";
import { formatDateTime } from "../util";
import { LikeList } from "./ArtworkDetail/ArtworkLikeList";
import { ArtworkComment } from "./ArtworkDetail/ArtworkComment";
import { IllustCarousel } from "./ArtworkDetail/IllustCarousel";
import { commitDeleteArtworkMutation } from "../mutation/DeleteArtwork";
import { UpdateArtworkModal } from "./ArtworkDetail/UpdateArtworkForm";

export const artworkDetailQuery = graphql`
  query ArtworkDetailQuery($id: ID!) {
    viewer {
      id
    }
    node(id: $id) {
      ... on Artwork {
        id
        title
        caption
        createdAt
        account {
          id
          kmcid
          name
        }
        ...IllustCarousel_illusts
        ...ArtworkLikeList_likes
        ...ArtworkComment_comments
        tags {
          edges {
            node {
              id
              name
            }
          }
        }
      }
    }
  }
`;

interface ArtworkDetailProps {
  prepared: {
    artworkDetailQuery: PreloadedQuery<ArtworkDetailQuery>;
  };
}

export const ArtworkDetail: React.FC<ArtworkDetailProps> = ({ prepared }) => {
  const environment = useRelayEnvironment();
  const history = useHistory();
  const { viewer, node: artwork } = usePreloadedQuery<ArtworkDetailQuery>(
    artworkDetailQuery,
    prepared.artworkDetailQuery
  );

  if (!artwork) {
    return <div>作品が見つかりません</div>;
  }
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const createdAt = new Date(artwork.createdAt!);

  const handleDeleteButtonClick = () => {
    if (!window.confirm("本当に削除しますか？")) {
      return;
    }
    if (!artwork.id) {
      return;
    }

    commitDeleteArtworkMutation(environment, {
      variables: {
        input: { id: artwork.id },
        connections: [],
      },
      onCompleted: () => {
        history.replace("/");
      },
      updater: (store) => {
        store.invalidateStore();
      },
    });
  };

  return (
    <div>
      <div className="card">
        <div className="card-header text-center">
          <h2>{artwork.title}</h2>
          <p>{artwork.caption}</p>
          <p>
            <Link to={`/users/${artwork.account?.kmcid}`}>
              {artwork.account?.name}
            </Link>
          </p>
          <p>{formatDateTime(createdAt)}</p>
          {artwork.account?.id === viewer?.id && (
            <UpdateArtworkModal artwork={artwork} />
          )}
        </div>
        <div className="card-body">
          <div className="row">
            <ul className="breadcrumb px-2 py-2 bg-light">
              <li className="breadcrumb-item">タグ</li>
              {artwork.tags?.edges.map((edge) => {
                const tag = edge?.node;
                if (!tag) {
                  return null;
                }

                return (
                  <li key={tag.id} className="text-center breadcrumb-item">
                    <Link to={`/tagged_artworks/${tag.name}`}>#{tag.name}</Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <LikeList artwork={artwork} />
          <IllustCarousel artwork={artwork} />
          <ArtworkComment artwork={artwork} />
          {viewer && artwork.account && artwork.account.id === viewer.id && (
            <div className="mt-2 d-flex justify-content-center">
              <button
                className="btn btn-danger"
                onClick={handleDeleteButtonClick}
              >
                この神絵を削除する
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
