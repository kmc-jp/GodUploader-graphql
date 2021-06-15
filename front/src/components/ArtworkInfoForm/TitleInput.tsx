import React from "react";

interface Props {
  title: string,
  setTitle: (title: string) => void;
}

export const TitleInput: React.VFC<Props> = ({ title, setTitle }) => (
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
