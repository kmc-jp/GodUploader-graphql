import { useRouter } from "next/router";
import React from "react";
import { useRelayEnvironment } from "react-relay";

import { commitDeleteArtworkMutation } from "../../lib/mutation/DeleteArtwork";

interface DeleteArtworkButtonProps {
  artworkId: string;
}

export const DeleteArtworkButton: React.VFC<DeleteArtworkButtonProps> = ({
  artworkId,
}) => {
  const environment = useRelayEnvironment();
  const router = useRouter();

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
        router.replace("/");
      },
    });
  };

  return (
    <button className="btn btn-danger" onClick={handleDeleteButtonClick}>
      この神絵を削除する
    </button>
  );
};
