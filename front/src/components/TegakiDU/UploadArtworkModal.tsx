import React, { useContext, useState, useEffect } from "react";
import { graphql } from "react-relay";
import { PreloadedQuery, usePreloadedQuery, useQueryLoader } from "react-relay";

import { DrawingContext } from "../../contexts/TegakiDU/DrawingContext";
import { useArtworkInformation } from "../../hooks/useArtworkInformation";
import { useUploadArtworkContext } from "../../hooks/useUploadArtworkContext";
import { AgeRestrictionInput } from "../ArtworkInfoForm/AgeRestrictionInput";
import { CaptionInput } from "../ArtworkInfoForm/CaptionInput";
import { SlackChannelInput } from "../ArtworkInfoForm/SlackChannelInput";
import { TagsInput } from "../ArtworkInfoForm/TagsInput";
import { TitleInput } from "../ArtworkInfoForm/TitleInput";
import { ModalForm } from "../ModalForm";
import { UploadArtworkModalQuery } from "./__generated__/UploadArtworkModalQuery.graphql";

const uploadArtworkModalQuery = graphql`
  query UploadArtworkModalQuery {
    viewer {
      kmcid
    }
  }
`;

const ViewerInitializer: React.FC<{
  queryRef: PreloadedQuery<UploadArtworkModalQuery>;
  setTwitterUserName: (name: string) => void;
}> = ({ queryRef, setTwitterUserName }) => {
  const { viewer } = usePreloadedQuery<UploadArtworkModalQuery>(
    uploadArtworkModalQuery,
    queryRef,
  );
  useEffect(() => {
    setTwitterUserName(viewer ? viewer.kmcid : "");
  }, [viewer, setTwitterUserName]);
  return null;
};

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
  const [queryRef, loadQuery] = useQueryLoader<UploadArtworkModalQuery>(
    uploadArtworkModalQuery,
  );

  useEffect(() => {
    loadQuery({}, { fetchPolicy: "store-or-network" });
  }, [loadQuery]);

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

  const { ageRestriction } = useArtworkInformation();

  return (
    <ModalForm
      show={show}
      onHide={handleHide}
      onSubmit={handleSubmit}
      title="画像のアップロード"
      size="lg"
      isSubmitting={isUploading}
      submitLabel="アップロードする"
      submittingLabel="アップロード中……"
    >
      {queryRef && (
        <ViewerInitializer
          queryRef={queryRef}
          setTwitterUserName={setTwitterUserName}
        />
      )}
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
    </ModalForm>
  );
};
