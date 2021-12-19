import { combineEpics, ofType, StateObservable } from "redux-observable";
import { animationFrames, EMPTY, Observable, of, Subject } from "rxjs";
import {
  buffer,
  catchError,
  distinctUntilChanged,
  filter,
  ignoreElements,
  map,
  mergeWith,
  switchMap,
  take,
  tap,
} from "rxjs/operators";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";

import { isDeltaDTO, isSnapshotDTO } from "../services";
import { MessageDTO } from "../types";

import {
  Action,
  applyDeltas,
  deactivateApp,
  setProductId,
  setSnapshot,
  subscribe,
} from "./actions";
import { State } from "./state";

const WEBSOCKET_URL = "wss://www.cryptofacilities.com/ws/v1";
let socket: WebSocketSubject<MessageDTO> | undefined;
let onOpenSubject = new Subject();
let onCloseSubject = new Subject();

// Inspired by https://techinscribed.com/websocket-connection-reconnection-rxjs-redux-observable/
const createSocket = (): WebSocketSubject<MessageDTO> => {
  console.log("createSocket");
  onOpenSubject = new Subject();
  onCloseSubject = new Subject();
  socket = webSocket<MessageDTO>({
    url: WEBSOCKET_URL,
    openObserver: onOpenSubject,
    closeObserver: onCloseSubject,
  });
  (window as any).s = socket;
  return socket;
};

const subscribeEpic = (
  action$: Observable<Action>,
  state$: StateObservable<State>
): Observable<Action> =>
  action$.pipe(
    ofType("SUBSCRIBE", "SET_PRODUCT_ID"),
    switchMap(() => {
      socket?.complete();
      socket = createSocket();
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
            buffer(animationFrames().pipe(filter((_, i) => i % 10 === 0))),
            filter((arr) => arr.length > 0),
            // take(10),
            tap((x) => {
              console.log(78, x[0].product_id, Math.floor(Date.now() / 1000));
            }),
            map(applyDeltas)
          )
        ),
        filter(() => document.visibilityState === "visible"), // FIXME
        mergeWith(
          socket.pipe(
            ignoreElements(),
            catchError(() => of(subscribe()))
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

const visibilityEpic = (action$: Observable<Action>): Observable<Action> =>
  action$.pipe(
    ofType("SUBSCRIBE"),
    take(1),
    switchMap(() => {
      const visibilitySubject = new Subject<boolean>();
      document.addEventListener(
        "visibilitychange",
        () => {
          visibilitySubject.next(document.visibilityState === "visible");
        },
        false
      );
      return visibilitySubject;
    }),
    distinctUntilChanged(),
    tap((visibility) => {
      if (!visibility) {
        console.log("complete");
        socket?.complete();
      }
    }),
    switchMap((visibility) => (visibility ? EMPTY : of(deactivateApp())))
  );

export const rootEpic = combineEpics(
  subscribeEpic,
  toggleProductIdEpic,
  visibilityEpic
);
