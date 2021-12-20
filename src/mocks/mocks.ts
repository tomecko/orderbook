import { DeltaDTO, SnapshotDTO } from "../types";

export const mockSnapshot: SnapshotDTO = {
  asks: [
    [46686.5, 121251],
    [46690, 12162],
    [46692, 3600],
  ] as SnapshotDTO["asks"],
  bids: [
    [46671.5, 1245],
    [46671, 3000],
    [46670, 89050],
  ] as SnapshotDTO["bids"],
  feed: "book_ui_1_snapshot",
  numLevels: 3,
  product_id: "PI_XBTUSD",
};

export const mockSnapshot2: SnapshotDTO = {
  asks: [
    [10, 100],
    [11, 200],
    [12, 300],
  ] as SnapshotDTO["asks"],
  bids: [
    [9, 2000],
    [8, 1000],
    [7, 4000],
  ] as SnapshotDTO["bids"],
  feed: "book_ui_1_snapshot",
  numLevels: 3,
  product_id: "PI_ETHUSD",
};

export const mockDelta: DeltaDTO = {
  asks: [
    [46686.5, 0],
    [46692, 1000],
  ] as DeltaDTO["asks"],
  bids: [[46671.5, 0], [46670, 89051]] as DeltaDTO["bids"],
  feed: "book_ui_1",
  product_id: "PI_XBTUSD",
};
