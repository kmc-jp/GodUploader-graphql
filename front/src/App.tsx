import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { Route, Switch } from "react-router-loading";

import { ErrorBoundary } from "./components/ErrorBoundary";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { LoadingOverlay } from "./components/LoadingOverlay";
import { routes } from "./routes";

export const App: React.VFC = () => {
  const history = useHistory();
  const [isLoading] = useState(true);

  useEffect(
    () =>
      history.listen((_, action) => {
        if (action === "PUSH") {
          window.scrollTo(0, 0);
        }
      }),
    [history]
  );

  return (
    <div className="App">
      <Helmet>
        <title>God Illust Uploader</title>
      </Helmet>
      {isLoading ? <LoadingOverlay /> : null}
      <Header />
      <div className="container">
        <ErrorBoundary>
          <Switch>
            {routes.map((route, i) => (
              <Route
                key={i}
                path={route.path}
                exact={route.exact}
                component={route.component}
              />
            ))}
          </Switch>
        </ErrorBoundary>
      </div>
      <Footer />
    </div>
  );
};
