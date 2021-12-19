import React from "react";
import { useDispatch } from "react-redux";

import { Button } from "../shared/components";
import { toggleProductId } from "../state";

import styles from "./ActionBar.module.scss";

interface Props {}

export function ActionBar({}: Props) {
  const dispatch = useDispatch();
  return (
    <footer className={styles.actionBar}>
      <Button
        onClick={() => {
          dispatch(toggleProductId());
        }}
      >
        Toggle Feed
      </Button>
    </footer>
  );
}
