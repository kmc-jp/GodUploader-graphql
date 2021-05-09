import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import RelayEnvironment from "./RelayEnvironment";
import { RelayEnvironmentProvider } from "react-relay/hooks";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import { RouteRenderer, routes } from "./routing";

ReactDOM.render(
  <React.StrictMode>
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <BrowserRouter>
        <Suspense fallback={<p>Now loading...</p>}>
          <RouteRenderer routes={routes} />
        </Suspense>
      </BrowserRouter>
    </RelayEnvironmentProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
