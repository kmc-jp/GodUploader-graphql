import { graphql } from "babel-plugin-relay/macro";
import { Modal } from "bootstrap";
import React, { useCallback, useEffect, useRef } from "react";
import { useFragment, useRelayEnvironment } from "react-relay";

import { AgeRestrictionInput } from "../ArtworkInfoForm/AgeRestrictionInput";
import { CaptionInput } from "../ArtworkInfoForm/CaptionInput";
import { TagsInput } from "../ArtworkInfoForm/TagsInput";
import { TitleInput } from "../ArtworkInfoForm/TitleInput";
import {
  ageRestirctionFromTags,
  tagWithAgeRestriction,
} from "../../lib/contexts/ArtworkInformationContext";
import { useArtworkInformation } from "../../hooks/useArtworkInformation";
import { commitUpdateArtworkMutation } from "../../mutation/UpdateArtwork";
import { UpdateArtworkForm_artwork$key } from "./__generated__/UpdateArtworkForm_artwork.graphql";

interface Props {
  artworkKey: UpdateArtworkForm_artwork$key;
}

export const UpdateArtworkModal: React.VFC<Props> = ({ artworkKey }) => {
  const artwork = useFragment<UpdateArtworkForm_artwork$key>(
    graphql`
      fragment UpdateArtworkForm_artwork on Artwork {
        id
        title
        caption
        tags {
          edges {
            node {
              name
            }
          }
        }
      }
    `,
    artworkKey
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

  const ref = useRef<HTMLDivElement>(null);
  const resetStates = useCallback(() => {
    // explicitly reset values
    setTitle(artwork.title || "");
    setCaption(artwork.caption || "");
    setTags(initialTagList);
    setAgeRestriction(ageRestirctionFromTags(initialTagList));
  }, [
    artwork.caption,
    artwork.title,
    initialTagList,
    setAgeRestriction,
    setCaption,
    setTags,
    setTitle,
  ]);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    el.addEventListener("hidden.bs.modal", resetStates);
    return () => {
      el.removeEventListener("hidden.bs.modal", resetStates);
    };
  }, [resetStates]);

  const handleUpdate = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      commitUpdateArtworkMutation(environment, {
        variables: {
          input: {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            id: artwork.id!,
            title,
            caption,
            tags: tagWithAgeRestriction(tags, ageRestriction),
          },
        },
        onCompleted: () => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const modal = Modal.getInstance(ref.current!);
          modal?.hide();
        },
      });
    },
    [ageRestriction, artwork.id, caption, environment, tags, title]
  );

  return (
    <>
      <div
        className="modal fade"
        id="updateArtworkModal"
        aria-hidden="true"
        ref={ref}
      >
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
            <form onSubmit={handleUpdate}>
              <div className="modal-header">
                <h5 className="modal-title">神絵の情報編集</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="閉じる"
                  data-bs-dismiss="modal"
                ></button>
              </div>
              <div className="modal-body">
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
              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary form-control">
                  保存する
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <button
        className="btn btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#updateArtworkModal"
      >
        情報の編集
      </button>
    </>
  );
};
