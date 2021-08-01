import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";

export const Router: React.FC = ({ children }) => {
  const [forceRefresh, setForceRefresh] = useState(false);

  // 暫定的に、5分おきにページ遷移時に再読み込みされるようにする
  useEffect(() => {
    const timer = window.setTimeout(() => setForceRefresh(true), 5 * 60 * 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <BrowserRouter
      basename={process.env.REACT_APP_BASENAME}
      forceRefresh={forceRefresh}
    >
      {children}
    </BrowserRouter>
  );
};
