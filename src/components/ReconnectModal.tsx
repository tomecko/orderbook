import React from "react";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";

import { Button, Modal } from "../shared/components";
import { Action, subscribe } from "../state";

export function ReconnectModal() {
  const dispatch = useDispatch<Dispatch<Action>>();
  return (
    <Modal>
      <div>
        <p>Disconnected!</p>
        <Button
          onClick={() => {
            dispatch(subscribe());
          }}
        >
          reconnect
        </Button>
      </div>
    </Modal>
  );
}
