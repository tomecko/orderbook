import { combineEpics, ofType } from "redux-observable";
import { animationFrames, Observable } from "rxjs";
import {
  buffer,
  distinctUntilChanged,
  filter,
  ignoreElements,
  map,
  mergeWith,
  switchMap,
  takeUntil,
  tap,
} from "rxjs/operators";
import { webSocket } from "rxjs/webSocket";

import { DeltaDTO, MessageDTO, SnapshotDTO } from "../types";

import { Action, applyDeltas, setSnapshot } from "./actions";

const WEBSOCKET_URL = "wss://www.cryptofacilities.com/ws/v1";

const isSnapshotDTO = (message: MessageDTO): message is SnapshotDTO =>
  message.feed === "book_ui_1_snapshot";

const isDeltaDTO = (message: MessageDTO): message is DeltaDTO =>
  message.feed === "book_ui_1" &&
  Array.isArray((message as any).asks) &&
  Array.isArray((message as any).bids);

const subscribeEpic = (action$: Observable<Action>) =>
  action$.pipe(
    ofType("START_APP", "SET_PRODUCT_ID"),
    takeUntil(action$.pipe(ofType("SET_PRODUCT_ID"), distinctUntilChanged())),
    switchMap(() => {
      const socket = webSocket<MessageDTO>(WEBSOCKET_URL);
      socket.next({
        event: "subscribe",
        feed: "book_ui_1",
        product_ids: ["PI_XBTUSD"],
      });
      return socket.pipe(
        filter(isSnapshotDTO),
        map(setSnapshot),
        mergeWith(
          socket.pipe(
            filter(isDeltaDTO),
            buffer(animationFrames().pipe(filter((_, i) => i % 10 === 0))),
            filter((arr) => arr.length > 0),
            tap((x) => {
              console.log(Math.floor(Date.now() / 1000));
            }),
            map(applyDeltas)
          )
        )
      );
    })
  );

export const rootEpic = combineEpics(subscribeEpic);
