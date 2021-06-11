import React, { Suspense } from "react";
import { Link } from "react-router-dom";

import { RouteConfigComponentProps, RouteRenderer } from "./routing";
import { ErrorBoundary } from "./errorBoundary";

function App({ route }: RouteConfigComponentProps) {
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light bg-light mb-3">
        <div className="container">
          <Link className="navbar-brand" to="/">
            KMC画像アップローダー God Illust Uploader
          </Link>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/artwork/new" className="nav-link">
                アップロード
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/my" className="nav-link">
                マイページ
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <div className="container">
        <Suspense fallback={<p>Now loading...</p>}>
          <ErrorBoundary>
            <RouteRenderer routes={route && route.routes} />
          </ErrorBoundary>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
