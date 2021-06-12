import Carousel from "bootstrap/js/dist/carousel";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { PreloadedQuery, usePreloadedQuery } from "react-relay";
import { Link } from "react-router-dom";
import { graphql } from "babel-plugin-relay/macro";
import { ArtworkDetailQuery } from "./__generated__/ArtworkDetailQuery.graphql";
import { formatDateTime } from "../util";
import { LikeList } from "./ArtworkDetail/ArtworkLikeList";
import clsx from "clsx";
import { usePrevious } from "../hooks/usePrevious";
import { ArtworkComment } from "./ArtworkDetail/ArtworkComment";

export const artworkDetailQuery = graphql`
  query ArtworkDetailQuery($id: ID!) {
    node(id: $id) {
      ... on Artwork {
        id
        title
        caption
        createdAt
        account {
          kmcid
          name
        }
        illusts {
          edges {
            node {
              id
              filename
            }
          }
        }
        ...ArtworkLikeList_likes
        ...ArtworkComment_comments
        tags {
          edges {
            node {
              tag {
                id
                name
              }
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
  const { node: artwork } = usePreloadedQuery<ArtworkDetailQuery>(
    artworkDetailQuery,
    prepared.artworkDetailQuery
  );
  const [index, setIndex] = useState(0);
  const previousIndex = usePrevious(index);
  const carouselElementRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<Carousel | null>(null);

  useEffect(() => {
    if (!carouselElementRef.current) {
      return;
    }
    carouselRef.current = new Carousel(carouselElementRef.current, {
      pause: true,
      wrap: false,
    });
  });

  const handleNext = useCallback(() => {
    setIndex((currentIndex) => {
      const newIndex = Math.max(0, currentIndex + 1);
      if (currentIndex !== newIndex) {
        carouselRef.current!.next();
      }
      return newIndex;
    });
  }, []);
  const handlePrevious = useCallback(() => {
    setIndex((currentIndex) => {
      const newIndex = Math.min(
        currentIndex - 1,
        artwork?.illusts?.edges.length || 0
      );
      if (currentIndex !== newIndex) {
        carouselRef.current!.prev();
      }
      return newIndex;
    });
  }, [artwork]);

  if (!artwork) {
    return <div>作品が見つかりません</div>;
  }
  const createdAt = new Date(artwork.createdAt!);

  return (
    <div>
      <div className="card">
        <div className="card-header text-center">
          <h2>{artwork.title}</h2>
          <p>{artwork.caption}</p>
          <p>
            <Link to={`/user/${artwork.account?.kmcid}`}>
              {artwork.account?.name}
            </Link>
          </p>
          <p>{formatDateTime(createdAt)}</p>
        </div>
        <div className="card-body">
          <div className="row">
            <ul className="breadcrumb px-2 py-2 bg-light">
              <li className="breadcrumb-item">タグ</li>
              {artwork.tags?.edges.map((edge) => {
                const tag = edge?.node?.tag!;
                return (
                  <li key={tag.id} className="text-center breadcrumb-item">
                    <Link to={`/tagged_artworks/${tag.name}`}>#{tag.name}</Link>
                  </li>
                );
              })}
            </ul>
          </div>
          <LikeList artwork={artwork} />
          <div className="carousel slide" ref={carouselElementRef}>
            <div className="carousel-inner">
              {artwork.illusts?.edges.map((edge, i) => {
                if (!edge) {
                  return null;
                }
                const node = edge.node;
                if (!node) {
                  return null;
                }

                return (
                  <div
                    className={clsx(
                      "carousel-item",
                      (i === index || i === previousIndex) && "active"
                    )}
                    key={i}
                  >
                    <img
                      src={`http://localhost:5000/public/illusts/${node.filename}`}
                      alt=""
                      className="mw-100 d-block"
                    />
                  </div>
                );
              })}
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              disabled={index === 0}
              onClick={handlePrevious}
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              disabled={index === artwork.illusts?.edges.length}
              onClick={handleNext}
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
          <ArtworkComment artwork={artwork} />
        </div>
      </div>
    </div>
  );
};
