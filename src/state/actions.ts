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

interface SubscribeAction {
  type: "SUBSCRIBE";
}
export const subscribe = (): SubscribeAction => ({
  type: "SUBSCRIBE",
});

interface ToogleProductIdAction {
  type: "TOGGLE_PRODUCT_ID";
}
export const toggleProductId = (): ToogleProductIdAction => ({
  type: "TOGGLE_PRODUCT_ID",
});

export type Action =
  | ApplyDeltasAction
  | SetProductIdAction
  | SetSnapshotAction
  | SubscribeAction
  | ToogleProductIdAction;
