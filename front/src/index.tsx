import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom";
import { RelayEnvironmentProvider } from "react-relay/hooks";

import { App } from "./App";
import RelayEnvironment from "./RelayEnvironment";
import { Router } from "./router/Router";

// opt-out Strict mode of React. ref: https://github.com/ReactTraining/react-router/issues/7870
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.render(
  <RelayEnvironmentProvider environment={RelayEnvironment}>
    <Router>
      <App />
    </Router>
  </RelayEnvironmentProvider>,
  document.getElementById("root")
);
