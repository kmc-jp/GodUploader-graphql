import React, { Suspense, useEffect, useRef, useState } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";

import { RouteConfigComponentProps, RouteRenderer } from "./routing";
import { ErrorBoundary } from "./errorBoundary";
import { LoadingOverlay } from "./components/LoadingOverlay";

const LoadingWatcher: React.VFC<{
  setIsLoading: (isLoading: boolean) => void;
}> = ({ setIsLoading }) => {
  useEffect(() => {
    setIsLoading(true);
    return () => setIsLoading(false);
  });
  return null;
};

function App({ route }: RouteConfigComponentProps) {
  const currentLocation = useLocation();
  const previousLocation = useRef(currentLocation);
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const dispose = history.listen((location, action) => {
      if (location !== currentLocation) {
        if (action !== "REPLACE") {
          previousLocation.current = currentLocation;
        }
        setIsLoading(true);
      }
    });

    return () => {
      setIsLoading(false);
      dispose();
    };
  }, [history, currentLocation]);

  // For non-suspended pages
  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="App">
      {isLoading ? <LoadingOverlay /> : null}
      <nav className="navbar navbar-expand-xl navbar-light bg-light mb-3">
        <div className="container">
          <Link className="navbar-brand" to="/">
            KMC画像アップローダー God Illust Uploader
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
                <Link to="/artwork/new" className="nav-link">
                  アップロード
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/my" className="nav-link">
                  マイページ
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/tags" className="nav-link">
                  タグ検索
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <div className="container">
        <ErrorBoundary>
          <Suspense
            fallback={
              <>
                <Suspense fallback={null}>
                  <RouteRenderer
                    routes={route && route.routes}
                    switchProps={{
                      location: previousLocation.current,
                    }}
                  />
                </Suspense>
                <LoadingWatcher setIsLoading={setIsLoading} />
              </>
            }
          >
            <RouteRenderer routes={route && route.routes} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  );
}

export default App;
