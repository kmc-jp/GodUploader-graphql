import React from "react";
import { Button } from "react-bootstrap";
import { useRelayEnvironment } from "react-relay";
import { useNavigate } from "react-router";

import { commitDeleteArtworkMutation } from "../../mutation/DeleteArtwork";

interface DeleteArtworkButtonProps {
  artworkId: string;
}

export const DeleteArtworkButton: React.FC<DeleteArtworkButtonProps> = ({
  artworkId,
}) => {
  const environment = useRelayEnvironment();
  const navigate = useNavigate();

  const handleDeleteButtonClick = () => {
    if (!window.confirm("本当に削除しますか？")) {
      return;
    }

    commitDeleteArtworkMutation(environment, {
      variables: {
        input: { id: artworkId },
        connections: [],
      },
      onCompleted: () => {
        navigate("/", { replace: true });
      },
    });
  };

  return (
    <Button variant="danger" onClick={handleDeleteButtonClick}>
      この神絵を削除する
    </Button>
  );
};
