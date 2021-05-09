import React from 'react';
import { renderRoutes, RouteConfigComponentProps } from './routing';
import './App.css';

function App({ route }: RouteConfigComponentProps) {
  return (
    <div className="App">
      <h1>God Illust Uploader</h1>
      {renderRoutes(route && route.routes)}
    </div>
  );
}

export default App;
