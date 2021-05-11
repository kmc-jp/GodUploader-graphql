import React, { Suspense } from "react";
import { Link } from "react-router-dom";
import { RouteConfigComponentProps, RouteRenderer } from "./routing";
import { ErrorBoundary } from "./errorBoundary";
import "./App.css";

function App({ route }: RouteConfigComponentProps) {
  return (
    <div className="App">
      <Link to="/"><h1>God Illust Uploader</h1></Link>
      <Suspense fallback={<p>Now loading...</p>}>
        <ErrorBoundary>
          <RouteRenderer routes={route && route.routes} />
        </ErrorBoundary>
      </Suspense>
    </div>
  );
}

export default App;
