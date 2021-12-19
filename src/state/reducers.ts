import { Reducer } from "redux";

import {
  convertSnapshotDTOtoOrders,
  getOrdersWithDeltasApplied,
} from "../services";

import { Action } from "./actions";
import { INITIAL_STATE, State } from "./state";

// `endReducer` allows exhaustive type check in `rootReducer`'s switch statement.
// See https://birukov.me/blog/all/exhaustive-type-checks.html
const endReducer = <T>(state: T, _action: never): T => {
  return state;
};

export const rootReducer: Reducer<State, Action> = (
  state = INITIAL_STATE,
  action
): State => {
  switch (action.type) {
    case "APPLY_DELTAS":
      return {
        ...state,
        orders: getOrdersWithDeltasApplied(state.orders, action.payload),
      };
    case "SET_SNAPSHOT":
      return {
        ...state,
        orders: convertSnapshotDTOtoOrders(action.payload),
      };
    case "SET_PRODUCT_ID": {
      if (state.productId === action.payload) {
        return state;
      }
      return {
        ...state,
        productId: action.payload,
      };
    }
    case "SUBSCRIBE":
    case "TOGGLE_PRODUCT_ID":
      return state;
    default:
      return endReducer(state, action);
  }
};
