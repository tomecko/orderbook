import cns from "classnames";
import numeral from "numeral";
import React from "react";

import { State } from "../state";
import { Level, LevelWithTotal, Side, TotalSize } from "../types";
import { formatGraphStop, formatPrice, formatSize } from "../util/format";

import styles from "./OrderList.module.scss";

interface Column {
  key: keyof LevelWithTotal;
  label: string;
  formatFn: (input: any) => string;
}

const COLUMNS: Column[] = [
  {
    key: "price",
    label: "Price",
    formatFn: formatPrice,
  },
  {
    key: "size",
    label: "Size",
    formatFn: formatSize,
  },
  {
    key: "totalSize",
    label: "Total",
    formatFn: formatSize,
  },
];

const COLUMNS_PER_SIDE: Record<
  Side,
  { columns: Column[]; sortFn: (a: Level, b: Level) => number }
> = {
  asks: { columns: COLUMNS, sortFn: (a, b) => (a.price > b.price ? 1 : -1) },
  bids: {
    columns: COLUMNS.slice().reverse(),
    sortFn: (a, b) => (a.price < b.price ? 1 : -1),
  },
};

interface MaxTotalSizeInfo {
  asks: TotalSize;
  bids: TotalSize;
  max: TotalSize;
}

interface Props {
  maxTotalSizeInfo: MaxTotalSizeInfo;
  levels: LevelWithTotal[];
  side: Side;
}

export function OrderList({ levels, maxTotalSizeInfo, side }: Props) {
  return (
    <table className={styles.ordersTable}>
      <thead>
        <tr>
          {COLUMNS_PER_SIDE[side].columns.map((column) => (
            <th key={column.key} className={styles.headingCell}>
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {levels.map((level) => (
          <Order
            key={level.price}
            level={level}
            maxTotalSizeInfo={maxTotalSizeInfo}
            side={side}
          />
        ))}
      </tbody>
    </table>
  );
}

const GRAPH_COLORS = {
  asks: "#3d1e28",
  bids: "#123534",
};

interface OrderProps {
  level: LevelWithTotal;
  maxTotalSizeInfo: MaxTotalSizeInfo;
  side: Side;
}

function Order({ level, maxTotalSizeInfo, side }: OrderProps) {
  const graphStop = formatGraphStop(level.totalSize / maxTotalSizeInfo.max);
  const graphDirection = {
    asks: "right",
    bids: "left",
  };
  return (
    <tr
      key={String(level.price)}
      className={styles.levelRow}
      style={{
        background: `linear-gradient(to ${graphDirection[side]}, ${GRAPH_COLORS[side]} ${graphStop}, transparent ${graphStop} 100%)`,
      }}
    >
      {COLUMNS_PER_SIDE[side].columns.map((column) => (
        <td
          key={column.key}
          className={cns(
            { [styles[`${side}Price`]]: column.key === "price" },
            styles.orderValue
          )}
        >
          {column.formatFn(level[column.key])}
        </td>
      ))}
    </tr>
  );
}
