import React, { useCallback } from "react";

import styles from "./ShareButton.module.css";

interface ShareButtonProps {
  url: string;
  title: string;
}

const canShare = "share" in navigator;

export const ShareButton: React.VFC<ShareButtonProps> = ({ url, title }) => {
  const handleClick = useCallback(() => {
    if (!canShare) {
      return;
    }
    navigator.share({ url, title });
  }, [title, url]);

  // 非対応ブラウザには出さない
  if (!canShare) {
    return null;
  }

  return (
    <button
      className={`btn btn-info ${styles.container}`}
      onClick={handleClick}
    >
      シェアする
    </button>
  );
};
