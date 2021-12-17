import { Delta, Snapshot } from "../types";

export const mockSnapshot: Snapshot = {
  asks: [
    [46686.5, 121251],
    [46690, 12162],
    [46692, 3600],
  ] as Snapshot["asks"],
  bids: [
    [46671.5, 1245],
    [46671, 3000],
    [46670, 89050],
  ] as Snapshot["bids"],
  feed: "book_ui_1_snapshot",
  numLevels: 3,
  product_id: "PI_XBTUSD",
};

export const mockDelta: Delta = {
  asks: [[46686.5, 121231]] as Delta["asks"],
  bids: [[46671.5, 1225]] as Delta["bids"],
  feed: "book_ui_1",
  product_id: "PI_XBTUSD",
};
