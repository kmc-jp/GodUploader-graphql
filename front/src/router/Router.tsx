import { createBrowserHistory } from "history";
import React, { useEffect, useState } from "react";
import { Router as ReactRouter } from "react-router-dom";

const history = createBrowserHistory({
  basename: process.env.REACT_APP_BASENAME,
});

export const Router: React.FC = ({ children }) => {
  const [forceRefresh, setForceRefresh] = useState(false);

  // 暫定的に、5分おきにページ遷移時に再読み込みされるようにする
  useEffect(() => {
    const timer = window.setTimeout(() => {
      console.log("force refresh requested");
      setForceRefresh(true);
    }, 5 * 60 * 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  // 後からBrowserRouterのforceRefresh propを書き換えても、BrowserRouter内で保持しているhistoryオブジェクトが作り直されない
  // なので自分でhistoryの変化をlistenして、forceRefresh = trueのときに再読み込みされるようにする
  useEffect(() => {
    const dispose = history.listen((location) => {
      if (forceRefresh) {
        window.location.replace(history.createHref(location));
      }
    });
    return () => dispose();
  }, [forceRefresh]);

  return <ReactRouter history={history}>{children}</ReactRouter>;
};
