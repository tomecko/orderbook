import cns from "classnames";
import React from "react";

import { Price } from "../types";
import { formatPrice, formatSpreadPercentage } from "../shared/format";

import styles from "./Spread.module.scss";

export interface SpreadInfo {
  absolute: Price;
  firstAskPrice: Price;
}

interface Props {
  className: string;
  spreadInfo: SpreadInfo | null;
}

export function Spread({ className, spreadInfo }: Props) {
  if (spreadInfo === null) {
    return null;
  }
  return (
    <p className={cns(className, styles.spread)}>
      Spread:
      <span className={styles.figures}>
        {formatPrice(spreadInfo.absolute)} (
        {formatSpreadPercentage(spreadInfo.absolute / spreadInfo.firstAskPrice)}
        )
      </span>
    </p>
  );
}
