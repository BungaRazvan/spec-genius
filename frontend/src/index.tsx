import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

import { thunk } from "redux-thunk";

import { BrowserRouter } from "react-router-dom";

import { createInjector, createStore } from "reslice";

import { Provider } from "react-redux";
import { applyMiddleware, compose } from "redux";

import reducer from "./ducks";

const composeEnhancers =
  (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  {},
  (r) => r,
  composeEnhancers(applyMiddleware(thunk))
);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
