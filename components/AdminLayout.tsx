import type { ReactNode } from "react";
import AdminSidebar from "./AdminSidebar";
import styles from "./admin.module.css";

type Props = { children: ReactNode };

export default function AdminLayout({ children }: Props) {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <AdminSidebar />
      </aside>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
