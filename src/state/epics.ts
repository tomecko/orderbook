import { combineEpics, ofType, StateObservable } from "redux-observable";
import { animationFrames, EMPTY, Observable, of, Subject } from "rxjs";
import {
  buffer,
  catchError,
  delay,
  distinctUntilChanged,
  filter,
  ignoreElements,
  map,
  mergeMap,
  mergeWith,
  switchMap,
  take,
  takeUntil,
  tap,
} from "rxjs/operators";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";

import { WEBSOCKET_URL } from "../config";
import { isDeltaDTO, isSnapshotDTO } from "../services";
import { MessageDTO } from "../types";

import {
  Action,
  applyDeltas,
  deactivateApp,
  setProductId,
  setSnapshot,
  subscribe,
  unsubscribe,
} from "./actions";
import { State } from "./state";

let socket: WebSocketSubject<MessageDTO> | undefined;
let onCloseSubject = new Subject();

const createSocket = (): WebSocketSubject<MessageDTO> => {
  onCloseSubject = new Subject();
  socket = webSocket<MessageDTO>({
    url: WEBSOCKET_URL,
    closeObserver: onCloseSubject,
  });
  return socket;
};

const ANIMATION_FRAMES_INTERVAL = 10;
const ERROR_RESUBSCRIBING_DELAY = 1000;
const subscribeEpic = (
  action$: Observable<Action>,
  state$: StateObservable<State>
): Observable<Action> =>
  action$.pipe(
    ofType("SUBSCRIBE"),
    switchMap(() => {
      socket?.complete();
      socket = createSocket();
      socket.next({
        event: "subscribe",
        feed: "book_ui_1",
        product_ids: [state$.value.productId],
      });
      return socket.pipe(
        // Snapshot
        filter(isSnapshotDTO),
        map(setSnapshot),
        // Delta
        mergeWith(
          socket.pipe(
            filter(isDeltaDTO),
            buffer(
              animationFrames().pipe(
                filter((_, i) => i % ANIMATION_FRAMES_INTERVAL === 0)
              )
            ),
            filter((arr) => arr.length > 0),
            map(applyDeltas),
            takeUntil(action$.pipe(ofType("UNSUBSCRIBE")))
          )
        ),
        filter(() => !state$.value.deactivated),
        // resubscribing on error
        mergeWith(
          socket.pipe(
            ignoreElements(),
            catchError(() => of(subscribe())),
            delay(ERROR_RESUBSCRIBING_DELAY) // let's delay to avoid nasty error->resubscribing loop
          )
        )
      );
    })
  );

const unsubscribeEpic = (
  action$: Observable<Action>,
  state$: StateObservable<State>
): Observable<Action> =>
  action$.pipe(
    ofType("UNSUBSCRIBE"),
    tap(() => {
      socket?.next({
        event: "unsubscribe",
        feed: "book_ui_1",
        product_ids: [state$.value.productId],
      });

      // FIXME
      setTimeout(() => {
        socket?.complete();
      }, 100);
    }),
    ignoreElements()
  );

const toggleProductIdEpic = (
  action$: Observable<Action>,
  state$: StateObservable<State>
): Observable<Action> =>
  action$.pipe(
    ofType("TOGGLE_PRODUCT_ID"),
    mergeMap(() =>
      of(
        unsubscribe(),
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
      ).pipe(mergeWith(onCloseSubject.pipe(map(() => subscribe()))))
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
    switchMap((visibility) =>
      visibility ? EMPTY : of(unsubscribe(), deactivateApp())
    )
  );

export const rootEpic = combineEpics(
  subscribeEpic,
  toggleProductIdEpic,
  unsubscribeEpic,
  visibilityEpic
);
