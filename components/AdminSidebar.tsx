"use client";
import React from "react";
import styles from "./admin.module.css";

export default function AdminSidebar() {
  return (
    <div className={styles.sidebarInner}>
      <div className={styles.brand}>PRTIMES</div>
      <nav className={styles.nav}>
        <a className={styles.navItem} href="#">ダッシュボード</a>
        <a className={styles.navItem} href="#">プレスリリース</a>
        <a className={styles.navItem} href="#">メディアリスト</a>
        <a className={styles.navItem} href="#">分析データ</a>
        <a className={styles.navItem} href="#">企業ページ</a>
        <a className={styles.navItem} href="#">設定</a>
      </nav>
    </div>
  );
}
