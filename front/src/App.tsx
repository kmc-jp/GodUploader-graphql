import React, { Suspense } from "react";
import { Link } from "react-router-dom";

import { RouteConfigComponentProps, RouteRenderer } from "./routing";
import { ErrorBoundary } from "./errorBoundary";

function App({ route }: RouteConfigComponentProps) {
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            KMC画像アップローダー God Illust Uploader
          </Link>
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
