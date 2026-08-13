"use client";

import { ArrowLeft, ArrowUpRight, CalendarDays, ChevronRight, HeartPulse } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { SESERAGI_HISTORY } from "@/data/seseragiHistory";
import { Footer } from "./Footer";
import { Header } from "./Header";
import styles from "./SeseragiHistoryPage.module.css";

export default function SeseragiHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className={styles.page}>
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className={styles.breadcrumb}>
        <Link href="/">PR TIMES</Link>
        <ChevronRight aria-hidden="true" size={13} />
        <Link href="/companies/seseragi">医療法人せせらぎ</Link>
        <ChevronRight aria-hidden="true" size={13} />
        <span>HISTORY</span>
      </div>

      <main className={styles.main}>
        <section className={styles.hero}>
          <div
            aria-hidden="true"
            className={styles.heroImage}
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1600&auto=format&fit=crop&q=90")',
            }}
          />
          <div className={styles.heroContent}>
            <span className={styles.eyebrow}>
              <HeartPulse aria-hidden="true" size={17} /> PUBLIC PR ARCHIVE
            </span>
            <h1>医療法人せせらぎの<br />HISTORY</h1>
            <p>
              「子育てを一緒に」を合言葉に、地域の家族へ届けてきたニュース。
              小児医療と子育て支援の歩みを、写真とともに振り返ります。
            </p>
            <div className={styles.heroMeta}>
              <div><strong>2014</strong><span>法人設立</span></div>
              <div><strong>365日</strong><span>家族に寄り添う診療</span></div>
              <div><strong>{SESERAGI_HISTORY.length}</strong><span>掲載中の発信</span></div>
            </div>
          </div>
        </section>

        <section aria-labelledby="history-heading">
          <header className={styles.archiveHeader}>
            <div>
              <span className={styles.eyebrow}>HISTORY COLLECTION</span>
              <h2 id="history-heading">これまでの発信</h2>
            </div>
            <p>
              新しい診療拠点、親子向けイベント、日々の安心につながる情報を
              新しいものから順に掲載しています。
            </p>
          </header>

          <div className={styles.grid}>
            {SESERAGI_HISTORY.map((item) => (
              <article className={styles.card} key={item.id}>
                <div
                  className={styles.cardImage}
                  style={{ backgroundImage: `url("${item.imageUrl}")` }}
                >
                  <span className={styles.category}>{item.category}</span>
                  <span className={styles.elapsed}>{item.elapsed}</span>
                </div>
                <div className={styles.cardBody}>
                  <time className={styles.date}>
                    <CalendarDays aria-hidden="true" size={14} />
                    {item.publishedAt}
                  </time>
                  <h3>{item.title}</h3>
                  <p className={styles.summary}>{item.summary}</p>
                  <div className={styles.keywords}>
                    {item.keywords.map((keyword) => (
                      <span key={keyword}>#{keyword}</span>
                    ))}
                  </div>
                  {item.href && (
                    <Link className={styles.detailLink} href={item.href}>
                      この発信を詳しく見る
                      <ArrowUpRight aria-hidden="true" size={16} />
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>

          <p className={styles.demoNote}>
            ※ このHISTORYページは、医療法人せせらぎの既存デモ情報をもとに構成した静的表示です。
          </p>

          <Link className="mt-8 inline-flex items-center gap-2 text-xs font-bold text-[#087c84] hover:underline" href="/companies/seseragi">
            <ArrowLeft aria-hidden="true" size={15} />
            医療法人せせらぎの企業ページへ戻る
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  );
}
