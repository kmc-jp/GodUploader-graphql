import React, { Suspense, useEffect, useState, useTransition } from "react";
import { Helmet } from "react-helmet";
import { renderRoutes } from "react-router-config";
import { useHistory, useLocation } from "react-router-dom";

import { ErrorBoundary } from "./components/ErrorBoundary";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { routes } from "./routes";

export const App: React.VFC = () => {
  const currentLocation = useLocation();
  const history = useHistory();
  const [isPending, startTransition] = useTransition();
  const [displayLocation, setDisplayLocation] = useState(currentLocation);
  const [prevLocation, setPrevLocation] = useState(currentLocation);

  if (prevLocation !== currentLocation) {
    setPrevLocation(currentLocation);
    startTransition(() => {
      setDisplayLocation(currentLocation);
    });
  }

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
      {isPending ? <LoadingOverlay /> : null}
      <Header />
      <div className="container">
        <ErrorBoundary>
          <Suspense fallback={<LoadingOverlay />}>
            {renderRoutes(routes, null, { location: displayLocation })}
          </Suspense>
        </ErrorBoundary>
      </div>
      <Footer />
    </div>
  );
};
