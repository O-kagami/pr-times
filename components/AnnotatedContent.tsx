/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, type ReactNode } from "react";
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

export function AnnotatedContent({
  content,
  notes,
  softNotes,
  compact = false,
  onSelectSoftNote,
}: AnnotatedContentProps) {
  const [activeMark, setActiveMark] = useState<string | null>(null);

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
      parts.push(
        <span
          key={key}
          className="relative inline cursor-help rounded-sm bg-amber-100 px-0.5 font-semibold decoration-amber-500 decoration-2 underline underline-offset-2 transition-colors hover:bg-amber-200"
          onMouseEnter={() => setActiveMark(key)}
          onMouseLeave={() => setActiveMark(null)}
        >
          {mark.anchor}
          <span
            className={`absolute left-1/2 top-full z-30 mt-2 -translate-x-1/2 rounded-md border border-red-200 bg-white p-4 text-left font-normal leading-relaxed text-red-700 shadow-lg ${
              activeMark === key ? "block" : "hidden"
            } ${compact ? "w-64 max-w-[85vw] text-xs" : "w-80 max-w-[85vw] text-sm"}`}
          >
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
      );
    } else {
      const note = mark.note;
      parts.push(
        <span
          key={key}
          className="relative inline cursor-pointer bg-[linear-gradient(transparent_62%,#f7e3b4_62%)] pb-px group"
          onMouseEnter={() => setActiveMark(key)}
          onMouseLeave={() => setActiveMark(null)}
          onClick={(e) => {
            if (onSelectSoftNote) {
              e.stopPropagation();
              onSelectSoftNote(note);
            }
          }}
        >
          {mark.anchor}
          <span
            className={`absolute left-1/2 top-[calc(100%+12px)] z-30 w-80 max-w-[85vw] -translate-x-1/2 border border-[#e2d2b6] bg-[#fbf6ee] px-5 py-4 text-left shadow-xl cursor-default rounded-md transition-all ${
              activeMark === key ? "block animate-in fade-in" : "hidden"
            }`}
          >
            <span className="absolute -top-[7px] left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 border-t border-l border-[#e2d2b6] bg-[#fbf6ee]" />
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
                <span className="text-[10px] text-amber-700 underline font-normal">
                  クリックして編集 ✏️
                </span>
              )}
            </span>
            <span className="block text-[13.5px] leading-relaxed text-[#443b2e] text-wrap-pretty">
              {note.comment || "（コメント未入力 - クリックして入力）"}
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

