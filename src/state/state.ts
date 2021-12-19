import { Level, PriceText, ProductId } from "./../types";

export type OneSideOrders = Record<PriceText, Level>;

export interface Orders {
  asks: OneSideOrders;
  bids: OneSideOrders;
}

export interface State {
  orders: Orders;
  productId: ProductId;
}

export const INITIAL_STATE: State = {
  orders: {
    asks: {},
    bids: {},
  },
  productId: "PI_XBTUSD",
};
