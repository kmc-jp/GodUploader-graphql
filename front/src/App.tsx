import React, { Suspense } from "react";
import { RouteConfigComponentProps, RouteRenderer } from "./routing";
import "./App.css";

function App({ route }: RouteConfigComponentProps) {
  return (
    <div className="App">
      <h1>God Illust Uploader</h1>
      <Suspense fallback={<p>Now loading...</p>}>
        <RouteRenderer routes={route && route.routes} />
      </Suspense>
    </div>
  );
}

export default App;
