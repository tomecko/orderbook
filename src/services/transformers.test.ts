import { OneSideOrders, Orders } from "./../state";
import { DeltaDTO, Order, SnapshotDTO } from "./../types";

import {
  convertSnapshotDTOtoOrders,
  getOrdersWithDeltasApplied,
} from "./transformers";

describe("transformers", () => {
  describe("convertSnapshotDTOtoOrders", () => {
    it("should correctly transform data", () => {
      const snapshot: SnapshotDTO = {
        asks: [
          [200, 1000],
          [210, 2000],
          [220, 3000],
        ] as Order[],
        bids: [
          [190, 5000],
          [180, 1000],
          [170, 300],
        ] as Order[],
        feed: "book_ui_1_snapshot",
        numLevels: 10,
        product_id: "PI_XBTUSD",
      };
      const expected: Orders = {
        asks: {
          200: { price: 200, size: 1000 },
          210: { price: 210, size: 2000 },
          220: { price: 220, size: 3000 },
        } as OneSideOrders,
        bids: {
          190: { price: 190, size: 5000 },
          180: { price: 180, size: 1000 },
          170: { price: 170, size: 300 },
        } as OneSideOrders,
      };
      expect(convertSnapshotDTOtoOrders(snapshot)).toStrictEqual(expected);
    });
  });

  describe("getOrdersWithDeltasApplied", () => {
    it("should return correct value if deltas are empty", () => {
      const orders: Orders = {
        asks: {
          200: { price: 200, size: 1000 },
          210: { price: 210, size: 2000 },
          220: { price: 220, size: 3000 },
        } as OneSideOrders,
        bids: {
          190: { price: 190, size: 5000 },
          180: { price: 180, size: 1000 },
          170: { price: 170, size: 300 },
        } as OneSideOrders,
      };
      const deltas: DeltaDTO[] = [
        {
          asks: [],
          bids: [],
          feed: "book_ui_1",
          product_id: "PI_XBTUSD",
        },
      ];
      const expected: Orders = {
        asks: {
          200: { price: 200, size: 1000 },
          210: { price: 210, size: 2000 },
          220: { price: 220, size: 3000 },
        } as OneSideOrders,
        bids: {
          190: { price: 190, size: 5000 },
          180: { price: 180, size: 1000 },
          170: { price: 170, size: 300 },
        } as OneSideOrders,
      };
      expect(getOrdersWithDeltasApplied(orders, deltas)).toStrictEqual(
        expected
      );
    });

    it("should correctly apply deltas", () => {
      const orders: Orders = {
        asks: {
          200: { price: 200, size: 1000 },
          210: { price: 210, size: 2000 },
          220: { price: 220, size: 3000 },
        } as OneSideOrders,
        bids: {
          190: { price: 190, size: 5000 },
          180: { price: 180, size: 1000 },
          170: { price: 170, size: 300 },
        } as OneSideOrders,
      };
      const deltas: DeltaDTO[] = [
        {
          asks: [
            [210, 0],
            [230, 2000],
          ] as Order[],
          bids: [[180, 0]] as Order[],
          feed: "book_ui_1",
          product_id: "PI_XBTUSD",
        },
        {
          asks: [[240, 4000]] as Order[],
          bids: [[180, 5000]] as Order[],
          feed: "book_ui_1",
          product_id: "PI_XBTUSD",
        },
      ];
      const expected: Orders = {
        asks: {
          200: { price: 200, size: 1000 },
          220: { price: 220, size: 3000 },
          230: { price: 230, size: 2000 },
          240: { price: 240, size: 4000 },
        } as OneSideOrders,
        bids: {
          190: { price: 190, size: 5000 },
          180: { price: 180, size: 5000 },
          170: { price: 170, size: 300 },
        } as OneSideOrders,
      };
      expect(getOrdersWithDeltasApplied(orders, deltas)).toStrictEqual(
        expected
      );
    });
  });
});
