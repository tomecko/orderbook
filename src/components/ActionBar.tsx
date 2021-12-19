import React from "react";
import { useDispatch } from "react-redux";
import { toggleProductId } from "../state";

import styles from "./ActionBar.module.scss";

interface Props {}

export function ActionBar({}: Props) {
  const dispatch = useDispatch();
  return (
    <footer className={styles.actionBar}>
      <button
        onClick={() => {
          dispatch(toggleProductId());
        }}
      >
        Toggle Feed
      </button>
    </footer>
  );
}
