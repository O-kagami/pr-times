"use client";

import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Clock3,
  FileText,
  Layers3,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import {
  createRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import TinderCard from "react-tinder-card";
import type {
  CompanyDirectoryEntry,
  CompanyHistoryItem,
} from "../data/companies";
import { CategoryNav } from "./CategoryNav";
import styles from "./CompanyHistoryPage.module.css";
import { Footer } from "./Footer";
import { Header } from "./Header";

type SwipeDirection = "left" | "right";
type TinderCardApi = {
  swipe: (direction?: "left" | "right" | "up" | "down") => Promise<void>;
  restoreCard: () => Promise<void>;
};

type DeckCardStyle = CSSProperties & {
  "--card-depth": string;
};

function getElapsedLabel(startedAt: string, referenceStartedAt: string) {
  const started = new Date(startedAt);
  const reference = new Date(referenceStartedAt);
  const months = Math.max(
    0,
    (reference.getFullYear() - started.getFullYear()) * 12 +
      reference.getMonth() -
      started.getMonth(),
  );

  if (months === 0) return "今月";
  if (months < 12) return `${months}ヶ月前`;

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  return remainingMonths === 0
    ? `${years}年前`
    : `${years}年${remainingMonths}ヶ月前`;
}

function HistoryDialog({
  item,
  onClose,
}: {
  item: CompanyHistoryItem;
  onClose: () => void;
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/75 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="presentation"
    >
      <section
        aria-modal="true"
        className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        role="dialog"
      >
        <button
          aria-label="詳細を閉じる"
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full border border-white/40 bg-slate-950/60 text-white backdrop-blur"
          onClick={onClose}
          type="button"
        >
          <X className="h-5 w-5" />
        </button>
        <div
          className="h-[320px] bg-cover bg-center md:h-[440px]"
          style={{ backgroundImage: `url("${item.imageUrl}")` }}
        />
        <div className="p-6 md:p-9">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
            <span className="rounded-full bg-sky-50 px-3 py-1 font-bold text-[#0066cc]">
              {item.category}
            </span>
            <time dateTime={item.startedAt}>{item.formattedStartedAt} 開始</time>
          </div>
          <h2 className="mt-5 text-2xl font-extrabold leading-relaxed tracking-tight md:text-3xl">
            {item.title}
          </h2>
          <p className="mt-4 text-sm leading-7 text-gray-700">{item.summary}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {item.keywords.map((keyword) => (
              <span
                className="rounded bg-gray-100 px-2 py-1 text-[10px] text-gray-600"
                key={keyword}
              >
                #{keyword}
              </span>
            ))}
          </div>
          <div className="mt-7 flex justify-end gap-2 border-t border-gray-200 pt-5">
            <button
              className="rounded-md border border-gray-300 px-5 py-2 text-xs font-bold text-gray-600"
              onClick={onClose}
              type="button"
            >
              閉じる
            </button>
            {item.href && (
              <Link
                className="inline-flex items-center gap-2 rounded-md bg-[#0066cc] px-5 py-2 text-xs font-bold text-white"
                href={item.href}
              >
                公開ページを見る <ArrowUpRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function CompanyHistoryPage({
  company,
}: {
  company: CompanyDirectoryEntry;
}) {
  const [headerSearch, setHeaderSearch] = useState("");
  const [query, setQuery] = useState("");
  const [activeYear, setActiveYear] = useState<number | "all">("all");
  const [selectedItem, setSelectedItem] = useState<CompanyHistoryItem | null>(
    null,
  );

  const years = useMemo(
    () =>
      [
        ...new Set(
          company.history.map((item) => new Date(item.startedAt).getFullYear()),
        ),
      ].sort((a, b) => b - a),
    [company.history],
  );
  const visibleHistory = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return company.history.filter((item) => {
      const matchesYear =
        activeYear === "all" ||
        new Date(item.startedAt).getFullYear() === activeYear;
      const matchesQuery =
        !normalized ||
        [item.title, item.summary, ...item.keywords]
          .join(" ")
          .toLowerCase()
          .includes(normalized);
      return matchesYear && matchesQuery;
    });
  }, [activeYear, company.history, query]);

  const deckBaseKey = useMemo(
    () => visibleHistory.map((item) => item.id).join("-"),
    [visibleHistory],
  );
  const [loopState, setLoopState] = useState(() => ({
    key: deckBaseKey,
    step: 0,
  }));
  const activeStep = loopState.key === deckBaseKey ? loopState.step : 0;
  const rotation =
    visibleHistory.length > 0
      ? ((activeStep % visibleHistory.length) + visibleHistory.length) %
        visibleHistory.length
      : 0;
  const orderedHistory = useMemo(
    () => [
      ...visibleHistory.slice(rotation),
      ...visibleHistory.slice(0, rotation),
    ],
    [rotation, visibleHistory],
  );

  // react-tinder-cardでは配列の末尾が最前面になるため、表示順を反転します。
  const deckItems = useMemo(
    () => [...orderedHistory].reverse(),
    [orderedHistory],
  );
  const deckRenderKey = `${deckBaseKey}:${activeStep}`;
  const childRefs = useMemo(
    () => deckItems.map(() => createRef<TinderCardApi>()),
    [deckItems],
  );
  const [animationState, setAnimationState] = useState(() => ({
    key: deckRenderKey,
    active: false,
  }));
  const isAnimating =
    animationState.key === deckRenderKey && animationState.active;
  const currentIndex = deckItems.length - 1;

  const advanceDeck = useCallback(() => {
    if (visibleHistory.length === 0) return;
    setLoopState((state) => {
      const currentStep = state.key === deckBaseKey ? state.step : 0;
      return {
        key: deckBaseKey,
        step: currentStep + 1,
      };
    });
  }, [deckBaseKey, visibleHistory.length]);

  const goBack = useCallback(() => {
    if (visibleHistory.length === 0) return;
    setLoopState((state) => {
      const currentStep = state.key === deckBaseKey ? state.step : 0;
      return {
        key: deckBaseKey,
        step: currentStep - 1,
      };
    });
  }, [deckBaseKey, visibleHistory.length]);

  const handleSwipe = useCallback(() => {
    setAnimationState({
      key: deckRenderKey,
      active: true,
    });
  }, [deckRenderKey]);

  const handleCardLeftScreen = useCallback(() => {
    advanceDeck();
  }, [advanceDeck]);

  const swipe = useCallback(
    async (direction: SwipeDirection) => {
      if (currentIndex < 0 || isAnimating) return;
      await childRefs[currentIndex].current?.swipe(direction);
    },
    [childRefs, currentIndex, isAnimating],
  );

  const restore = useCallback(() => {
    if (isAnimating) return;
    goBack();
  }, [goBack, isAnimating]);

  const referenceStartedAt = company.history[0]?.startedAt ?? "";

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-gray-900">
      <Header searchQuery={headerSearch} onSearchChange={setHeaderSearch} />
      <CategoryNav selectedCategory="all" onSelectCategory={() => {}} />
      <main className="mx-auto max-w-[1200px] px-4 py-8">
        <Link
          className="inline-flex items-center gap-2 text-xs font-bold text-[#0066cc] hover:underline"
          href={`/companies/${company.companyId}`}
        >
          <ArrowLeft className="h-4 w-4" />
          {company.name}の企業ページへ
        </Link>
        <header className="mt-6 overflow-hidden rounded-2xl bg-[#122c49] text-white">
          <div className="grid md:grid-cols-[1fr_44%]">
            <div className="flex flex-col justify-center p-7 md:p-11">
              <span className="text-[10px] font-bold tracking-[0.2em] text-sky-300">
                PUBLIC PR ARCHIVE
              </span>
              <h1 className="mt-3 text-4xl font-extrabold tracking-tight md:text-6xl">
                HISTORYS
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-slate-200">
                {company.name}
                が届けてきたニュースを、カードをめくりながら振り返ります。
              </p>
            </div>
            <div
              className="h-[280px] bg-cover bg-center md:h-[390px]"
              style={{
                backgroundImage: `linear-gradient(90deg, #122c49 0%, transparent 24%), url("${company.coverImageUrl}")`,
              }}
            />
          </div>
        </header>

        <section className="my-7 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-xs md:flex-row md:items-center">
          <label className="flex h-11 flex-1 items-center gap-2 rounded-md border border-gray-300 px-3 text-gray-500">
            <Search className="h-4 w-4" />
            <input
              className="w-full border-0 bg-transparent text-xs outline-none"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="タイトル・キーワードで検索"
              value={query}
            />
          </label>
          <div className="flex gap-2 overflow-x-auto">
            <button
              className={`shrink-0 rounded-full px-4 py-2 text-[10px] font-bold ${activeYear === "all" ? "bg-[#182b45] text-white" : "bg-gray-100 text-gray-600"}`}
              onClick={() => setActiveYear("all")}
              type="button"
            >
              すべて
            </button>
            {years.map((year) => (
              <button
                className={`shrink-0 rounded-full px-4 py-2 text-[10px] font-bold ${activeYear === year ? "bg-[#182b45] text-white" : "bg-gray-100 text-gray-600"}`}
                key={year}
                onClick={() => setActiveYear(year)}
                type="button"
              >
                {year}
              </button>
            ))}
          </div>
        </section>

        {deckItems.length > 0 ? (
          <section className={styles.deckSection}>
            <div className={styles.deckIntro}>
              <span className={styles.deckEyebrow}>
                <Layers3 className="h-4 w-4" /> SWIPE THE HISTORY
              </span>
              <h2>カードをめくって、<br />発信の歩みを見る</h2>
              <p>
                3枚の発信を見比べながら、左右にスワイプして次へ。最後まで進むと先頭へ戻り、何度でも発信を振り返れます。
              </p>
              <div className={styles.deckProgress}>
                <strong>∞</strong>
                <span>{rotation + 1} / {deckItems.length} ・ループ中</span>
              </div>
              <div className={styles.deckActions}>
                <button
                  aria-label="左へスワイプ"
                  disabled={currentIndex < 0 || isAnimating}
                  onClick={() => swipe("left")}
                  type="button"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <button
                  aria-label="ひとつ前のカードへ戻す"
                  disabled={currentIndex < 0 || isAnimating}
                  onClick={restore}
                  type="button"
                >
                  <RotateCcw className="h-5 w-5" />
                </button>
                <button
                  aria-label="右へスワイプ"
                  disabled={currentIndex < 0 || isAnimating}
                  onClick={() => swipe("right")}
                  type="button"
                >
                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className={styles.deckStage} key={deckRenderKey}>
              <div className={styles.deckShadowThree} />
              <div className={styles.deckShadowTwo} />
              {deckItems.map((item, index) => {
                const depth = Math.max(0, currentIndex - index);
                const isVisible = index <= currentIndex && depth <= 2;
                const cardStyle: DeckCardStyle = {
                  "--card-depth": String(Math.min(depth, 2)),
                  opacity: isVisible ? 1 : 0,
                  pointerEvents: isVisible ? "auto" : "none",
                  zIndex: index + 1,
                };
                return (
                  <TinderCard
                    className={styles.swipeCard}
                    key={item.id}
                    onCardLeftScreen={handleCardLeftScreen}
                    onSwipe={handleSwipe}
                    preventSwipe={["up", "down"]}
                    ref={childRefs[index]}
                    swipeRequirementType="position"
                    swipeThreshold={110}
                  >
                    <button
                      className={styles.portraitCard}
                      onClick={() => setSelectedItem(item)}
                      style={cardStyle}
                      type="button"
                    >
                      <div
                        className={styles.portraitImage}
                        style={{ backgroundImage: `url("${item.imageUrl}")` }}
                      >
                        <span className={styles.cardCategory}>{item.category}</span>
                        <span className={styles.elapsedBadge}>
                          {getElapsedLabel(item.startedAt, referenceStartedAt)}
                        </span>
                      </div>
                      <div className={styles.portraitBody}>
                        <time dateTime={item.startedAt}>
                          <Clock3 className="h-3.5 w-3.5" />
                          {item.formattedStartedAt} 開始
                        </time>
                        <h3>{item.title}</h3>
                        <p>{item.summary}</p>
                        <div className={styles.cardKeywords}>
                          {item.keywords.slice(0, 3).map((keyword) => (
                            <span key={keyword}>#{keyword}</span>
                          ))}
                        </div>
                      </div>
                    </button>
                  </TinderCard>
                );
              })}
            </div>
          </section>
        ) : (
          <div className="grid min-h-[300px] place-items-center rounded-xl border border-dashed border-gray-300 bg-white text-center">
            <div>
              <FileText className="mx-auto h-7 w-7 text-gray-400" />
              <h2 className="mt-3 font-bold">一致する発信がありません</h2>
              <p className="mt-1 text-xs text-gray-500">
                検索条件を変更してください。
              </p>
            </div>
          </div>
        )}
      </main>
      <Footer />
      {selectedItem && (
        <HistoryDialog
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
}
