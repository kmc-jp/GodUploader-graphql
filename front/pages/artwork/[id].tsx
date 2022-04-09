import clsx from "clsx";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import React, { useMemo } from "react";
import { fetchQuery } from "react-relay";
import { graphql } from "react-relay";
import reactStringReplace from "react-string-replace";

import { ArtworkComment } from "../../components/ArtworkDetail/ArtworkComment";
import { LikeList } from "../../components/ArtworkDetail/ArtworkLikeList";
import { DeleteArtworkButton } from "../../components/ArtworkDetail/DeleteArtworkButton";
import { IllustCarousel } from "../../components/ArtworkDetail/IllustCarousel";
import { UpdateArtworkModal } from "../../components/ArtworkDetail/UpdateArtworkForm";
import { ShareButton } from "../../components/ShareButton";
import { initEnvironment } from "../../lib/RelayEnvironment";
import {
  ageRestirctionFromTags,
  ArtworkInformationProvider,
} from "../../lib/contexts/ArtworkInformationContext";
import { formatDateTime } from "../../lib/util";
import { IdQuery, IdQuery$data } from "./__generated__/IdQuery.graphql";

const autolink = (caption: string) => {
  return reactStringReplace(caption, /(https?:\/\/\S+)/g, (match, i) => (
    <a key={match + i} href={match} target="_blank" rel="noopener noreferrer">
      {match}
    </a>
  ));
};

interface ArtworkDetailProps {
  artworkWithBidirectional: IdQuery$data["artworkWithBidirectional"];
}

const ArtworkDetail: React.VFC<ArtworkDetailProps> = ({
  artworkWithBidirectional,
}) => {
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
      <Head>
        <title>
          {`${artwork.title} - ${artwork.account?.name}のイラスト - God Illust Uploader`}
        </title>
      </Head>
      <div className="card">
        <div className="card-header text-center">
          <h2>{artwork.title}</h2>
          <p>{autolink(artwork.caption)}</p>
          <p>
            <Link href={`/users/${artwork.account?.kmcid}`}>
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
                      <Link href={`/tagged_artworks/${tag.name}`}>
                        {`#${tag.name}`}
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
                  <Link href={`/artwork/${next.id}`} passHref>
                    <a className="page-link h-100">
                      <div className="d-none d-sm-block">
                        <img
                          src={
                            next.nsfw
                              ? "/public/img/regulation_mark_r18.png"
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
                    </a>
                  </Link>
                </li>
              )}
              {previous && (
                <li className="page-item">
                  <Link href={`/artwork/${previous.id}`} passHref>
                    <a className="page-link h-100">
                      <div className="d-none d-sm-block">
                        <img
                          src={
                            previous.nsfw
                              ? "/public/img/regulation_mark_r18.png"
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
                    </a>
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

export const getServerSideProps: GetServerSideProps<ArtworkDetailProps> =
  async (ctx) => {
    const { id } = ctx.query;
    const environment = initEnvironment();
    const data = await fetchQuery<IdQuery>(
      environment,
      graphql`
        query IdQuery($id: ID!) {
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
      { id: typeof id === "string" ? id : id[0] }
    ).toPromise();

    if (!data) {
      return { notFound: true };
    }

    const initialRecords = environment.getStore().getSource().toJSON();
    return { props: { ...data, initialRecords } };
  };

export default ArtworkDetail;
