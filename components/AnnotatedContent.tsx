/* eslint-disable @next/next/no-img-element */
"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { InlineNote, SoftPrNote } from "@/data/pressReleases";

interface AnnotatedContentProps {
  content: string;
  notes?: InlineNote[];
  softNotes?: SoftPrNote[];
  compact?: boolean;
  onSelectSoftNote?: (note: SoftPrNote) => void;
}

type Mark =
  | { kind: "fact"; anchor: string; note: InlineNote }
  | { kind: "soft"; anchor: string; note: SoftPrNote };

type ActiveMark = {
  key: string;
  /** 位置を測り直すときに使う、要求元の幅 */
  baseWidth: number;
  /** すべてビューポート基準のpx。マーカーの位置に関係なく画面内に収める */
  left: number;
  width: number;
  top: number;
  bottom: number;
  /** 吹き出しの左端からしっぽまでの距離 */
  tailLeft: number;
  placement: "above" | "below";
};

/** 吹き出しと画面端のあいだに残す余白 */
const POPOVER_MARGIN = 12;
/** Tailwindのw-80 / w-64に対応する実寸。開く前に位置を決めるため定数で持つ */
const POPOVER_WIDTH = 320;
const POPOVER_WIDTH_COMPACT = 256;

export function AnnotatedContent({
  content,
  notes,
  softNotes,
  compact = false,
  onSelectSoftNote,
}: AnnotatedContentProps) {
  const [active, setActive] = useState<ActiveMark | null>(null);
  const activeElementRef = useRef<HTMLElement | null>(null);
  const activeMark = active?.key ?? null;
  const activeBaseWidth = active?.baseWidth ?? 0;
  // タッチ端末はホバーできないので、タップで開閉する
  const canHover = useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia("(hover: hover)");
      query.addEventListener("change", onChange);
      return () => query.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(hover: hover)").matches,
    () => true // サーバー側では判定できないのでホバーありとして描く
  );

  useEffect(() => {
    if (!activeMark) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("[data-annotated-mark]")) return;
      setActive(null);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [activeMark]);

  /**
   * 吹き出しはマーカーの真下（下に余白がなければ真上）に出す。
   * 位置はビューポート基準で決めて画面端で必ず折り返す。マーカーを基準に
   * 中央揃えするだけだと、行頭・行末のマーカーで画面外にはみ出してしまう。
   */
  const openMark = useCallback((key: string, element: HTMLElement, baseWidth: number) => {
    activeElementRef.current = element;

    const rect = element.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const width = Math.min(baseWidth, window.innerWidth - POPOVER_MARGIN * 2);
    const maxLeft = Math.max(window.innerWidth - POPOVER_MARGIN - width, POPOVER_MARGIN);
    const left = Math.min(Math.max(center - width / 2, POPOVER_MARGIN), maxLeft);

    setActive({
      key,
      baseWidth,
      left,
      width,
      top: rect.bottom,
      bottom: window.innerHeight - rect.top,
      // しっぽはマーカーを指したまま、カードの角に食い込まない範囲で
      tailLeft: Math.min(Math.max(center - left, 18), width - 18),
      // 下半分のマーカーは、下に出すと画面外になりやすいので上に出す
      placement: rect.bottom > window.innerHeight * 0.55 ? "above" : "below",
    });
  }, []);

  // スクロールや回転で位置がずれるので測り直す
  useEffect(() => {
    if (!activeMark) return;

    let frame = 0;
    const reposition = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const element = activeElementRef.current;
        if (element) openMark(activeMark, element, activeBaseWidth);
      });
    };

    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [activeMark, activeBaseWidth, openMark]);

  const toggleMark = (key: string, element: HTMLElement, width: number) => {
    if (activeMark === key) {
      setActive(null);
      return;
    }
    openMark(key, element, width);
  };

  /** 吹き出しの外枠。fixed なので、マーカーがどこにあっても画面内に収まる */
  const popoverStyle = (key: string): React.CSSProperties | undefined => {
    if (active?.key !== key) return undefined;
    return active.placement === "above"
      ? { position: "fixed", left: active.left, bottom: active.bottom, width: active.width }
      : { position: "fixed", left: active.left, top: active.top, width: active.width };
  };

  const marks: Mark[] = [
    ...(notes || []).map((note): Mark => ({ kind: "fact", anchor: note.anchor, note })),
    ...(softNotes || []).map((note): Mark => ({ kind: "soft", anchor: note.anchor, note })),
  ];

  if (!marks.length) return <>{content}</>;

  const parts: ReactNode[] = [];
  let cursor = 0;

  const orderedMarks = marks
    .map((mark) => ({ mark, position: content.indexOf(mark.anchor, 0) }))
    .filter((m) => m.position !== -1)
    .sort((a, b) => a.position - b.position);

  orderedMarks.forEach(({ mark }, index) => {
    const position = content.indexOf(mark.anchor, cursor);
    if (position === -1) return;

    const end = position + mark.anchor.length;
    const key = `${mark.kind}-${mark.anchor}-${index}`;
    parts.push(content.slice(cursor, position));

    if (mark.kind === "fact") {
      const note = mark.note;
      const width = compact ? POPOVER_WIDTH_COMPACT : POPOVER_WIDTH;
      parts.push(
        <span
          key={key}
          data-annotated-mark
          className="relative inline cursor-help rounded-sm bg-amber-100 px-0.5 font-semibold decoration-amber-500 decoration-2 underline underline-offset-2 transition-colors hover:bg-amber-200"
          onMouseEnter={
            canHover ? (e) => openMark(key, e.currentTarget, width) : undefined
          }
          onMouseLeave={canHover ? () => setActive(null) : undefined}
          onClick={(e) => toggleMark(key, e.currentTarget, width)}
        >
          {mark.anchor}
          <span
            style={popoverStyle(key)}
            className={`z-50 ${
              active?.key === key && active.placement === "above" ? "pb-2" : "pt-2"
            } ${activeMark === key ? "block" : "hidden"} ${compact ? "text-xs" : "text-sm"}`}
          >
            <span className="block rounded-md border border-red-200 bg-white p-4 text-left font-normal leading-relaxed text-red-700 shadow-lg">
              {note.imageUrl && (
                <img
                  src={note.imageUrl}
                  alt="補足イメージ"
                  className="mb-2 h-24 w-full rounded object-cover"
                />
              )}
              {note.text}
            </span>
          </span>
        </span>
      );
    } else {
      const note = mark.note;
      parts.push(
        <span
          key={key}
          data-annotated-mark
          className="relative inline cursor-pointer bg-[linear-gradient(transparent_62%,#f7e3b4_62%)] pb-px group"
          onMouseEnter={
            canHover ? (e) => openMark(key, e.currentTarget, POPOVER_WIDTH) : undefined
          }
          onMouseLeave={canHover ? () => setActive(null) : undefined}
          onClick={(e) => {
            e.stopPropagation();
            if (onSelectSoftNote) {
              onSelectSoftNote(note);
              return;
            }
            toggleMark(key, e.currentTarget, POPOVER_WIDTH);
          }}
        >
          {mark.anchor}
          {/* 本文と吹き出しの隙間は pt/pb で作る。margin だと間にカーソルが落ちて消えてしまう */}
          <span
            style={popoverStyle(key)}
            className={`z-50 ${
              active?.key === key && active.placement === "above" ? "pb-3" : "pt-3"
            } ${activeMark === key ? "block animate-in fade-in" : "hidden"}`}
          >
            <span
              className={`relative block rounded-md border border-[#e2d2b6] bg-[#fbf6ee] px-5 py-4 text-left shadow-xl transition-all ${
                onSelectSoftNote ? "cursor-pointer hover:border-[#d9bf94]" : "cursor-default"
              }`}
            >
              {/* しっぽはマーカー側の辺に出し、横に寄せた分だけ戻してマーカーを指す */}
              <span
                style={active?.key === key ? { left: active.tailLeft } : undefined}
                className={`absolute h-3 w-3 -translate-x-1/2 rotate-45 border-[#e2d2b6] bg-[#fbf6ee] ${
                  active?.key === key && active.placement === "above"
                    ? "-bottom-[7px] border-r border-b"
                    : "-top-[7px] border-t border-l"
                }`}
              />
              {note.imageUrl && (
                <img
                  src={note.imageUrl}
                  alt="広報補足画像"
                  className="mb-3 h-28 w-full rounded-sm object-cover border border-[#e2d2b6]"
                />
              )}
              <span className="mb-2 flex items-center justify-between text-[11px] font-bold tracking-wide text-[#a8703a]">
                <span>広報担当より</span>
                {onSelectSoftNote && (
                  <span className="rounded-full bg-amber-600 px-2 py-0.5 text-[10px] font-bold text-white">
                    クリックで編集
                  </span>
                )}
              </span>
              <span className="block text-[13.5px] leading-relaxed text-[#443b2e] text-wrap-pretty">
                {note.comment || "（コメント未入力 - クリックして入力）"}
              </span>
            </span>
          </span>
        </span>
      );
    }

    cursor = end;
  });

  parts.push(content.slice(cursor));
  return <>{parts}</>;
}

