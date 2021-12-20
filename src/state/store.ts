import { composeWithDevTools } from "redux-devtools-extension";
import { applyMiddleware, createStore } from "redux";
import { createEpicMiddleware } from "redux-observable";

import { Action } from "./actions";
import { getRootEpic, SocketControllerInterface } from "./epics";
import { rootReducer } from "./reducers";
import { State } from "./state";

// `socketController` argument passed in tests, see `App.test.tsx`
export const getStore = (socketController?: SocketControllerInterface) => {
  const epicMiddleware = createEpicMiddleware<Action, Action, State>();
  const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(epicMiddleware))
  );
  epicMiddleware.run(getRootEpic(socketController));
  return store;
};
