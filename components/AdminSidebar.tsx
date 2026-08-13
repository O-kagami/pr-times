"use client";
import React from "react";
import styles from "./admin.module.css";
import SidebarNav from "./ui/SidebarNav";

const items = [
  { title: "ダッシュボード", href: "/admin" },
  { title: "プレスリリース", href: "/admin/press-releases" },
  { title: "メディアリスト", href: "/admin/media-list" },
  { title: "分析データ", href: "/admin/analytics" },
  { title: "企業ページ", href: "/admin/company" },
  { title: "設定", href: "/admin/settings" },
];

export default function AdminSidebar() {
  return (
    <div className={styles.sidebarInner}>
      <div className={styles.brand}>PRTIMES</div>
      <SidebarNav items={items} />
    </div>
  );
}
