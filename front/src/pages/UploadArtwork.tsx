import React, { FormEvent, useCallback, useRef, useState } from "react";
import { useRelayEnvironment } from "react-relay";
import { Redirect } from "react-router";
import { commitUploadArtworkMutation } from "../mutation/UploadArtwork";

export const UploadArtwork: React.VFC = () => {
  const environment = useRelayEnvironment();
  const titleRef = useRef<HTMLInputElement>(null);
  const captionRef = useRef<HTMLInputElement>(null);
  const filesRef = useRef<HTMLInputElement>(null);
  const [uploadedArtworkId, setUploadedArtworkId] = useState<string | null>(null);

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      const title = titleRef.current!.value;
      const caption = captionRef.current!.value;
      const files = filesRef.current!.files!;
      commitUploadArtworkMutation(
        environment,
        { title, caption, tags: "", files: [] },
        files,
        (resp) => {
          setUploadedArtworkId(resp.uploadArtwork!.artwork!.id);
        }
      );
    },
    [environment]
  );

  if (uploadedArtworkId) {
    return <Redirect to={{
      pathname: `/artwork/${uploadedArtworkId}`,
    }} />
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        タイトル: <input type="text" id="title" ref={titleRef} required />
      </div>
      <div>
        説明: <input type="text" id="caption" ref={captionRef} />
      </div>
      <input type="file" id="file" multiple ref={filesRef} required />
      <input type="submit" value="アップロードする" />
    </form>
  );
};
