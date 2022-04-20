import { graphql } from "babel-plugin-relay/macro";
import { Modal } from "bootstrap";
import React, { useContext, useRef } from "react";
import { useEffect } from "react";
import { useLazyLoadQuery } from "react-relay";

import { DrawingContext } from "../../contexts/TegakiDU/DrawingContext";
import { useArtworkInformation } from "../../hooks/useArtworkInformation";
import { useUploadArtworkContext } from "../../hooks/useUploadArtworkContext";
import { AgeRestrictionInput } from "../ArtworkInfoForm/AgeRestrictionInput";
import { CaptionInput } from "../ArtworkInfoForm/CaptionInput";
import { SlackChannelInput } from "../ArtworkInfoForm/SlackChannelInput";
import { TagsInput } from "../ArtworkInfoForm/TagsInput";
import { TitleInput } from "../ArtworkInfoForm/TitleInput";
import { UploadArtworkModalQuery } from "./__generated__/UploadArtworkModalQuery.graphql";

interface Props {
  blob?: Blob;
}

export const UploadArtworkModal: React.VFC<Props> = ({ blob }) => {
  const {
    isUploading,
    showThumbnail,
    notifySlack,
    notifyTwitter,
    twitterUserName,
    setFiles,
    setShowThumbnail,
    setNotifySlack,
    setNotifyTwitter,
    setTwitterUserName,
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

  const { viewer } = useLazyLoadQuery<UploadArtworkModalQuery>(
    graphql`
      query UploadArtworkModalQuery {
        viewer {
          kmcid
        }
      }
    `,
    {},
    { fetchPolicy: "store-or-network" }
  );
  useEffect(() => {
    setTwitterUserName(viewer === null ? "" : viewer.kmcid);
  }, []);

  const { ageRestriction } = useArtworkInformation();

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
                  <AgeRestrictionInput />
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
                {
                  <>
                    <div className="mb-3">
                      <label htmlFor="notify_twitter">
                        Twitterにも投稿する
                        (KMCのアカウントで公開されるので注意)
                      </label>
                      <input
                        type="checkbox"
                        id="notify_twitter"
                        checked={ageRestriction === "SAFE" && notifyTwitter}
                        disabled={ageRestriction !== "SAFE"}
                        onChange={(e) => setNotifyTwitter(e.target.checked)}
                      />
                    </div>
                    {ageRestriction === "SAFE" ? (
                      <div className="mb-3">
                        Twitter投稿時のユーザー名
                        <input
                          type="text"
                          id="twitter_name"
                          value={twitterUserName}
                          onChange={(e) => setTwitterUserName(e.target.value)}
                        />
                      </div>
                    ) : (
                      <p className="mb-3 text-danger">
                        年齢制限のある作品をTwitterに共有することはできません
                      </p>
                    )}
                  </>
                }
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
