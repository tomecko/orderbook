import React from "react";
import { composeWithDevTools } from "redux-devtools-extension";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import { createEpicMiddleware } from "redux-observable";

import { App } from "./components/App";
import { rootEpic, rootReducer } from "./state";

import "./index.module.scss";

const getStore = () => {
  const epicMiddleware = createEpicMiddleware();
  const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(epicMiddleware))
  );
  epicMiddleware.run(rootEpic);
  return store;
};

ReactDOM.render(
  <React.StrictMode>
    <Provider store={getStore()}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
