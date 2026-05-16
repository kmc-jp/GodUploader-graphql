import React from "react";
import { Form } from "react-bootstrap";

import { useArtworkInformation } from "../../hooks/useArtworkInformation";

export const TitleInput: React.FC = () => {
  const { title, setTitle } = useArtworkInformation();

  return (
    <>
      <Form.Label htmlFor="title">
        タイトル <span className="text-danger">(必須)</span>
      </Form.Label>
      <Form.Control
        type="text"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
    </>
  );
};
