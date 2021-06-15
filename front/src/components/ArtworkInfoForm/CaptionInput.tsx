import React from "react";

interface Props {
  caption: string;
  setCaption: (caption: string) => void;
}

export const CaptionInput: React.VFC<Props> = ({ caption, setCaption }) => (
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
