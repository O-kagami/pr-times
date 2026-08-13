"use client";
import React from "react";
import styles from "./admin.module.css";

function Card({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>{title}</div>
      <div className={styles.cardBody}>{children}</div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div>
      <h1 className={styles.pageTitle}>ダッシュボード</h1>

      <div className={styles.cards}>
        <Card title="テスト4">短い説明テキスト</Card>
        <Card title="コンテンツ掲載基準を更新しました">
          「日本初」「No.1」等の表現に関する基準を更新しました。詳しくは通知をご確認ください。
        </Card>
        <Card title="WebクリッピングでSNS投稿の取得が可能になりました">
          指定キーワードに基づきSNS投稿を自動で取得できます。
        </Card>
        <Card title="企業ページの情報を充実させましょう！" />
        <Card title="会社設立日を設定しましょう！" />
        <Card title="直近1か月間のデータ（2026/07/14 - 2026/08/13）のデータ" />
      </div>
    </div>
  );
}
