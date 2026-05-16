import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { Carousel } from "react-bootstrap";
import { graphql } from "react-relay";
import { useFragment } from "react-relay";

import { SuspenseImage } from "../../components/SuspenseImage";
import { IllustCarousel_illusts$key } from "./__generated__/IllustCarousel_illusts.graphql";

interface Props {
  artwork: IllustCarousel_illusts$key;
}

export const IllustCarousel: React.FC<Props> = ({ artwork }) => {
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
    artwork,
  );
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // reset carousel index
    setIndex(0);
  }, [illusts]);

  if (!(illusts && illusts.edges)) {
    return null;
  }

  return (
    <>
      <Carousel
        activeIndex={index}
        onSelect={(i) => setIndex(i)}
        variant="dark"
        wrap={false}
        indicators={false}
        interval={null}
      >
        {illusts.edges.map((edge, i) => {
          if (!edge) {
            return null;
          }
          const node = edge.node;
          if (!node) {
            return null;
          }

          return (
            <Carousel.Item key={i}>
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
            </Carousel.Item>
          );
        })}
      </Carousel>
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
                  i === index && "border-primary",
                )}
                onClick={(e) => {
                  e.preventDefault();
                  setIndex(i);
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
