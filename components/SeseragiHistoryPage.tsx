"use client";

import {
  ArrowLeft,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  ChevronLeft,
  HeartPulse,
  RotateCcw,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";
import {
  animate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
  type MotionValue,
  type PanInfo,
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import { SESERAGI_HISTORY, type SeseragiHistoryItem } from "@/data/seseragiHistory";
import { Footer } from "./Footer";
import { Header } from "./Header";
import styles from "./SeseragiHistoryPage.module.css";

const LAST_INDEX = SESERAGI_HISTORY.length - 1;

/** Cards beyond this distance stack together instead of drifting off-page */
const MAX_VISUAL_OFFSET = 3;

/** Horizontal gap between neighbouring cards, in px */
const SPACING_DESKTOP = 80;
const SPACING_MOBILE = 46;

/** Every settle runs on this spring, so a release carries its own velocity into the motion */
const SETTLE_SPRING = { type: "spring" as const, stiffness: 50, damping: 30, mass: 0.9 };

/** Seconds of fling projected forward when choosing which card to land on */
const FLING_PROJECTION = 0.28;

/** Resistance applied while dragging past the first or last card */
const EDGE_RESISTANCE = 0.3;

/** Gap between neighbouring cards when the whole set turns over at once, in ms */
const FLIP_STAGGER = 55;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/**
 * The data is newest-first, but the deck and the timeline both read past → future.
 * Chronological position: 0 = oldest (far left), LAST_INDEX = newest (far right).
 */
const toChrono = (index: number) => LAST_INDEX - index;

/**
 * Both faces of one card. The front is the press release as it was published;
 * the back is what the PR person wrote underneath it, laid out like the back of a photo.
 * Nothing on the front announces the back — turning the cards over is the surprise.
 * `compact` is the deck's tighter scale — the grid uses the roomier default.
 */
function CardFaces({
  item,
  flipped,
  compact = false,
  delayMs = 0,
}: {
  item: SeseragiHistoryItem;
  flipped: boolean;
  compact?: boolean;
  /** Staggered per card, so the set ripples instead of turning as one block */
  delayMs?: number;
}) {
  const voice = item.voice;
  const scale = compact ? styles.faceCompact : "";

  return (
    <div
      className={`${styles.flipInner} ${flipped ? styles.flipInnerFlipped : ""}`}
      style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      <div className={`${styles.face} ${scale}`} inert={flipped || undefined}>
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
            <Link className={`${styles.detailLink} pressable`} href={item.href} draggable={false}>
              この発信を詳しく見る
              <ArrowUpRight aria-hidden="true" size={15} />
            </Link>
          )}
        </div>
      </div>

      {voice && (
        <div
          className={`${styles.face} ${styles.faceBack} ${scale}`}
          inert={flipped ? undefined : true}
        >
          <div className={styles.backHeader}>
            <span
              aria-hidden="true"
              className={styles.backStamp}
              style={{ backgroundImage: `url("${item.imageUrl}")` }}
            />
            <div>
              <span className={styles.backEyebrow}>広報担当より</span>
              <span className={styles.backDate}>{item.publishedAt}／{item.category}</span>
            </div>
          </div>

          <div className={styles.backMessage}>
            {voice.body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>

          <div className={styles.backSignature}>
            <div className={styles.backAuthor}>{voice.author}</div>
            <div className={styles.backRole}>{voice.role}</div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * One card in the deck. Its whole appearance is derived from the shared position value,
 * so the fan keeps re-forming continuously while a drag is in progress — not just on release.
 */
function HistoryCard({
  item,
  chrono,
  position,
  spacing,
  isActive,
  flipped,
  delayMs,
}: {
  item: SeseragiHistoryItem;
  chrono: number;
  position: MotionValue<number>;
  spacing: MotionValue<number>;
  isActive: boolean;
  flipped: boolean;
  delayMs: number;
}) {
  // Signed distance from the active card: negative = older (left), positive = newer (right)
  const offset = useTransform(position, (p) =>
    clamp(chrono - p, -MAX_VISUAL_OFFSET, MAX_VISUAL_OFFSET)
  );

  const x = useTransform([offset, spacing], ([o, s]: number[]) => o * s);
  const y = useTransform(offset, (o) => Math.abs(o) * 10);
  const rotate = useTransform(offset, (o) => o * 3);
  const scale = useTransform(offset, (o) => 1 - Math.abs(o) * 0.08);
  const opacity = useTransform(offset, (o) => Math.max(0.35, 1 - Math.abs(o) * 0.22));
  const zIndex = useTransform(offset, (o) => 100 - Math.round(Math.abs(o)));

  return (
    <motion.div
      className={`${styles.tinderCard} ${
        isActive ? styles.tinderCardActive : styles.tinderCardInactive
      }`}
      style={{ x, y, rotate, scale, opacity, zIndex }}
    >
      <CardFaces item={item} flipped={flipped} compact delayMs={delayMs} />
    </motion.div>
  );
}

export default function SeseragiHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"swipe" | "grid">("swipe");
  const [currentIndex, setCurrentIndex] = useState(0);

  /** Which side every card is showing. One switch turns the whole set over. */
  const [flipped, setFlipped] = useState(false);

  const flipDelay = (index: number) => Math.min(index, 5) * FLIP_STAGGER;

  /** Fractional chronological position of the deck. Everything visual is derived from this. */
  const position = useMotionValue(toChrono(0));
  const spacing = useMotionValue(SPACING_DESKTOP);
  const panOrigin = useRef(0);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 640px)");
    const sync = () => spacing.set(query.matches ? SPACING_MOBILE : SPACING_DESKTOP);

    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, [spacing]);

  // Keep the timeline in step with the deck, whether it is being dragged or springing into place
  useMotionValueEvent(position, "change", (value) => {
    const nearest = LAST_INDEX - clamp(Math.round(value), 0, LAST_INDEX);
    setCurrentIndex((previous) => (previous === nearest ? previous : nearest));
  });

  const settleAt = (chrono: number, velocity = 0) => {
    animate(position, clamp(chrono, 0, LAST_INDEX), { ...SETTLE_SPRING, velocity });
  };

  const goTo = (index: number) => {
    position.stop();
    settleAt(toChrono(clamp(index, 0, LAST_INDEX)));
  };

  const handlePanStart = () => {
    position.stop();
    panOrigin.current = position.get();
  };

  const handlePan = (_event: PointerEvent, info: PanInfo) => {
    // Dragging left moves the deck towards the newer cards waiting on the right
    const raw = panOrigin.current - info.offset.x / spacing.get();

    if (raw < 0) {
      position.set(raw * EDGE_RESISTANCE);
    } else if (raw > LAST_INDEX) {
      position.set(LAST_INDEX + (raw - LAST_INDEX) * EDGE_RESISTANCE);
    } else {
      position.set(raw);
    }
  };

  const handlePanEnd = (_event: PointerEvent, info: PanInfo) => {
    // Carry the release velocity into the spring so a flick keeps travelling and decays naturally
    const velocity = -info.velocity.x / spacing.get();
    const projected = position.get() + velocity * FLING_PROJECTION;

    settleAt(Math.round(projected), velocity);
  };

  // The timeline is rendered oldest (left) to newest (right)
  const timelineEvents = [...SESERAGI_HISTORY].reverse();
  const activeTimelineIndex = toChrono(currentIndex);
  const progressPercentage =
    SESERAGI_HISTORY.length > 1 ? (activeTimelineIndex / LAST_INDEX) * 100 : 100;

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
              新しい診療拠点、親子向けイベント、日々の安心につながる情報を振り返ります。
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
            <button
              onClick={() => setFlipped((previous) => !previous)}
              aria-pressed={flipped}
              className={`${styles.modeTab} ${styles.flipTab} ${
                flipped ? styles.flipTabActive : ""
              }`}
            >
              <RefreshCw aria-hidden="true" size={14} />
              カードを裏返す
            </button>
          </div>

          {viewMode === "swipe" ? (
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
                  max={LAST_INDEX}
                  value={activeTimelineIndex}
                  onChange={(e) => goTo(LAST_INDEX - Number(e.target.value))}
                  className={styles.sliderRange}
                />

                <div className={styles.timelineNodes}>
                  {timelineEvents.map((item, index) => {
                    const originalIndex = LAST_INDEX - index;
                    const isActive = originalIndex === currentIndex;
                    // Older than the active card, so it sits left of it — the stretch the progress bar fills
                    const isPast = originalIndex > currentIndex;

                    const match = item.publishedAt.match(/(\d{4})年(\d{1,2})月/);
                    const shortDate = match
                      ? `${match[1].slice(-2)}/${match[2].padStart(2, "0")}`
                      : item.publishedAt;

                    return (
                      <div
                        key={item.id}
                        onClick={() => goTo(originalIndex)}
                        className={`${styles.timelineNode} ${
                          isActive ? styles.timelineNodeActive : ""
                        }`}
                      >
                        <div
                          className={`${styles.timelineDot} ${
                            isActive
                              ? styles.timelineDotActive
                              : isPast
                              ? styles.timelineDotPast
                              : ""
                          }`}
                        >
                          {shortDate.split("/")[1]}
                        </div>
                        <span className={styles.timelineLabel}>{shortDate}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Carousel deck: every card stays mounted and slides, none are unmounted on swipe */}
              <motion.div
                className={styles.deckContainer}
                onPanStart={handlePanStart}
                onPan={handlePan}
                onPanEnd={handlePanEnd}
              >
                {SESERAGI_HISTORY.map((item, index) => (
                  <HistoryCard
                    key={item.id}
                    item={item}
                    chrono={toChrono(index)}
                    position={position}
                    spacing={spacing}
                    isActive={index === currentIndex}
                    flipped={flipped}
                    delayMs={flipDelay(Math.abs(index - currentIndex))}
                  />
                ))}
              </motion.div>

              {/* Deck Control Panel */}
              <div className={styles.controlPanel}>
                <button
                  onClick={() => goTo(0)}
                  disabled={currentIndex === 0}
                  className={`${styles.controlButton} ${styles.resetButton}`}
                  title="最新に戻る"
                >
                  <RotateCcw size={20} />
                </button>
                <button
                  onClick={() => goTo(currentIndex + 1)}
                  disabled={currentIndex === LAST_INDEX}
                  className={`${styles.controlButton} ${styles.swipeLeftButton}`}
                  title="過去（古い年代）へ"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => goTo(currentIndex - 1)}
                  disabled={currentIndex === 0}
                  className={`${styles.controlButton} ${styles.swipeRightButton}`}
                  title="未来（新しい年代）へ"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

            </div>
          ) : (
            <div className={styles.grid}>
              {SESERAGI_HISTORY.map((item, index) => (
                <article className={styles.card} key={item.id}>
                  <CardFaces item={item} flipped={flipped} delayMs={flipDelay(index)} />
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
