import React, { useCallback, useState } from "react";
import { Button } from "react-bootstrap";
import { graphql } from "react-relay";
import { useFragment, useRelayEnvironment } from "react-relay";

import { AgeRestrictionInput } from "../../components/ArtworkInfoForm/AgeRestrictionInput";
import { CaptionInput } from "../../components/ArtworkInfoForm/CaptionInput";
import { TagsInput } from "../../components/ArtworkInfoForm/TagsInput";
import { TitleInput } from "../../components/ArtworkInfoForm/TitleInput";
import { ModalForm } from "../../components/ModalForm";
import {
  ageRestirctionToRating,
  ratingToAgeRestriction,
} from "../../contexts/ArtworkInformationContext";
import { useArtworkInformation } from "../../hooks/useArtworkInformation";
import { commitUpdateArtworkMutation } from "../../mutation/UpdateArtwork";
import { UpdateArtworkForm_artwork$key } from "./__generated__/UpdateArtworkForm_artwork.graphql";

interface Props {
  artworkKey: UpdateArtworkForm_artwork$key;
}

export const UpdateArtworkModal: React.FC<Props> = ({ artworkKey }) => {
  const artwork = useFragment<UpdateArtworkForm_artwork$key>(
    graphql`
      fragment UpdateArtworkForm_artwork on Artwork {
        id
        title
        caption
        rating
        tags {
          edges {
            node {
              name
            }
          }
        }
      }
    `,
    artworkKey,
  );
  const environment = useRelayEnvironment();
  const initialTagList = (artwork.tags?.edges || [])
    .map((edge) => {
      if (!edge?.node) {
        return "";
      }
      return edge.node.name;
    })
    .filter((tag) => tag !== "");
  const {
    title,
    caption,
    tags,
    ageRestriction,
    setTitle,
    setCaption,
    setTags,
    setAgeRestriction,
  } = useArtworkInformation();

  const [show, setShow] = useState(false);

  const resetStates = useCallback(() => {
    // explicitly reset values
    setTitle(artwork.title || "");
    setCaption(artwork.caption || "");
    setTags(initialTagList);
    setAgeRestriction(ratingToAgeRestriction(artwork.rating));
  }, [
    artwork.caption,
    artwork.rating,
    artwork.title,
    initialTagList,
    setAgeRestriction,
    setCaption,
    setTags,
    setTitle,
  ]);

  const handleHide = useCallback(() => {
    setShow(false);
    resetStates();
  }, [resetStates]);

  const handleUpdate = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const rating = ageRestirctionToRating(ageRestriction);

      commitUpdateArtworkMutation(environment, {
        variables: {
          input: {
            id: artwork.id!,
            title,
            caption,
            tags,
            rating,
          },
        },
        onCompleted: () => {
          setShow(false);
        },
      });
    },
    [ageRestriction, artwork.id, caption, environment, tags, title],
  );

  return (
    <>
      <Button variant="primary" onClick={() => setShow(true)}>
        情報の編集
      </Button>
      <ModalForm
        show={show}
        onHide={handleHide}
        onSubmit={handleUpdate}
        title="神絵の情報編集"
        size="xl"
      >
        <div className="mb-3">
          <TitleInput />
        </div>
        <div className="mb-3">
          <CaptionInput />
        </div>
        <div className="mb-3">
          <TagsInput />
        </div>
        <div className="mb-3">
          <AgeRestrictionInput />
        </div>
      </ModalForm>
    </>
  );
};
