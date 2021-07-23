import { graphql } from "babel-plugin-relay/macro";
import clsx from "clsx";
import React, { useMemo } from "react";
import { Helmet } from "react-helmet";
import { PreloadedQuery, usePreloadedQuery } from "react-relay";
import { Link } from "react-router-dom";
import reactStringReplace from "react-string-replace";

import CensoredThumbnailImage from "../../assets/img/regulation_mark_r18.png";
import { SuspenseImage } from "../../components/SuspenseImage";
import {
  ageRestirctionFromTags,
  ArtworkInformationProvider,
} from "../../contexts/ArtworkInformationContext";
import { formatDateTime } from "../../util";
import { ArtworkDetailQuery } from "./__generated__/ArtworkDetailQuery.graphql";
import { ArtworkComment } from "./components/ArtworkComment";
import { LikeList } from "./components/ArtworkLikeList";
import { DeleteArtworkButton } from "./components/DeleteArtworkButton";
import { IllustCarousel } from "./components/IllustCarousel";
import { UpdateArtworkModal } from "./components/UpdateArtworkForm";

const artworkDetailQuery = graphql`
  query ArtworkDetailQuery($id: ID!) {
    viewer {
      id
    }
    artworkWithBidirectional(id: $id) {
      previous {
        id
        title
        nsfw
        topIllust {
          thumbnailUrl
        }
      }
      next {
        id
        title
        nsfw
        topIllust {
          thumbnailUrl
        }
      }
      current {
        id
        title
        caption
        createdAt
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
`;

interface ArtworkDetailProps {
  prepared: {
    artworkDetailQuery: PreloadedQuery<ArtworkDetailQuery>;
  };
}

const autolink = (caption: string) => {
  return reactStringReplace(caption, /(https?:\/\/\S+)/g, (match, i) => (
    <a key={match + i} href={match} target="_blank" rel="noopener noreferrer">
      {match}
    </a>
  ));
};

const ArtworkDetail: React.FC<ArtworkDetailProps> = ({ prepared }) => {
  const { viewer, artworkWithBidirectional } =
    usePreloadedQuery<ArtworkDetailQuery>(
      artworkDetailQuery,
      prepared.artworkDetailQuery
    );

  const tags = useMemo((): string[] => {
    if (!artworkWithBidirectional?.current) {
      return [];
    }

    const { tags } = artworkWithBidirectional.current;
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

  if (!(artworkWithBidirectional && artworkWithBidirectional.current)) {
    return <div>作品が見つかりません</div>;
  }

  const { previous, next, current: artwork } = artworkWithBidirectional;

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
          {artwork.account && viewer && artwork.account.id === viewer.id && (
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
          <LikeList artwork={artwork} />
          <IllustCarousel artwork={artwork} />
          <ArtworkComment artwork={artwork} />
          {viewer && artwork.account && artwork.account.id === viewer.id && (
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