import React, { FormEvent, useCallback, useMemo, useState } from "react";
import { useRelayEnvironment } from "react-relay";
import { useHistory } from "react-router-dom";
import { PayloadError } from "relay-runtime";

import { CaptionInput } from "../components/ArtworkInfoForm/CaptionInput";
import { SlackChannelInput } from "../components/ArtworkInfoForm/SlackChannelInput";
import { TagsInput } from "../components/ArtworkInfoForm/TagsInput";
import { TitleInput } from "../components/ArtworkInfoForm/TitleInput";
import { ArtworkInformationProvider } from "../contexts/ArtworkInformationContext";
import { useArtworkInformation } from "../hooks/useArtworkInformation";
import { commitUploadArtworkMutation } from "../mutation/UploadArtwork";

export const UploadArtwork: React.VFC = () => {
  return (
    <ArtworkInformationProvider>
      <UploadArtworkForm />
    </ArtworkInformationProvider>
  );
};

const UploadArtworkForm = () => {
  const environment = useRelayEnvironment();
  const history = useHistory();
  const { title, caption, tags } = useArtworkInformation();

  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const [notifySlack, setNotifySlack] = useState(false);
  const [showThumbnail, setShowThumbnail] = useState(true);
  const [slackChannel, setSlackChannel] = useState("C039TN7Q1"); // #graphics

  const [errors, setErrors] = useState<PayloadError[] | null | undefined>(null);

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();

      const shareOption = notifySlack
        ? showThumbnail
          ? "SHARE_TO_SLACK_WITH_IMAGE"
          : "SHARE_TO_SLACK"
        : "NONE";

      setIsUploading(true);
      const uploadables = Object.fromEntries<File>(
        Array.from(files, (file, i) => [`variables.input.files.${i}`, file])
      );
      commitUploadArtworkMutation(environment, {
        variables: {
          connections: [],
          input: {
            title,
            caption,
            tags,
            files: Array.from(files, (_, i) => null),
            shareOption,
            channelId: slackChannel,
          },
        },
        uploadables,
        onCompleted: (resp, errors) => {
          setIsUploading(false);
          if (errors) {
            setErrors(errors.slice());
            return;
          }

          if (!resp.uploadArtwork?.artwork) {
            return;
          }

          history.replace(`/artwork/${resp.uploadArtwork.artwork.id}`);
        },
      });
    },
    [
      caption,
      environment,
      files,
      history,
      notifySlack,
      showThumbnail,
      slackChannel,
      tags,
      title,
    ]
  );

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      setFiles(Array.from(e.target.files ?? []));
    }, []);

  const images = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files]
  );

  return (
    <div className="card">
      <div className="card-header">画像のアップロード</div>
      <div className="panel-body px-4 py-4">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="file" className="form-label">
              アップロードする画像{" "}
              <span className="text-danger">
                (GIF/JPEG/PNG形式, 必須, 先頭の画像がサムネイルになります)
              </span>
            </label>
            <input
              type="file"
              className="form-control"
              id="file"
              multiple
              accept="image/gif,image/png,image/jpeg"
              required
              onChange={handleFileChange}
            />
            {images.length > 0 && (
              <div className="d-flex mt-2">
                {images.map((dataURL, i) => (
                  <div
                    key={i}
                    className="card me-2"
                    style={{ width: 186, height: 186 }}
                  >
                    <img
                      src={dataURL}
                      className="mw-100 mh-100"
                      alt=""
                      style={{ objectFit: "contain", display: "block" }}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
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
            <SlackChannelInput
              slackChannel={slackChannel}
              setSlackChannel={setSlackChannel}
              disabled={!notifySlack}
            />
          </div>
          <div>
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
          {errors &&
            errors.map((error, i) => (
              <div key={i} className="alert alert-danger mt-3" role="alert">
                {error.message}
              </div>
            ))}
        </form>
      </div>
    </div>
  );
};
