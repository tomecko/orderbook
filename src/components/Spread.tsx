import cns from "classnames";
import React from "react";

import { Price } from "../types";
import {
  formatPriceMemoized,
  formatSpreadPercentageMemoized,
} from "../shared/format";

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
  const percentage = formatSpreadPercentageMemoized(
    spreadInfo.absolute / spreadInfo.firstAskPrice
  );
  return (
    <p className={cns(className, styles.spread)} data-testid="spread">
      Spread:
      <span className={styles.figures}>
        {formatPriceMemoized(spreadInfo.absolute)} ({percentage})
      </span>
    </p>
  );
}
