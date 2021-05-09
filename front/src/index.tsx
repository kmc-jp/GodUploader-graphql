import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import RelayEnvironment from "./RelayEnvironment";
import { RelayEnvironmentProvider } from "react-relay/hooks";
import reportWebVitals from "./reportWebVitals";
import { RouteRenderer } from "./routes";
import { routes } from "./routing";

ReactDOM.render(
  <React.StrictMode>
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <Suspense fallback={<p>Now loading...</p>}>
        <BrowserRouter>
          <RouteRenderer routes={routes} />
        </BrowserRouter>
      </Suspense>
    </RelayEnvironmentProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
