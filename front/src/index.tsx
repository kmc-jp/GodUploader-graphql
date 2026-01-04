import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import ReactDOM from "react-dom";
import { RelayEnvironmentProvider } from "react-relay/hooks";
import { BrowserRouter } from "react-router-dom";

import { App } from "./App";
import RelayEnvironment from "./RelayEnvironment";

// opt-out Strict mode of React. ref: https://github.com/ReactTraining/react-router/issues/7870

ReactDOM.render(
  <RelayEnvironmentProvider environment={RelayEnvironment}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </RelayEnvironmentProvider>,
  document.getElementById("root")
);
