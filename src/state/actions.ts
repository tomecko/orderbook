import { DeltaDTO, ProductId, SnapshotDTO } from "./../types";

interface ApplyDeltasAction {
  type: "APPLY_DELTAS";
  payload: DeltaDTO[];
}
export const applyDeltas = (deltas: DeltaDTO[]): ApplyDeltasAction => ({
  type: "APPLY_DELTAS",
  payload: deltas,
});

interface DeactivateAppAction {
  type: "DEACTIVATE_APP";
}
export const deactivateApp = (): DeactivateAppAction => ({
  type: "DEACTIVATE_APP",
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

interface UnsubscribeAction {
  type: "UNSUBSCRIBE";
}
export const unsubscribe = (): UnsubscribeAction => ({
  type: "UNSUBSCRIBE",
});


export type Action =
  | ApplyDeltasAction
  | DeactivateAppAction
  | SetProductIdAction
  | SetSnapshotAction
  | SubscribeAction
  | ToogleProductIdAction
  | UnsubscribeAction;
