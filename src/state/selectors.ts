import { State } from "../state";

import { Level, LevelWithTotal, Side, TotalSize } from "../types";

const SORT_FN_PER_SIDE: Record<Side, (a: Level, b: Level) => number> = {
  asks: (a, b) => (a.price > b.price ? 1 : -1),
  bids: (a, b) => (a.price < b.price ? 1 : -1),
};

export const selectLevels =
  (side: Side) =>
  (store: State): LevelWithTotal[] =>
    Object.values<Level>(store.orders[side])
      .sort(SORT_FN_PER_SIDE[side])
      .slice(0, 15)
      .reduce(
        (acc, curr) => {
          const totalSize = (acc.totalSize +
            (curr.size as number)) as TotalSize;
          acc.totalSize = totalSize;
          acc.arr.push({ ...curr, totalSize });
          return acc;
        },
        { arr: [] as LevelWithTotal[], totalSize: 0 as TotalSize }
      ).arr;
