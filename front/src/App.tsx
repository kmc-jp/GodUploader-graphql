import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.css';
import { Index } from './pages/Index';

function App() {
  return (
    <div className="App">
      <h1>God Illust Uploader</h1>
      <BrowserRouter>
        <Switch>
          <Route path="/">
            <Index />
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
