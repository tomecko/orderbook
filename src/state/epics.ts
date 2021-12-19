import { combineEpics, ofType, StateObservable } from "redux-observable";
import { animationFrames, Observable } from "rxjs";
import { buffer, filter, map, mergeWith, switchMap, tap } from "rxjs/operators";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";

import { DeltaDTO, MessageDTO, SnapshotDTO } from "../types";

import { Action, applyDeltas, setProductId, setSnapshot } from "./actions";
import { State } from "./state";

const WEBSOCKET_URL = "wss://www.cryptofacilities.com/ws/v1";
let socket: WebSocketSubject<MessageDTO> | undefined;

const isSnapshotDTO = (message: MessageDTO): message is SnapshotDTO =>
  message.feed === "book_ui_1_snapshot";

const isDeltaDTO = (message: MessageDTO): message is DeltaDTO =>
  message.feed === "book_ui_1" &&
  Array.isArray((message as any).asks) &&
  Array.isArray((message as any).bids);

const subscribeEpic = (
  action$: Observable<Action>,
  state$: StateObservable<State>
): Observable<Action> =>
  action$.pipe(
    ofType("SUBSCRIBE", "SET_PRODUCT_ID"),
    switchMap(() => {
      socket?.complete();
      socket = webSocket<MessageDTO>(WEBSOCKET_URL);
      socket.next({
        event: "subscribe",
        feed: "book_ui_1",
        product_ids: [state$.value.productId],
      });
      return socket.pipe(
        filter(isSnapshotDTO),
        map(setSnapshot),
        mergeWith(
          socket.pipe(
            filter(isDeltaDTO),
            buffer(animationFrames().pipe(filter((_, i) => i % 60 === 0))),
            filter((arr) => arr.length > 0),
            // take(10),
            tap((x) => {
              console.log(x[0].product_id, Math.floor(Date.now() / 1000));
            }),
            map(applyDeltas)
          )
        )
      );
    })
  );

const toggleProductIdEpic = (
  action$: Observable<Action>,
  state$: StateObservable<State>
): Observable<Action> =>
  action$.pipe(
    ofType("TOGGLE_PRODUCT_ID"),
    map(() =>
      setProductId(
        (() => {
          return (
            {
              PI_ETHUSD: "PI_XBTUSD",
              PI_XBTUSD: "PI_ETHUSD",
            } as any
          )[state$.value.productId];
        })()
      )
    )
  );

export const rootEpic = combineEpics(subscribeEpic, toggleProductIdEpic);
