import React from "react";

import { OrderList } from "./OrderList";

export function OrderLists() {

  return (
    <main>
      OrderLists
      <OrderList side="asks" />
      <OrderList side="bids" />
    </main>
  );
}
