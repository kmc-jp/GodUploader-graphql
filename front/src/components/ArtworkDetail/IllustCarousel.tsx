import { graphql } from "babel-plugin-relay/macro";
import { Carousel } from "bootstrap";
import clsx from "clsx";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFragment } from "react-relay";

import { SuspenseImage } from "../../components/SuspenseImage";
import { IllustCarousel_illusts$key } from "./__generated__/IllustCarousel_illusts.graphql";

interface Props {
  artwork: IllustCarousel_illusts$key;
}

export const IllustCarousel: React.VFC<Props> = ({ artwork }) => {
  const { illusts } = useFragment<IllustCarousel_illusts$key>(
    graphql`
      fragment IllustCarousel_illusts on Artwork {
        illusts {
          edges {
            node {
              id
              imageUrl
              webpUrl
              thumbnailUrl
            }
          }
        }
      }
    `,
    artwork
  );
  const [index, setIndex] = useState(0);
  const carouselElementRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<Carousel | null>(null);

  useEffect(() => {
    // reset carousel index
    setIndex(0);
  }, [illusts]);

  useEffect(() => {
    if (!carouselElementRef.current) {
      return;
    }
    carouselRef.current = new Carousel(carouselElementRef.current, {
      pause: true,
      wrap: false,
    });

    return () => {
      carouselRef.current?.dispose();
    };
  });

  const handleNext = useCallback(() => {
    setIndex((currentIndex) => {
      const newIndex = Math.max(0, currentIndex + 1);
      if (currentIndex !== newIndex) {
        carouselRef.current?.next();
      }
      return newIndex;
    });
  }, []);
  const handlePrevious = useCallback(() => {
    setIndex((currentIndex) => {
      const newIndex = Math.min(currentIndex - 1, illusts?.edges.length || 0);
      if (currentIndex !== newIndex) {
        carouselRef.current?.prev();
      }
      return newIndex;
    });
  }, [illusts]);

  if (!(illusts && illusts.edges)) {
    return null;
  }

  return (
    <>
      <div className="carousel carousel-dark slide" ref={carouselElementRef}>
        <div className="carousel-inner">
          {illusts?.edges.map((edge, i) => {
            if (!edge) {
              return null;
            }
            const node = edge.node;
            if (!node) {
              return null;
            }

            return (
              <div
                className={clsx("carousel-item", i === 0 && "active")}
                key={i}
              >
                <picture>
                  <source
                    srcSet={node.webpUrl}
                    className="mw-100 d-block mx-auto"
                  />
                  <img
                    src={node.imageUrl}
                    alt=""
                    className="mw-100 d-block mx-auto"
                  />
                </picture>
              </div>
            );
          })}
        </div>
        {index > 0 && (
          <button
            className="carousel-control-prev"
            type="button"
            onClick={handlePrevious}
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
        )}
        {index < illusts.edges.length - 1 && (
          <button
            className="carousel-control-next"
            type="button"
            onClick={handleNext}
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        )}
      </div>
      {illusts.edges.length >= 2 && (
        <div className="mt-2 d-flex justify-content-center">
          {illusts.edges.map((edge, i) => {
            const node = edge?.node;
            if (!node) {
              return null;
            }

            return (
              <a
                key={i}
                href={`#illust-${i}`}
                className={clsx(
                  "card",
                  "me-2",
                  i === index && "border-primary"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  setIndex(i);
                  carouselRef.current?.to(i);
                }}
              >
                <SuspenseImage
                  src={node.thumbnailUrl}
                  style={{
                    maxWidth: "100%",
                    height: 186,
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </a>
            );
          })}
        </div>
      )}
    </>
  );
};
