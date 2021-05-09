import React from "react";
import { renderRoutes, RouteConfigComponentProps } from "react-router-config";
import "./App.css";

function App({ route }: RouteConfigComponentProps) {
  return (
    <div className="App">
      <h1>God Illust Uploader</h1>
      {renderRoutes(route && route.routes)}
    </div>
  );
}

export default App;
