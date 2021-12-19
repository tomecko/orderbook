import { OneSideOrders, Orders } from "./../state";
import { DeltaDTO, Order, PriceText, Side, SnapshotDTO } from "./../types";

export const convertSnapshotDTOtoOrders = (
  snapshotDTO: SnapshotDTO
): Orders => {
  return {
    asks: getOneSideOrders(snapshotDTO.asks),
    bids: getOneSideOrders(snapshotDTO.bids),
  };
};

const getOneSideOrders = (orders: Order[]): OneSideOrders => {
  return orders.reduce((acc, [price, size]) => {
    if (size !== 0) {
      (acc as any)[String(price) as PriceText] = { price, size }; // TODO: think how to avoid "as any"
    }
    return acc;
  }, {} as OneSideOrders);
};

export const getOrdersWithDeltasApplied = (
  orders: Orders,
  deltas: DeltaDTO[]
): Orders => {
  return {
    asks: getOneSideOrdersWithDeltas(orders.asks, deltas, "asks"),
    bids: getOneSideOrdersWithDeltas(orders.bids, deltas, "bids"),
  };
};

const getOneSideOrdersWithDeltas = (
  oneSideOrders: OneSideOrders,
  deltas: DeltaDTO[],
  side: Side
): OneSideOrders => {
  return deltas
    .flatMap((val) => val[side])
    .reduce(
      (acc, [price, size]: Order) => {
        const priceText = String(price) as PriceText;
        if (size === 0) {
          delete (acc as any)[priceText]; // TODO: think how to avoid "as any"
        } else {
          (acc as any)[priceText] = { price, size }; // TODO: think how to avoid "as any"
        }
        return acc;
      },
      { ...oneSideOrders }
    );
};
