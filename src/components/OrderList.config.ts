import { LevelWithTotal, Side } from "../types";
import {
  formatPriceMemoized,
  formatSizeMemoized,
} from "../shared/format";

interface Column {
  key: keyof LevelWithTotal;
  label: string;
  formatFn: (input: any) => string;
}

const COLUMNS: Column[] = [
  {
    key: "price",
    label: "Price",
    formatFn: formatPriceMemoized,
  },
  {
    key: "size",
    label: "Size",
    formatFn: formatSizeMemoized,
  },
  {
    key: "totalSize",
    label: "Total",
    formatFn: formatSizeMemoized,
  },
];

export const COLUMNS_PER_SIDE: Record<Side, Column[]> = {
  asks: COLUMNS,
  bids: COLUMNS.slice().reverse(),
};
