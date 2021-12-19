import React from "react";
import { useSelector } from "react-redux";

import { State } from "../state";
import { Level, TotalSize } from "../types";

interface Props {
  side: keyof State["orders"];
}

export function OrderList({ side }: Props) {
  const levels = useSelector<State, Level[]>(
    (store) =>
      Object.values<Level>(store.orders[side])
        .sort((a, b) => (a.price > b.price ? 1 : -1))
        .reduce(
          (acc, curr) => {
            const totalSize = (acc.totalSize +
              (curr.size as number)) as TotalSize;
            acc.totalSize = totalSize;
            acc.arr.push({ ...curr, totalSize });
            return acc;
          },
          { arr: [] as Level[], totalSize: 0 as TotalSize }
        ).arr
  );
  return (
    <table>
      <thead>
        <tr>
          <th>total</th>
          <th>size</th>
          <th>price</th>
        </tr>
      </thead>
      <tbody>
        {levels.slice(0, 18).map((level) => (
          <Order key={level.price} level={level} />
        ))}
      </tbody>
    </table>
  );
}

function Order({ level }: { level: Level }) {
  return (
    <tr key={String(level.price)}>
      <td>{level.price}</td>
      <td>{level.size}</td>
      <td>{level.totalSize}</td>
    </tr>
  );
}
