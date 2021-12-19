import memoizee from "memoizee";
import numeral from "numeral";

import { Price, Size, TotalSize } from "../types";

const CACHE_SIZE = 100;

const formatGraphStop = (ratio: number): string => {
  return numeral(ratio).format("0.00%");
};
export const formatGraphStopMemoized = memoizee(formatGraphStop, {
  max: CACHE_SIZE,
});

const formatPrice = (price: Price): string => {
  return numeral(price).format("0,0.00");
};
export const formatPriceMemoized = memoizee(formatPrice, { max: CACHE_SIZE });

const formatSize = (size: Size | TotalSize): string => {
  return numeral(size).format("0,0");
};
export const formatSizeMemoized = memoizee(formatSize, { max: CACHE_SIZE });

const formatSpreadPercentage = (ratio: number): string => {
  return numeral(ratio).format("0.00%");
};
export const formatSpreadPercentageMemoized = memoizee(formatSpreadPercentage, {
  max: CACHE_SIZE,
});
