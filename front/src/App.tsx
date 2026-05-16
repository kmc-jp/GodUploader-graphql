import React, {
  Suspense,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from "react";
import { Helmet } from "react-helmet";
import { renderRoutes } from "react-router-config";
import { useHistory, useLocation } from "react-router-dom";

import { ErrorBoundary } from "./components/ErrorBoundary";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { NavigationContext, NavigateFn } from "./contexts/NavigationContext";
import { routes } from "./routes";

export const App: React.VFC = () => {
  const currentLocation = useLocation();
  const history = useHistory();
  const [isPending, startTransition] = useTransition();
  const [displayLocation, setDisplayLocation] = useState(currentLocation);

  useEffect(
    () =>
      history.listen((location, action) => {
        if (action === "PUSH") {
          window.scrollTo(0, 0);
        }
        if (action === "POP") {
          startTransition(() => {
            setDisplayLocation(location);
          });
        }
      }),
    [history, startTransition]
  );

  const navigate = useCallback<NavigateFn>(
    (to, replace = false) => {
      const resolvedTo =
        typeof to === "function" ? to(history.location) : to;
      if (replace) {
        history.replace(resolvedTo);
      } else {
        history.push(resolvedTo);
      }
      startTransition(() => {
        setDisplayLocation(history.location);
      });
    },
    [history, startTransition]
  );

  return (
    <NavigationContext.Provider value={navigate}>
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
    </NavigationContext.Provider>
  );
};
