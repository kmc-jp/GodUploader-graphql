import React from "react";

import { useArtworkInformation } from "../../hooks/useArtworkInformation";

export const CaptionInput: React.VFC = () => {
  const { caption, setCaption } = useArtworkInformation();

  return (
    <>
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
    </>
  );
};
