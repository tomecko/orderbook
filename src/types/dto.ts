import { Price, ProductId, Size } from "./common";

export type Order = [Price, Size];

export interface DeltaDTO {
  asks: Order[];
  bids: Order[];
  feed: "book_ui_1";
  product_id: ProductId;
}

export interface SnapshotDTO {
  asks: Order[];
  bids: Order[];
  feed: "book_ui_1_snapshot";
  numLevels: number;
  product_id: ProductId;
}

// export interface SubscribedEventDTO {
//   event: "subscribed";
//   feed: "book_ui_1";
//   product_ids: ProductId[];
// }

export interface ClientSubscribeMessageDTO {
  event: "subscribe";
  feed: "book_ui_1";
  product_ids: ProductId[];
}

export type MessageDTO = ClientSubscribeMessageDTO | DeltaDTO | SnapshotDTO;
