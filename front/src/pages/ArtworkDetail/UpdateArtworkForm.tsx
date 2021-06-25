import { Modal } from "bootstrap";
import React, { useState, useCallback, useEffect, useRef } from "react";
import { useRelayEnvironment } from "react-relay";

import { CaptionInput } from "../../components/ArtworkInfoForm/CaptionInput";
import { TagsInput } from "../../components/ArtworkInfoForm/TagsInput";
import { TitleInput } from "../../components/ArtworkInfoForm/TitleInput";
import { commitUpdateArtworkMutation } from "../../mutation/UpdateArtwork";
import { ArtworkDetailQueryResponse } from "../__generated__/ArtworkDetailQuery.graphql";

interface Props {
  artwork: NonNullable<ArtworkDetailQueryResponse["node"]>;
}

export const UpdateArtworkModal: React.VFC<Props> = ({ artwork }) => {
  const environment = useRelayEnvironment();
  const [title, setTitle] = useState(artwork.title || "");
  const [caption, setCaption] = useState(artwork.caption || "");

  const initialTagList = (artwork.tags?.edges || [])
    .map((edge) => {
      if (!edge?.node) {
        return "";
      }
      return edge.node.name;
    })
    .filter((tag) => tag !== "");
  const [tagList, setTagList] = useState<string[]>(initialTagList);

  const ref = useRef<HTMLDivElement>(null);
  const resetStates = useCallback(() => {
    // explicitly reset values
    setTitle(artwork.title || "");
    setCaption(artwork.caption || "");
    setTagList(initialTagList);
  }, [artwork.caption, artwork.title, initialTagList]);

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
            tags: tagList,
          },
        },
        onCompleted: () => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const modal = Modal.getInstance(ref.current!);
          modal?.hide();
        },
      });
    },
    [artwork.id, caption, environment, tagList, title]
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
                  <TitleInput title={title} setTitle={setTitle} />
                </div>
                <div className="mb-3">
                  <CaptionInput caption={caption} setCaption={setCaption} />
                </div>
                <div className="mb-3">
                  <TagsInput tagList={tagList} setTagList={setTagList} />
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
