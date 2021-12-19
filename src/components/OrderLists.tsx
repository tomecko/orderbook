import React from "react";
import { useSelector } from "react-redux";

import { selectLevels, State } from "../state";
import { LevelWithTotal, TotalSize } from "../types";

import { OrderList } from "./OrderList";

import styles from "./OrderLists.module.scss";

export function OrderLists() {
  const asksLevels = useSelector<State, LevelWithTotal[]>(selectLevels("asks"));
  const bidsLevels = useSelector<State, LevelWithTotal[]>(selectLevels("bids"));
  const maxTotalSizeInfo = (() => {
    const asksMaxTotalSize = asksLevels[asksLevels.length - 1]?.totalSize;
    const bidsMaxTotalSize = bidsLevels[bidsLevels.length - 1]?.totalSize;
    const max = Math.max(asksMaxTotalSize, bidsMaxTotalSize) as TotalSize;
    return {
      asks: asksMaxTotalSize,
      bids: bidsMaxTotalSize,
      max,
    };
  })();
  return (
    <main className={styles.wrapper}>
      <OrderList
        maxTotalSizeInfo={maxTotalSizeInfo}
        levels={bidsLevels}
        side="bids"
      />
      <OrderList
        maxTotalSizeInfo={maxTotalSizeInfo}
        levels={asksLevels}
        side="asks"
      />
    </main>
  );
}
