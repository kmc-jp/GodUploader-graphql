import React, { Suspense, useCallback } from "react";
import { Helmet } from "react-helmet";
import {
  Outlet,
  useNavigate as useRouterNavigate,
  useNavigation,
} from "react-router";

import { ErrorBoundary } from "./components/ErrorBoundary";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { NavigationContext, NavigateFn } from "./contexts/NavigationContext";

export const App: React.FC = () => {
  const navigation = useNavigation();
  const isPending = navigation.state !== "idle";
  const routerNavigate = useRouterNavigate();

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
              <Outlet />
            </Suspense>
          </ErrorBoundary>
        </div>
        <Footer />
      </div>
    </NavigationContext.Provider>
  );
};
