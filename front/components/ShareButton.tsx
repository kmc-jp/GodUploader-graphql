import React, { useCallback, useEffect, useState } from "react";

import styles from "./ShareButton.module.css";

interface ShareButtonProps {
  url: string;
  title: string;
}

export const ShareButton: React.VFC<ShareButtonProps> = ({ url, title }) => {
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    setCanShare("share" in navigator);
  }, []);

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
