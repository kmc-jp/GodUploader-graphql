import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import { RelayEnvironmentProvider } from "react-relay/hooks";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import RelayEnvironment from "./RelayEnvironment";
import { ErrorBoundary as AppErrorBoundary } from "./components/ErrorBoundary";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { LoadingPresence } from "./components/LoadingPresence";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <title>God Illust Uploader</title>
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <div className="App">
        {isLoading ? <LoadingOverlay /> : null}
        <Header />
        <div className="container">
          <AppErrorBoundary>
            <LoadingPresence
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
            >
              <Outlet />
            </LoadingPresence>
          </AppErrorBoundary>
        </div>
        <Footer />
      </div>
    </RelayEnvironmentProvider>
  );
}
