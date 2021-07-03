import { graphql } from "babel-plugin-relay/macro";
import { Carousel } from "bootstrap";
import clsx from "clsx";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFragment } from "react-relay";

import { SuspenseImage } from "../../components/SuspenseImage";
import { usePrevious } from "../../hooks/usePrevious";
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
            }
          }
        }
      }
    `,
    artwork
  );
  const [index, setIndex] = useState(0);
  const previousIndex = usePrevious(index);
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

  return (
    <div className="carousel slide" ref={carouselElementRef}>
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
              className={clsx(
                "carousel-item",
                (i === index || i === previousIndex) && "active"
              )}
              key={i}
            >
              <SuspenseImage
                src={node.imageUrl}
                alt=""
                className="mw-100 d-block mx-auto"
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
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        disabled={index === illusts?.edges.length}
        onClick={handleNext}
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};
