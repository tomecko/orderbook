import React from "react";

import styles from "./Button.module.scss";

interface Props {
  children: React.ReactNode;
  onClick: () => void;
}

export function Button({ children, onClick }: Props) {
  return (
    <button className={styles.button} onClick={onClick}>
      {children}
    </button>
  );
}
