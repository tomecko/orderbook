import { DeltaDTO, ProductId, SnapshotDTO } from "./../types";

interface ApplyDeltasAction {
  type: "APPLY_DELTAS";
  payload: DeltaDTO[];
}
export const applyDeltas = (deltas: DeltaDTO[]): ApplyDeltasAction => ({
  type: "APPLY_DELTAS",
  payload: deltas,
});

interface SetProductIdAction {
  type: "SET_PRODUCT_ID";
  payload: ProductId;
}
export const setProductId = (productId: ProductId): SetProductIdAction => ({
  type: "SET_PRODUCT_ID",
  payload: productId,
});

interface SetSnapshotAction {
  type: "SET_SNAPSHOT";
  payload: SnapshotDTO;
}
export const setSnapshot = (snapshot: SnapshotDTO): SetSnapshotAction => ({
  type: "SET_SNAPSHOT",
  payload: snapshot,
});

interface StartAppAction {
  type: "START_APP";
}
export const startApp = (): StartAppAction => ({
  type: "START_APP",
});

export type Action =
  | ApplyDeltasAction
  | SetProductIdAction
  | SetSnapshotAction
  | StartAppAction;
