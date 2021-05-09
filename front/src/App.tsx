import React from "react";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import { RouteRenderer } from "./routes";

function App({ route }) {
  return (
    <div className="App">
      <h1>God Illust Uploader</h1>
      <BrowserRouter>
        <RouteRenderer routes={route && route.routes} />
      </BrowserRouter>
    </div>
  );
}

export default App;
