import React from "react";
import { Form } from "react-bootstrap";

import { useArtworkInformation } from "../../hooks/useArtworkInformation";

export const CaptionInput: React.FC = () => {
  const { caption, setCaption } = useArtworkInformation();

  return (
    <>
      <Form.Label htmlFor="caption">キャプション</Form.Label>
      <Form.Control
        as="textarea"
        id="caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
    </>
  );
};
