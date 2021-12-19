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

export const mockDelta: DeltaDTO = {
  asks: [[46686.5, 121231]] as DeltaDTO["asks"],
  bids: [[46671.5, 1225]] as DeltaDTO["bids"],
  feed: "book_ui_1",
  product_id: "PI_XBTUSD",
};
