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

export interface SocketControllerInterface {
  socket: Subject<MessageDTO> | undefined;
  onCloseSubject: Subject<any>;
  createSocket: () => Subject<MessageDTO>;
}

class SocketController {
  socket: WebSocketSubject<MessageDTO> | undefined;
  onCloseSubject = new Subject<any>();

  constructor() {
    this.createSocket.bind(this);
  }

  createSocket() {
    this.onCloseSubject = new Subject();
    this.socket = webSocket<MessageDTO>({
      url: WEBSOCKET_URL,
      closeObserver: this.onCloseSubject,
    });
    return this.socket;
  }
}

const ANIMATION_FRAMES_INTERVAL = 10;
const ERROR_RESUBSCRIBING_DELAY = 1000;
const subscribeEpic =
  (socketController: SocketControllerInterface) =>
  (
    action$: Observable<Action>,
    state$: StateObservable<State>
  ): Observable<Action> =>
    action$.pipe(
      ofType("SUBSCRIBE"),
      switchMap(() => {
        socketController.socket?.complete();
        const socket = socketController.createSocket();
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

const unsubscribeEpic =
  (socketController: SocketControllerInterface) =>
  (
    action$: Observable<Action>,
    state$: StateObservable<State>
  ): Observable<Action> =>
    action$.pipe(
      ofType("UNSUBSCRIBE"),
      tap(() => {
        socketController.socket?.next({
          event: "unsubscribe",
          feed: "book_ui_1",
          product_ids: [state$.value.productId],
        });

        // FIXME: make sure "unsubscribe" message is sent in a reliable way
        setTimeout(() => {
          socketController.socket?.complete();
        }, 100);
      }),
      ignoreElements()
    );

const toggleProductIdEpic =
  (socketController: SocketControllerInterface) =>
  (
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
        ).pipe(
          mergeWith(
            socketController.onCloseSubject.pipe(map(() => subscribe()))
          )
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
    switchMap((visibility) =>
      visibility ? EMPTY : of(unsubscribe(), deactivateApp())
    )
  );

export const getRootEpic = (
  socketController: SocketControllerInterface = new SocketController()
) =>
  combineEpics(
    subscribeEpic(socketController),
    toggleProductIdEpic(socketController),
    unsubscribeEpic(socketController),
    visibilityEpic
  );
