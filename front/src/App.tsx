import React, {
  Suspense,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from "react";
import { Helmet } from "react-helmet";
import {
  useLocation,
  useNavigate as useRouterNavigate,
  useNavigationType,
} from "react-router";

import { AppRoutes } from "./AppRoutes";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { NavigationContext, NavigateFn } from "./contexts/NavigationContext";

export const App: React.VFC = () => {
  const currentLocation = useLocation();
  const navigationType = useNavigationType();
  const routerNavigate = useRouterNavigate();
  const [isPending, startTransition] = useTransition();
  const [displayLocation, setDisplayLocation] = useState(currentLocation);

  useEffect(() => {
    if (navigationType === "PUSH") {
      window.scrollTo(0, 0);
    }
    startTransition(() => {
      setDisplayLocation(currentLocation);
    });
  }, [currentLocation, navigationType, startTransition]);

  const navigate = useCallback<NavigateFn>(
    (to, replace = false) => {
      routerNavigate(to, { replace });
    },
    [routerNavigate],
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
              <AppRoutes location={displayLocation} />
            </Suspense>
          </ErrorBoundary>
        </div>
        <Footer />
      </div>
    </NavigationContext.Provider>
  );
};
