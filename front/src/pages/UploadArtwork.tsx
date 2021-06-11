import React, { FormEvent, useCallback, useRef, useState } from "react";
import { useRelayEnvironment } from "react-relay";
import { Redirect } from "react-router";
import {
  commitUploadArtworkMutation,
  makeUploadables,
} from "../mutation/UploadArtwork";

export const UploadArtwork: React.VFC = () => {
  const environment = useRelayEnvironment();
  const titleRef = useRef<HTMLInputElement>(null);
  const captionRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef<HTMLInputElement>(null);
  const [uploadedArtworkId, setUploadedArtworkId] =
    useState<string | null>(null);

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      const title = titleRef.current!.value;
      const caption = captionRef.current!.value;
      const files = filesRef.current!.files!;
      const uploadables = makeUploadables(files);
      commitUploadArtworkMutation(
        environment,
        {
          title,
          caption,
          tags: "", // TODO: タグ設定を受け付ける
          files: uploadables,
        },
        uploadables,
        (resp) => {
          setUploadedArtworkId(resp.uploadArtwork!.artwork!.id);
        }
      );
    },
    [environment]
  );

  if (uploadedArtworkId) {
    return (
      <Redirect
        to={{
          pathname: `/artwork/${uploadedArtworkId}`,
        }}
      />
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <p>画像のアップロード</p>
      </div>
      <div className="panel-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-sm-12">
              <label htmlFor="title">タイトル(必須)</label>
              <input
                type="text"
                id="title"
                className="form-control"
                ref={titleRef}
                required
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <label htmlFor="caption">キャプション</label>
              <input
                type="text"
                id="caption"
                className="form-control"
                ref={captionRef}
              />
            </div>
          </div>
          <input
            type="file"
            id="file"
            ref={filesRef}
            multiple
            accept="image/*"
            required
          />
          <input
            type="submit"
            className="btn btn-primary"
            value="アップロードする"
          />
        </form>
      </div>
    </div>
  );
};
