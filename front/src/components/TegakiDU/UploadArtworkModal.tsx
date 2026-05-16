import React, { useContext, useState, useEffect } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { graphql } from "react-relay";
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

export const UploadArtworkModal: React.FC<Props> = ({ blob }) => {
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
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (blob) {
      setFiles([blob]);
      setShow(true);
    }
  }, [blob, setFiles]);

  const handleHide = () => {
    setShow(false);
    setIsPosting(false);
  };

  const { viewer } = useLazyLoadQuery<UploadArtworkModalQuery>(
    graphql`
      query UploadArtworkModalQuery {
        viewer {
          kmcid
        }
      }
    `,
    {},
    { fetchPolicy: "store-or-network" },
  );
  useEffect(() => {
    setTwitterUserName(!viewer ? "" : viewer.kmcid);
  }, []);

  const { ageRestriction } = useArtworkInformation();

  return (
    <Modal show={show} onHide={handleHide} size="lg">
      <form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>画像のアップロード</Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
          <>
            <div className="mb-3">
              <label htmlFor="notify_twitter">
                Twitterにも投稿する (KMCのアカウントで公開されるので注意)
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
              notifyTwitter && (
                <div className="mb-3">
                  Twitter投稿時のユーザー名
                  <input
                    type="text"
                    id="twitter_name"
                    value={twitterUserName}
                    onChange={(e) => setTwitterUserName(e.target.value)}
                  />
                </div>
              )
            ) : (
              <p className="mb-3 text-danger">
                年齢制限のある作品をTwitterに共有することはできません
              </p>
            )}
          </>
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
        </Modal.Body>
        <Modal.Footer>
          <Button
            type="submit"
            variant="primary"
            className="w-100"
            disabled={isUploading}
          >
            {isUploading ? (
              <div className="d-flex align-items-center justify-content-center">
                <Spinner size="sm" className="me-2" />
                アップロード中……
              </div>
            ) : (
              "アップロードする"
            )}
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};
