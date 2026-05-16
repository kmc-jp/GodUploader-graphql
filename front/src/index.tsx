import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { createRoot } from "react-dom/client";
import { RelayEnvironmentProvider } from "react-relay/hooks";
import { BrowserRouter } from 'react-router';

import { App } from "./App";
import RelayEnvironment from "./RelayEnvironment";

async function enableMocking() {
  if (import.meta.env.VITE_USE_MSW !== "1") return;
  const { worker } = await import("./mocks/browser");
  return worker.start({ onUnhandledRequest: "warn" });
}

// opt-out Strict mode of React. ref: https://github.com/ReactTraining/react-router/issues/7870

enableMocking().then(() => {
  const root = createRoot(document.getElementById("root")!);
  root.render(
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </RelayEnvironmentProvider>
  );
});
