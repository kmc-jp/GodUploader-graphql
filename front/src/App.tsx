import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { renderRoutes } from "react-router-config";
import { useHistory, useLocation } from "react-router-dom";

import { ErrorBoundary } from "./components/ErrorBoundary";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { LoadingPresence } from "./components/LoadingPresence";
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
      <Header />
      <div className="container">
        <ErrorBoundary>
          <LoadingPresence
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
          >
            {renderRoutes(routes, null, { location: currentLocation })}
          </LoadingPresence>
        </ErrorBoundary>
      </div>
      <Footer />
    </div>
  );
};
