import { Modal } from "bootstrap";
import React, { useContext, useRef } from "react";
import { useEffect } from "react";

import { CaptionInput } from "../../../components/ArtworkInfoForm/CaptionInput";
import { SlackChannelInput } from "../../../components/ArtworkInfoForm/SlackChannelInput";
import { TagsInput } from "../../../components/ArtworkInfoForm/TagsInput";
import { TitleInput } from "../../../components/ArtworkInfoForm/TitleInput";
import { useUploadArtworkContext } from "../../../hooks/useUploadArtworkContext";
import { DrawingContext } from "../contexts/DrawingContext";

interface Props {
  blob?: Blob;
}

export const UploadArtworkModal: React.VFC<Props> = ({ blob }) => {
  const {
    isUploading,
    showThumbnail,
    notifySlack,
    setFiles,
    setShowThumbnail,
    setNotifySlack,
    handleSubmit,
  } = useUploadArtworkContext();
  const { setIsPosting } = useContext(DrawingContext);

  useEffect(() => {
    if (blob) {
      setFiles([blob]);
    }
  }, [blob, setFiles]);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const modal = new Modal(ref.current);
    return () => {
      modal.hide();
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }

    const modal = Modal.getInstance(el);
    if (!modal) {
      return;
    }

    if (blob) {
      modal.show();
    }

    const hideModal = () => {
      setIsPosting(false);
    };

    el.addEventListener("hidden.bs.modal", hideModal);
    return () => {
      el.removeEventListener("hidden.bs.modal", hideModal);
    };
  }, [blob, setIsPosting]);

  return (
    <>
      <div
        className="modal fade"
        id="updateArtworkModal"
        aria-hidden="true"
        ref={ref}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">画像のアップロード</h5>
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
                  <label htmlFor="notify_slack">Slackに通知する</label>
                  <input
                    type="checkbox"
                    id="notify_slack"
                    checked={notifySlack}
                    onChange={(e) => setNotifySlack(e.target.checked)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="show_thumbnail">
                    サムネイルを表示する (Gyazoに自動的に投稿されます)
                  </label>
                  <input
                    type="checkbox"
                    id="show_thumbnail"
                    disabled={!notifySlack}
                    checked={showThumbnail}
                    onChange={(e) => setShowThumbnail(e.target.checked)}
                  />
                </div>
                <div className="mb-3">
                  <SlackChannelInput />
                </div>
                <div className="modal-footer">
                  <button
                    type="submit"
                    className="btn btn-primary form-control"
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <div className="d-flex align-items-center justify-content-center">
                        <div>
                          <span
                            className="spinner-border text-light"
                            role="status"
                          ></span>
                        </div>
                        <div>アップロード中……</div>
                      </div>
                    ) : (
                      "アップロードする"
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
