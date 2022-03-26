import { graphql } from "babel-plugin-relay/macro";
import clsx from "clsx";
import React, { useMemo } from "react";
import { Helmet } from "react-helmet";
import { useLazyLoadQuery } from "react-relay";
import { Link, useParams } from "react-router-dom";
import reactStringReplace from "react-string-replace";

import CensoredThumbnailImage from "../assets/img/regulation_mark_r18.png";
import { ArtworkComment } from "../components/ArtworkDetail/ArtworkComment";
import { LikeList } from "../components/ArtworkDetail/ArtworkLikeList";
import { DeleteArtworkButton } from "../components/ArtworkDetail/DeleteArtworkButton";
import { IllustCarousel } from "../components/ArtworkDetail/IllustCarousel";
import { UpdateArtworkModal } from "../components/ArtworkDetail/UpdateArtworkForm";
import { ShareButton } from "../components/ShareButton";
import { SuspenseImage } from "../components/SuspenseImage";
import {
  ageRestirctionFromTags,
  ArtworkInformationProvider,
} from "../contexts/ArtworkInformationContext";
import { formatDateTime } from "../util";
import { ArtworkDetailQuery } from "./__generated__/ArtworkDetailQuery.graphql";

const autolink = (caption: string) => {
  return reactStringReplace(caption, /(https?:\/\/\S+)/g, (match, i) => (
    <a key={match + i} href={match} target="_blank" rel="noopener noreferrer">
      {match}
    </a>
  ));
};

const ArtworkDetail: React.VFC = () => {
  const { id } = useParams<{ id: string }>();
  const { artworkWithBidirectional } = useLazyLoadQuery<ArtworkDetailQuery>(
    graphql`
      query ArtworkDetailQuery($id: ID!) {
        artworkWithBidirectional: node(id: $id) {
          __typename
          ... on Artwork {
            previousArtwork {
              id
              title
              nsfw
              topIllust {
                thumbnailUrl
              }
            }
            nextArtwork {
              id
              title
              nsfw
              topIllust {
                thumbnailUrl
              }
            }
            id
            title
            caption
            createdAt
            editable
            account {
              id
              kmcid
              name
            }
            ...UpdateArtworkForm_artwork
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
    `,
    { id },
    { fetchPolicy: "store-and-network" }
  );

  const tags = useMemo((): string[] => {
    if (
      !(
        artworkWithBidirectional &&
        artworkWithBidirectional.__typename === "Artwork"
      )
    ) {
      return [];
    }

    const { tags } = artworkWithBidirectional;
    if (!tags?.edges) {
      return [];
    }

    return tags.edges
      .map((edge) => {
        if (!edge?.node) {
          return "";
        }

        return edge.node.name;
      })
      .filter((t) => t);
  }, [artworkWithBidirectional]);

  if (
    !(
      artworkWithBidirectional &&
      artworkWithBidirectional.__typename === "Artwork"
    )
  ) {
    return <div>作品が見つかりません</div>;
  }

  const {
    previousArtwork: previous,
    nextArtwork: next,
    ...artwork
  } = artworkWithBidirectional;

  const createdAt = new Date(artwork.createdAt);

  return (
    <div>
      <Helmet>
        <title>
          {`${artwork.title} - ${artwork.account?.name}のイラスト - God Illust Uploader`}
        </title>
      </Helmet>
      <div className="card">
        <div className="card-header text-center">
          <h2>{artwork.title}</h2>
          <p>{autolink(artwork.caption)}</p>
          <p>
            <Link to={`/users/${artwork.account?.kmcid}`}>
              {artwork.account?.name}
            </Link>
          </p>
          <p>{formatDateTime(createdAt)}</p>
          {artwork.editable && (
            <ArtworkInformationProvider
              initialTitle={artwork.title}
              initialCaption={artwork.caption}
              initialTags={tags}
              initialAgeRestriction={ageRestirctionFromTags(tags)}
            >
              <UpdateArtworkModal artworkKey={artwork} />
            </ArtworkInformationProvider>
          )}
        </div>
        <div className="card-body">
          {artwork.tags?.edges && artwork.tags.edges.length > 0 && (
            <div className="row">
              <ul className="breadcrumb px-2 py-2 bg-light">
                {artwork.tags.edges.map((edge) => {
                  const tag = edge?.node;
                  if (!tag) {
                    return null;
                  }

                  return (
                    <li key={tag.id} className="text-center breadcrumb-item">
                      <Link to={`/tagged_artworks/${tag.name}`}>
                        #{tag.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
          <div className="mb-2 d-flex justify-content-between">
            <LikeList artwork={artwork} />
            <ShareButton
              title={artwork.title}
              url={`${process.env.PUBLIC_URL}/artwork/${artwork.id}`}
            />
          </div>
          <IllustCarousel artwork={artwork} />
          <ArtworkComment artwork={artwork} />
          {artwork.editable && (
            <div className="mt-2 d-flex justify-content-center">
              <DeleteArtworkButton artworkId={artwork.id} />
            </div>
          )}
        </div>
        <div className="card-footer">
          <nav aria-label="前後の作品">
            <ul
              className={clsx(
                "pagination",
                "align-items-stretch",
                previous && next && "justify-content-between",
                previous && !next && "justify-content-end",
                !previous && next && "justify-content-start"
              )}
            >
              {next && (
                <li className="page-item">
                  <Link className="page-link h-100" to={`/artwork/${next.id}`}>
                    <div className="d-none d-sm-block">
                      <SuspenseImage
                        src={
                          next.nsfw
                            ? CensoredThumbnailImage
                            : next.topIllust?.thumbnailUrl
                        }
                        style={{ maxWidth: 186 }}
                      />
                    </div>
                    <span aria-hidden="true">&laquo; </span>
                    {next.title}
                    {next.nsfw && (
                      <div className="d-block d-sm-none text-danger">
                        (NSFW)
                      </div>
                    )}
                  </Link>
                </li>
              )}
              {previous && (
                <li className="page-item">
                  <Link
                    className="page-link h-100"
                    to={`/artwork/${previous.id}`}
                  >
                    <div className="d-none d-sm-block">
                      <SuspenseImage
                        src={
                          previous.nsfw
                            ? CensoredThumbnailImage
                            : previous.topIllust?.thumbnailUrl
                        }
                        style={{ maxWidth: 186 }}
                      />
                    </div>
                    {previous.title}
                    <span aria-hidden="true"> &raquo;</span>
                    {previous.nsfw && (
                      <div className="d-block d-sm-none text-danger">
                        (NSFW)
                      </div>
                    )}
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ArtworkDetail;
