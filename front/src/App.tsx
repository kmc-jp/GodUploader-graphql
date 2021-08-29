import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, NavLink, useHistory, useLocation } from "react-router-dom";

import { ErrorBoundary } from "./components/ErrorBoundary";
import { Footer } from "./components/Footer";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { LoadingPresence } from "./components/LoadingPresence";
import { RouteRenderer } from "./router/RouteRenderer";
import { routes } from "./routes";

export const App: React.VFC = () => {
  const currentLocation = useLocation();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(
    () =>
      history.listen((_, action) => {
        if (action === "PUSH") {
          window.scrollTo(0, 0);
        }
      }),
    [history]
  );

  return (
    <div className="App">
      <Helmet>
        <title>God Illust Uploader</title>
      </Helmet>
      {isLoading ? <LoadingOverlay /> : null}
      <nav className="navbar navbar-expand-xl navbar-light bg-light mb-3">
        <div className="container">
          <Link className="navbar-brand" to="/">
            <span className="d-none d-md-inline">KMC画像アップローダー </span>
            God Illust Uploader
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  to="/artwork/new"
                  className="nav-link"
                  activeClassName="active"
                >
                  アップロード
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink to="/my" className="nav-link" activeClassName="active">
                  マイページ
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/tags"
                  className="nav-link"
                  activeClassName="active"
                >
                  タグ検索
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  to="/tegaki"
                  className="nav-link"
                  activeClassName="active"
                >
                  tegaki_du
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container">
        <ErrorBoundary>
          <LoadingPresence
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
          >
            <RouteRenderer
              routes={routes}
              switchProps={{ location: currentLocation }}
            />
          </LoadingPresence>
        </ErrorBoundary>
      </div>
      <Footer />
    </div>
  );
};
