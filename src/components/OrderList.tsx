import cns from "classnames";
import React, { useMemo } from "react";

import { LevelWithTotal, Side, TotalSize } from "../types";
import { formatGraphStopMemoized } from "../shared/format";
import { COLUMNS_PER_SIDE } from "./OrderList.config";

import styles from "./OrderList.module.scss";

interface MaxTotalSizeInfo {
  asks: TotalSize;
  bids: TotalSize;
  max: TotalSize;
}

interface Props {
  className: string;
  levels: LevelWithTotal[];
  maxTotalSizeInfo: MaxTotalSizeInfo;
  side: Side;
}

export function OrderList(props: Props) {
  const { className, levels, maxTotalSizeInfo, side } = props;
  return (
    <ul className={cns(className, styles.orderList, styles[`${side}List`])}>
      <li key="header" className={cns(styles.row, styles.headerRow)}>
        {COLUMNS_PER_SIDE[side].map((column) => (
          <div
            key={column.key}
            className={cns(styles.cell, styles.headingCell)}
          >
            {column.label}
          </div>
        ))}
      </li>
      {levels.map((level) => (
        <Order
          key={level.price}
          level={level}
          maxTotalSizeInfo={maxTotalSizeInfo}
          side={side}
        />
      ))}
    </ul>
  );
}

interface OrderProps {
  level: LevelWithTotal;
  maxTotalSizeInfo: MaxTotalSizeInfo;
  side: Side;
}

function Order({ level, maxTotalSizeInfo, side }: OrderProps) {
  const rowStyle = useMemo(() => {
    const graphStop = formatGraphStopMemoized(
      level.totalSize / maxTotalSizeInfo.max
    );
    return {
      "--stop": graphStop,
    } as React.CSSProperties;
  }, [level.totalSize, maxTotalSizeInfo.max]);

  return (
    <li
      className={cns(styles.row, styles.valueRow, styles[`${side}Row`])}
      style={rowStyle}
    >
      {COLUMNS_PER_SIDE[side].map((column) => (
        <div
          key={column.key}
          className={cns(
            styles.cell,
            { [styles[`${side}Price`]]: column.key === "price" },
            styles.orderValue
          )}
        >
          {column.formatFn(level[column.key])}
        </div>
      ))}
    </li>
  );
}
