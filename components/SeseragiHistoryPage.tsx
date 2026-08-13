"use client";

import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  HeartPulse,
  RotateCcw,
  Undo2,
  Sparkles,
  ArrowRightLeft,
  Check
} from "lucide-react";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import TinderCard from "react-tinder-card";
import { SESERAGI_HISTORY } from "@/data/seseragiHistory";
import { Footer } from "./Footer";
import { Header } from "./Header";
import styles from "./SeseragiHistoryPage.module.css";

export default function SeseragiHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"swipe" | "grid">("swipe");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [, setLastDirection] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Array of refs to control the Tinder Cards programmatically
  const childRefs = useRef<React.RefObject<any>[]>([]);
  if (childRefs.current.length !== SESERAGI_HISTORY.length) {
    childRefs.current = Array(SESERAGI_HISTORY.length)
      .fill(null)
      .map(() => React.createRef());
  }

  const handleSwiped = (direction: string, index: number) => {
    setLastDirection(direction);
    setCurrentIndex((prevIndex) => {
      if (index === prevIndex) {
        return prevIndex + 1;
      }
      return prevIndex;
    });
  };

  const handleSwipeButtonClick = (dir: "left" | "right") => {
    if (currentIndex < SESERAGI_HISTORY.length && childRefs.current[currentIndex]?.current) {
      childRefs.current[currentIndex].current.swipe(dir);
    }
  };

  const handleUndo = async () => {
    if (currentIndex > 0) {
      const targetIndex = currentIndex - 1;
      setCurrentIndex(targetIndex);
      if (childRefs.current[targetIndex]?.current) {
        await childRefs.current[targetIndex].current.restoreCard();
      }
    }
  };

  const handleReset = async () => {
    // Restore cards from bottom to top
    for (let i = SESERAGI_HISTORY.length - 1; i >= 0; i--) {
      if (childRefs.current[i]?.current) {
        await childRefs.current[i].current.restoreCard();
      }
    }
    setCurrentIndex(0);
  };

  const handleSliderChange = async (value: number) => {
    const targetIndex = SESERAGI_HISTORY.length - 1 - value;
    if (targetIndex === currentIndex) return;

    if (targetIndex > currentIndex) {
      for (let i = currentIndex; i < targetIndex; i++) {
        if (childRefs.current[i]?.current) {
          childRefs.current[i].current.swipe("left");
        }
      }
    } else {
      for (let i = currentIndex - 1; i >= targetIndex; i--) {
        if (childRefs.current[i]?.current) {
          await childRefs.current[i].current.restoreCard();
        }
      }
    }
    setCurrentIndex(targetIndex);
  };

  // We reverse the history items so that index 0 (newest) is rendered last and appears on top of the absolute stack
  const reversedHistory = [...SESERAGI_HISTORY].reverse();

  // Timeline variables
  const timelineEvents = [...SESERAGI_HISTORY].reverse();
  const activeTimelineIndex = SESERAGI_HISTORY.length - 1 - currentIndex;
  const progressPercentage =
    SESERAGI_HISTORY.length > 1
      ? (activeTimelineIndex / (SESERAGI_HISTORY.length - 1)) * 100
      : 100;

  const getCardClass = (index: number) => {
    const diff = index - currentIndex;
    if (diff < 0) return styles.cardSwiped;
    if (diff === 0) return styles.cardActive;
    if (diff === 1) return styles.cardLayer1;
    if (diff === 2) return styles.cardLayer2;
    return styles.cardHidden;
  };

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
              インタラクティブなタイムラインまたは一覧でご覧いただけます。
            </p>
          </header>

          <div className={styles.modeSelector}>
            <button
              onClick={() => setViewMode("swipe")}
              className={`${styles.modeTab} ${viewMode === "swipe" ? styles.modeTabActive : ""}`}
            >
              スワイプ式タイムライン
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`${styles.modeTab} ${viewMode === "grid" ? styles.modeTabActive : ""}`}
            >
              グリッド一覧
            </button>
          </div>

          {viewMode === "swipe" && isMounted ? (
            <div className={styles.swipeSection}>
              {/* Timeline Tracker */}
              <div className={styles.timelineContainer}>
                <div className={styles.timelineTrack}>
                  <div
                    className={styles.timelineProgress}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                
                <input
                  type="range"
                  min="0"
                  max={SESERAGI_HISTORY.length - 1}
                  value={activeTimelineIndex}
                  onChange={(e) => handleSliderChange(Number(e.target.value))}
                  className={styles.sliderRange}
                />

                <div className={styles.timelineNodes}>
                  {timelineEvents.map((item, index) => {
                    const originalIndex = SESERAGI_HISTORY.length - 1 - index;
                    const isActive = originalIndex === currentIndex;
                    const isCompleted = originalIndex < currentIndex;

                    const match = item.publishedAt.match(/(\d{4})年(\d{1,2})月/);
                    const shortDate = match
                      ? `${match[1].slice(-2)}/${match[2].padStart(2, "0")}`
                      : item.publishedAt;

                    return (
                      <div
                        key={item.id}
                        onClick={async () => {
                          if (originalIndex > currentIndex) {
                            for (let i = currentIndex; i < originalIndex; i++) {
                              if (childRefs.current[i]?.current) {
                                childRefs.current[i].current.swipe("left");
                              }
                            }
                          } else if (originalIndex < currentIndex) {
                            for (let i = currentIndex - 1; i >= originalIndex; i--) {
                              if (childRefs.current[i]?.current) {
                                await childRefs.current[i].current.restoreCard();
                              }
                            }
                            setCurrentIndex(originalIndex);
                          }
                        }}
                        className={`${styles.timelineNode} ${
                          isActive ? styles.timelineNodeActive : ""
                        }`}
                      >
                        <div
                          className={`${styles.timelineDot} ${
                            isActive
                              ? styles.timelineDotActive
                              : isCompleted
                              ? styles.timelineDotCompleted
                              : ""
                          }`}
                        >
                          {isCompleted ? <Check size={12} /> : shortDate.split("/")[1]}
                        </div>
                        <span className={styles.timelineLabel}>{shortDate}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Tinder Card Stack Container */}
              <div className={styles.deckContainer}>
                {currentIndex === SESERAGI_HISTORY.length ? (
                  <div className={styles.journeyEnd}>
                    <div className={styles.journeyEndIcon}>
                      <Sparkles size={36} />
                    </div>
                    <h3>せせらぎの歴史をすべて振り返りました！</h3>
                    <p>
                      2014年の設立から、最新の365日小児クリニック開院まで、小児医療と子育て支援の歩みを辿りました。
                    </p>
                    <button onClick={handleReset} className={styles.restartJourneyBtn}>
                      <RotateCcw size={16} />
                      最初からもう一度見る
                    </button>
                  </div>
                ) : (
                  reversedHistory.map((item, index) => {
                    const originalIndex = SESERAGI_HISTORY.length - 1 - index;
                    return (
                      <TinderCard
                        ref={childRefs.current[originalIndex]}
                        key={item.id}
                        className={styles.cardWrapper}
                        onSwipe={(dir) => handleSwiped(dir, originalIndex)}
                        preventSwipe={["up", "down"]}
                      >
                        <div className={`${styles.tinderCard} ${getCardClass(originalIndex)}`}>
                          <div
                            className={styles.cardImage}
                            style={{
                              backgroundImage: `url("${item.imageUrl}")`,
                              height: "260px",
                            }}
                          >
                            <span className={styles.category}>{item.category}</span>
                            <span className={styles.elapsed}>{item.elapsed}</span>
                          </div>
                          <div className={styles.cardBody} style={{ padding: "20px" }}>
                            <time className={styles.date}>
                              <CalendarDays aria-hidden="true" size={14} />
                              {item.publishedAt}
                            </time>
                            <h3
                              style={{
                                fontSize: "16px",
                                marginTop: "10px",
                                lineHeight: "1.5",
                                fontWeight: 800,
                              }}
                            >
                              {item.title}
                            </h3>
                            <p
                              className={styles.summary}
                              style={{
                                fontSize: "12px",
                                marginTop: "8px",
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                lineHeight: "1.8",
                              }}
                            >
                              {item.summary}
                            </p>
                            <div className={styles.keywords} style={{ paddingTop: "12px" }}>
                              {item.keywords.map((keyword) => (
                                <span key={keyword}>#{keyword}</span>
                              ))}
                            </div>
                            {item.href && (
                              <Link
                                className={`${styles.detailLink} pressable`}
                                href={item.href}
                                style={{ marginTop: "12px", paddingTop: "10px" }}
                              >
                                この発信を詳しく見る
                                <ArrowUpRight aria-hidden="true" size={15} />
                              </Link>
                            )}
                          </div>
                        </div>
                      </TinderCard>
                    );
                  })
                )}
              </div>

              {/* Tinder Swiper Control Panel */}
              <div className={styles.controlPanel}>
                <button
                  onClick={handleReset}
                  disabled={currentIndex === 0}
                  className={`${styles.controlButton} ${styles.resetButton}`}
                  title="最初から"
                >
                  <RotateCcw size={20} />
                </button>
                <button
                  onClick={() => handleSwipeButtonClick("left")}
                  disabled={currentIndex === SESERAGI_HISTORY.length}
                  className={`${styles.controlButton} ${styles.swipeLeftButton}`}
                  title="過去へ遡る"
                >
                  <ChevronRight className="rotate-180" size={24} />
                </button>
                <button
                  onClick={() => handleSwipeButtonClick("right")}
                  disabled={currentIndex === SESERAGI_HISTORY.length}
                  className={`${styles.controlButton} ${styles.swipeRightButton}`}
                  title="過去へ遡る"
                >
                  <ChevronRight size={24} />
                </button>
                <button
                  onClick={handleUndo}
                  disabled={currentIndex === 0}
                  className={`${styles.controlButton} ${styles.undoButton}`}
                  title="1つ戻す"
                >
                  <Undo2 size={20} />
                </button>
              </div>

              <div className={styles.swipeInstructions}>
                <span>
                  <ArrowRightLeft size={14} /> 左右スワイプで歴史を遡れます
                </span>
              </div>
            </div>
          ) : (
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
          )}

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
