import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";

import { Action, State, subscribe } from "../state";

import { ActionBar } from "./ActionBar";
import { Header } from "./Header";
import { OrderLists } from "./OrderLists";
import { ReconnectModal } from "./ReconnectModal";

const useStartApp = () => {
  const dispatch = useDispatch<Dispatch<Action>>();
  useEffect(() => {
    dispatch(subscribe());
  }, [dispatch]);
};

export function App() {
  useStartApp();
  const deactivated = useSelector<State, boolean>((store) => store.deactivated);
  return (
    <>
      <Header />
      <OrderLists />
      {!deactivated && <ActionBar />}
      {deactivated ? <ReconnectModal /> : null}
    </>
  );
}
