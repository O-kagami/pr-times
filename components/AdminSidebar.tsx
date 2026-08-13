"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./admin.module.css";

const navigation = [
  { label: "ダッシュボード", href: "/admin" },
  { label: "発信履歴", href: "/companies/brainsync/history" },
  { label: "プレスリリース", href: "#" },
  { label: "メディアリスト", href: "#" },
  { label: "分析データ", href: "#" },
  { label: "企業ページ", href: "#" },
  { label: "設定", href: "#" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <div className={styles.sidebarInner}>
      <div className={styles.brand}>PRTIMES</div>
      <nav className={styles.nav}>
        {navigation.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === item.href
              : item.href !== "#" && pathname.startsWith(item.href);

          return (
            <Link
              className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
              href={item.href}
              key={item.label}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
