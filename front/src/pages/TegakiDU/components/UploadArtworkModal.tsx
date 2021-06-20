import React, { FormEvent, useCallback, useRef, useState } from "react";
import { Modal } from "bootstrap";
import { useRelayEnvironment } from "react-relay";
import { Redirect } from "react-router";
import { commitUploadArtworkMutation } from "../../../mutation/UploadArtwork";
import { TitleInput } from "../../../components/ArtworkInfoForm/TitleInput";
import { CaptionInput } from "../../../components/ArtworkInfoForm/CaptionInput";
import { TagsInput } from "../../../components/ArtworkInfoForm/TagsInput";
import { SlackChannelInput } from "../../../components/ArtworkInfoForm/SlackChannelInput";
import { useEffect } from "react";

interface Props {
  blob?: Blob;
}

export const UploadArtworkModal: React.VFC<Props> = ({ blob }) => {
  const environment = useRelayEnvironment();
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [uploadedArtworkId, setUploadedArtworkId] = useState<string | null>(
    null
  );

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

    const modal = new Modal(ref.current);
    return () => modal.dispose();
  }, []);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const modal = Modal.getInstance(ref.current);
    if (!modal) {
      return;
    }

    if (blob) {
      modal.show();
    }
  }, [blob]);

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
          setIsUploading(false);
          if (!resp.uploadArtwork?.artwork) {
            return;
          }

          setUploadedArtworkId(resp.uploadArtwork.artwork.id);
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
      notifySlack,
      showThumbnail,
      slackChannel,
      tagList,
      title,
    ]
  );

  if (uploadedArtworkId) {
    return (
      <Redirect
        to={{
          pathname: `/artwork/${uploadedArtworkId}`,
        }}
        push
      />
    );
  }

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
                  <input
                    type="submit"
                    className="btn btn-primary form-control"
                    value="アップロードする"
                  />
                </div>
                {isUploading && (
                  <div className="mt-3 d-flex justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Uploading...</span>
                    </div>
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
