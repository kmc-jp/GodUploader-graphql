import React, { Suspense } from "react";
import { RouteConfigComponentProps, RouteRenderer } from "./routing";
import { ErrorBoundary } from "./errorBoundary";
import "./App.css";
import { AppBar, Container, Toolbar, Typography } from "@material-ui/core";

function App({ route }: RouteConfigComponentProps) {
  return (
    <div className="App">
      <AppBar position="sticky">
        <Toolbar>
          <Typography component="h1" variant="h5">
            God Illust Uploader
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Suspense fallback={<p>Now loading...</p>}>
          <ErrorBoundary>
            <RouteRenderer routes={route && route.routes} />
          </ErrorBoundary>
        </Suspense>
      </Container>
    </div>
  );
}

export default App;
