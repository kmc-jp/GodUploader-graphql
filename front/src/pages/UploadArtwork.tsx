import React, { FormEvent, useCallback, useRef, useState } from "react";
import { useRelayEnvironment } from "react-relay";
import { Redirect } from "react-router";
import {
  commitUploadArtworkMutation,
  makeUploadables,
} from "../mutation/UploadArtwork";
import { TagsInput } from "./UploadArtwork/TagsInput";

export const UploadArtwork: React.VFC = () => {
  const environment = useRelayEnvironment();
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const filesRef = useRef<HTMLInputElement>(null);
  const [uploadedArtworkId, setUploadedArtworkId] =
    useState<string | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [tagList, setTagList] = useState<string[]>([]);

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      setIsUploading(true);
      const files = filesRef.current!.files!;
      const uploadables = makeUploadables(files);
      commitUploadArtworkMutation(environment, {
        variables: {
          input: {
            title,
            caption,
            tags: tagList,
            files: uploadables,
          },
        },
        uploadables,
        onCompleted: (resp) => {
          setIsUploading(false);
          setUploadedArtworkId(resp.uploadArtwork!.artwork!.id);
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
            <label htmlFor="title" className="form-label">
              タイトル <span className="text-danger">(必須)</span>
            </label>
            <input
              type="text"
              id="title"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="caption" className="form-label">
              キャプション
            </label>
            <input
              type="text"
              id="caption"
              className="form-control"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <TagsInput tagList={tagList} setTagList={setTagList} />
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
