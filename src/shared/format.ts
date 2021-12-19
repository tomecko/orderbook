import numeral from "numeral";

import { Price, Size, TotalSize } from "../types";

export const formatGraphStop = (ratio: number): string => {
  return numeral(ratio).format("0.00%");
};

export const formatPrice = (price: Price): string => {
  return numeral(price).format("0,0.00");
};

export const formatSize = (size: Size | TotalSize): string => {
  return numeral(size).format("0,0");
};

export const formatSpreadPercentage = (ratio: number): string => {
  return numeral(ratio).format("0.00%");
};
