import { Brand } from "../util";

export type Price = Brand<number, "price">;
export type Size = Brand<number, "size">;
type ProductId = "PI_XBTUSD"; // TODO: add more

export type Order = [Price, Size];

export interface Delta {
  asks: Order[];
  bids: Order[];
  feed: "book_ui_1";
  product_id: ProductId;
}

export interface Snapshot {
  asks: Order[];
  bids: Order[];
  feed: "book_ui_1_snapshot";
  numLevels: number;
  product_id: ProductId;
}
