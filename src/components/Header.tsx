import React from "react";

import styles from "./Header.module.scss";

export function Header() {
  return (
    <header>
      <h1 className={styles.heading}>Order Book</h1>
    </header>
  );
}
