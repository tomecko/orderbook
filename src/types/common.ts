import { Brand } from "../util/types";

export type Price = Brand<number, "price">;
export type PriceText = Brand<string, "priceText">;
export type Size = Brand<number, "size">;
export type TotalSize = Brand<number, "totalSize">;
export type ProductId = "PI_XBTUSD" | "PI_ETHUSD";
export type Side = 'asks' | 'bids';

export interface Level {
  price: Price;
  size: Size;
}

export interface LevelWithTotal extends Level {
  totalSize: TotalSize;
}
