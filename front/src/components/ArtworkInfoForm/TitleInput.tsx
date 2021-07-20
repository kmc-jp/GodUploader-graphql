import React from "react";

import { useArtworkInformation } from "../../hooks/useArtworkInformation";

export const TitleInput: React.VFC = () => {
  const { title, setTitle } = useArtworkInformation();

  return (
    <>
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
    </>
  );
};
