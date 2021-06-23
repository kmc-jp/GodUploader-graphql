import { Modal } from "bootstrap";
import React, { FormEvent, useCallback, useRef, useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useRelayEnvironment } from "react-relay";
import { useHistory } from "react-router-dom";

import { CaptionInput } from "../../../components/ArtworkInfoForm/CaptionInput";
import { SlackChannelInput } from "../../../components/ArtworkInfoForm/SlackChannelInput";
import { TagsInput } from "../../../components/ArtworkInfoForm/TagsInput";
import { TitleInput } from "../../../components/ArtworkInfoForm/TitleInput";
import { commitUploadArtworkMutation } from "../../../mutation/UploadArtwork";
import { DrawingContext } from "../contexts/DrawingContext";

interface Props {
  blob?: Blob;
}

export const UploadArtworkModal: React.VFC<Props> = ({ blob }) => {
  const history = useHistory();
  const environment = useRelayEnvironment();
  const { setIsPosting } = useContext(DrawingContext);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [tagList, setTagList] = useState<string[]>(["tegaki_du"]);

  const [notifySlack, setNotifySlack] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [slackChannel, setSlackChannel] = useState("C039TN7Q1"); // #graphics

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    new Modal(ref.current);
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

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      const shareOption = notifySlack
        ? showThumbnail
          ? "SHARE_TO_SLACK_WITH_IMAGE"
          : "SHARE_TO_SLACK"
        : "NONE";

      if (!blob) {
        return;
      }
      setIsUploading(true);
      const uploadables = { 0: blob };
      commitUploadArtworkMutation(environment, {
        variables: {
          connections: [],
          input: {
            title,
            caption,
            tags: tagList,
            files: [null],
            shareOption,
            channelId: slackChannel,
          },
        },
        uploadables,
        onCompleted: (resp, errors) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const modal = Modal.getInstance(ref.current!);
          modal?.hide();

          setIsUploading(false);
          if (!resp.uploadArtwork?.artwork) {
            return;
          }

          history.replace(`/artwork/${resp.uploadArtwork.artwork.id}`);
        },
        updater: (store) => {
          store.invalidateStore();
        },
      });
    },
    [
      blob,
      caption,
      environment,
      history,
      notifySlack,
      showThumbnail,
      slackChannel,
      tagList,
      title,
    ]
  );

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
                  <TitleInput title={title} setTitle={setTitle} />
                </div>
                <div className="mb-3">
                  <CaptionInput caption={caption} setCaption={setCaption} />
                </div>
                <div className="mb-3">
                  <TagsInput tagList={tagList} setTagList={setTagList} />
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
                  <SlackChannelInput
                    slackChannel={slackChannel}
                    setSlackChannel={setSlackChannel}
                    disabled={!notifySlack}
                  />
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
