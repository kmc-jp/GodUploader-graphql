import React from "react";
import { useRelayEnvironment } from "react-relay";
import { useHistory } from "react-router-dom";

import { commitDeleteArtworkMutation } from "../../../mutation/DeleteArtwork";

interface DeleteArtworkButtonProps {
  artworkId: string;
}

export const DeleteArtworkButton: React.VFC<DeleteArtworkButtonProps> = ({
  artworkId,
}) => {
  const environment = useRelayEnvironment();
  const history = useHistory();

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
        history.replace("/");
      },
    });
  };

  return (
    <button className="btn btn-danger" onClick={handleDeleteButtonClick}>
      この神絵を削除する
    </button>
  );
};
