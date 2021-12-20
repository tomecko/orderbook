import React from "react";

import styles from "./Modal.module.scss";

interface Props {
  children: React.ReactNode;
}

export function Modal({ children }: Props) {
  return (
    <>
      <div className={styles.overlay}></div>
      <div className={styles.modal}>{children}</div>
    </>
  );
}
