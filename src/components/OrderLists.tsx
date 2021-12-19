import cns from "classnames";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";

import { selectLevels, State } from "../state";
import { LevelWithTotal, Price, TotalSize } from "../types";

import { OrderList } from "./OrderList";
import { Spread, SpreadInfo } from "./Spread";

import styles from "./OrderLists.module.scss";

export function OrderLists() {
  const asksLevels = useSelector<State, LevelWithTotal[]>(selectLevels("asks"));
  const bidsLevels = useSelector<State, LevelWithTotal[]>(selectLevels("bids"));
  const maxTotalSizeInfo = useMemo(() => {
    const asksMaxTotalSize = asksLevels[asksLevels.length - 1]?.totalSize;
    const bidsMaxTotalSize = bidsLevels[bidsLevels.length - 1]?.totalSize;
    const max = Math.max(asksMaxTotalSize, bidsMaxTotalSize) as TotalSize;
    return {
      asks: asksMaxTotalSize,
      bids: bidsMaxTotalSize,
      max,
    };
  }, [asksLevels, bidsLevels]);
  const spreadInfo: SpreadInfo | null = useMemo(() => {
    const firstBidPrice = bidsLevels[0]?.price;
    const firstAskPrice = asksLevels[0]?.price;
    return firstBidPrice && firstAskPrice
      ? {
          absolute: (firstAskPrice - firstBidPrice) as Price,
          firstAskPrice,
        }
      : null;
  }, [asksLevels, bidsLevels]);
  return (
    <main className={styles.wrapper}>
      <Spread className={styles.spread} spreadInfo={spreadInfo} />
      <OrderList
        className={cns(styles.orderList, styles.bidsList)}
        maxTotalSizeInfo={maxTotalSizeInfo}
        levels={bidsLevels}
        side="bids"
      />
      <OrderList
        className={cns(styles.orderList, styles.asksList)}
        maxTotalSizeInfo={maxTotalSizeInfo}
        levels={asksLevels}
        side="asks"
      />
    </main>
  );
}
