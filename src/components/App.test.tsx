import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { interval as mockInterval, Subject } from "rxjs";
import { tap } from "rxjs/operators";

import { mockDelta, mockSnapshot, mockSnapshot2 } from "../mocks";
import { getStore, SocketControllerInterface } from "../state";
import { MessageDTO, ProductId } from "../types";

import { App } from "./App";

jest.mock("rxjs", () => ({
  ...jest.requireActual("rxjs"),
  animationFrames: () => mockInterval(5),
}));

class MockSocketController {
  socket: Subject<MessageDTO> | undefined;
  onCloseSubject = new Subject<any>();

  constructor(
    private onTap: (
      socket: Subject<MessageDTO> | undefined,
      productId: ProductId[]
    ) => void
  ) {
    this.createSocket.bind(this);
  }

  createSocket() {
    this.onCloseSubject = new Subject();
    this.socket = new Subject();
    this.socket
      .pipe(
        tap((message) => {
          if ((message as any).event === "subscribe") {
            // FIXME: get rid of setTimeout
            setTimeout(() => {
              this.onTap(this.socket, (message as any).product_ids);
            }, 10);
          }
        })
      )
      .subscribe({
        complete: () => {
          this.onCloseSubject.next(undefined);
        },
      });
    return this.socket;
  }
}

test("should correctly display snapshot data", async () => {
  // Given
  const mockFn = jest.fn((socket: Subject<MessageDTO> | undefined) => {
    // When
    socket?.next(mockSnapshot);
  });
  const mockSocketController: SocketControllerInterface =
    new MockSocketController(mockFn);
  render(
    <Provider store={getStore(mockSocketController)}>
      <App />
    </Provider>
  );
  await waitFor(() => expect(mockFn).toHaveBeenCalledTimes(1));

  // Then
  await waitFor(() => {
    [
      { id: "spread", expected: "Spread:15.00 (0.03%)" },
      {
        id: "bidsOrder-46671.5-totalSize",
        expected: "1,245",
      },
      {
        id: "bidsOrder-46671.5-size",
        expected: "1,245",
      },
      {
        id: "bidsOrder-46671.5-price",
        expected: "46,671.50",
      },
      {
        id: "bidsOrder-46671-totalSize",
        expected: "4,245",
      },
      {
        id: "bidsOrder-46671-size",
        expected: "3,000",
      },
      {
        id: "bidsOrder-46671-price",
        expected: "46,671.00",
      },
      {
        id: "asksOrder-46692-totalSize",
        expected: "137,013",
      },
      {
        id: "asksOrder-46692-size",
        expected: "3,600",
      },
      {
        id: "asksOrder-46692-price",
        expected: "46,692.00",
      },
    ].forEach(({ id, expected }) => {
      expect(screen.getByTestId(id).textContent).toEqual(expected);
    });
  });
});

test("should correctly apply delta", async () => {
  // Given
  const doneFn = jest.fn();
  const mockSocketController: SocketControllerInterface =
    new MockSocketController((socket: Subject<MessageDTO> | undefined) => {
      // When
      socket?.next(mockSnapshot);
      socket?.next(mockDelta);
      doneFn();
    });
  render(
    <Provider store={getStore(mockSocketController)}>
      <App />
    </Provider>
  );
  await waitFor(() => expect(doneFn).toHaveBeenCalledTimes(1));

  // Then
  await waitFor(() => {
    [
      { id: "spread", expected: "Spread:19.00 (0.04%)" },
      {
        id: "bidsOrder-46671-totalSize",
        expected: "3,000",
      },
      {
        id: "bidsOrder-46671-size",
        expected: "3,000",
      },
      {
        id: "bidsOrder-46671-price",
        expected: "46,671.00",
      },
      {
        id: "bidsOrder-46670-totalSize",
        expected: "92,051",
      },
      {
        id: "bidsOrder-46670-size",
        expected: "89,051",
      },
      {
        id: "bidsOrder-46670-price",
        expected: "46,670.00",
      },
      {
        id: "asksOrder-46690-totalSize",
        expected: "12,162",
      },
      {
        id: "asksOrder-46690-size",
        expected: "12,162",
      },
      {
        id: "asksOrder-46690-price",
        expected: "46,690.00",
      },
    ].forEach(({ id, expected }) => {
      expect(screen.getByTestId(id).textContent).toEqual(expected);
    });
  });
});

test("should allow changing product", async () => {
  // Given
  const doneFn = jest.fn();
  const mockSocketController: SocketControllerInterface =
    new MockSocketController(
      (socket: Subject<MessageDTO> | undefined, productIds: ProductId[]) => {
        // When
        if (productIds.includes("PI_XBTUSD")) {
          socket?.next(mockSnapshot);
        }
        if (productIds.includes("PI_ETHUSD")) {
          socket?.next(mockSnapshot2);
          doneFn();
        }
      }
    );
  render(
    <Provider store={getStore(mockSocketController)}>
      <App />
    </Provider>
  );

  // When
  fireEvent.click(screen.getByText("Toggle Feed"));
  await waitFor(() => expect(doneFn).toHaveBeenCalledTimes(1));

  // Then
  await waitFor(() => {
    [
      { id: "spread", expected: "Spread:1.00 (10.00%)" },
      {
        id: "bidsOrder-9-totalSize",
        expected: "2,000",
      },
      {
        id: "bidsOrder-9-size",
        expected: "2,000",
      },
      {
        id: "bidsOrder-9-price",
        expected: "9.00",
      },
      {
        id: "bidsOrder-8-totalSize",
        expected: "3,000",
      },
      {
        id: "bidsOrder-8-size",
        expected: "1,000",
      },
      {
        id: "bidsOrder-8-price",
        expected: "8.00",
      },
      {
        id: "asksOrder-10-totalSize",
        expected: "100",
      },
      {
        id: "asksOrder-10-size",
        expected: "100",
      },
      {
        id: "asksOrder-10-price",
        expected: "10.00",
      },
    ].forEach(({ id, expected }) => {
      expect(screen.getByTestId(id).textContent).toEqual(expected);
    });
  });
});
