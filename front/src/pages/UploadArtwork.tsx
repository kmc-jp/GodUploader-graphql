import React, { FormEvent, useCallback, useRef, useState } from "react";
import { useRelayEnvironment } from "react-relay";
import { Redirect } from "react-router";
import {
  commitUploadArtworkMutation,
  makeUploadables,
} from "../mutation/UploadArtwork";
import { TitleInput } from "../components/ArtworkInfoForm/TitleInput";
import { CaptionInput } from "../components/ArtworkInfoForm/CaptionInput";
import { TagsInput } from "../components/ArtworkInfoForm/TagsInput";
import { SlackChannelInput } from "../components/ArtworkInfoForm/SlackChannelInput";

export const UploadArtwork: React.VFC = () => {
  const environment = useRelayEnvironment();
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const filesRef = useRef<HTMLInputElement>(null);
  const [uploadedArtworkId, setUploadedArtworkId] = useState<string | null>(
    null
  );

  const [isUploading, setIsUploading] = useState(false);
  const [tagList, setTagList] = useState<string[]>([]);

  const [notifySlack, setNotifySlack] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [slackChannel, setSlackChannel] = useState("C039TN7Q1"); // #graphics

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      if (!(filesRef.current && filesRef.current.files)) {
        return;
      }

      const shareOption = notifySlack
        ? showThumbnail
          ? "SHARE_TO_SLACK_WITH_IMAGE"
          : "SHARE_TO_SLACK"
        : "NONE";

      setIsUploading(true);
      const files = filesRef.current.files;
      const uploadables = makeUploadables(files);
      commitUploadArtworkMutation(environment, {
        variables: {
          connections: [],
          input: {
            title,
            caption,
            tags: tagList,
            files: uploadables,
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
    [caption, environment, tagList, title]
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
    <div className="card">
      <div className="card-header">画像のアップロード</div>
      <div className="panel-body px-4 py-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="file" className="form-label">
              アップロードする画像 <span className="text-danger">(必須)</span>
            </label>
            <input
              type="file"
              className="form-control"
              id="file"
              ref={filesRef}
              multiple
              accept="image/*"
              required
            />
          </div>
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
          <div>
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
        </form>
      </div>
    </div>
  );
};
