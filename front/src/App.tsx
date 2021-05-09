import React from 'react';
import { RouteConfigComponentProps, RouteRenderer } from './routing';
import './App.css';

function App({ route }: RouteConfigComponentProps) {
  return (
    <div className="App">
      <h1>God Illust Uploader</h1>
      <RouteRenderer routes={route && route.routes} />
    </div>
  );
}

export default App;
