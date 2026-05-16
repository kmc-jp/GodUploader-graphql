import React, { Suspense, useCallback } from "react";
import { Helmet } from "react-helmet";
import { RelayEnvironmentProvider } from "react-relay/hooks";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate as useRouterNavigate,
} from "react-router";

import RelayEnvironment from "./RelayEnvironment";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { NavigationContext, NavigateFn } from "./contexts/NavigationContext";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <Meta />
        <Links />
      </head>
      <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function AppContent() {
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
}

export default function Root() {
  return (
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <AppContent />
    </RelayEnvironmentProvider>
  );
}
