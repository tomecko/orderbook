import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";

import { Action, startApp } from "../state";

import { ActionBar } from "./ActionBar";
import { Header } from "./Header";
import { OrderLists } from "./OrderLists";

import "./App.css";

const useStartApp = () => {
  const dispatch = useDispatch<Dispatch<Action>>();
  useEffect(() => {
    dispatch(startApp());
  }, [dispatch]);
};

export function App() {
  useStartApp();
  return (
    <>
      <Header />
      <OrderLists />
      <ActionBar />
    </>
  );
}
