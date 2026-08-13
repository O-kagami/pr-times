/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, type ReactNode } from "react";
import { InlineNote } from "@/data/pressReleases";

interface AnnotatedContentProps {
  content: string;
  notes?: InlineNote[];
  compact?: boolean;
}

export function AnnotatedContent({ content, notes, compact = false }: AnnotatedContentProps) {
  const [activeNote, setActiveNote] = useState<number | null>(null);

  if (!notes?.length) return content;

  const parts: ReactNode[] = [];
  let cursor = 0;

  const orderedNotes = [...notes].sort(
    (a, b) => content.indexOf(a.anchor) - content.indexOf(b.anchor)
  );

  orderedNotes.forEach((note, index) => {
    const position = content.indexOf(note.anchor, cursor);
    if (position === -1) return;

    const end = position + note.anchor.length;
    parts.push(content.slice(cursor, position));
    parts.push(
      <span
        key={`${note.anchor}-${index}`}
        className="relative inline cursor-help rounded-sm bg-amber-100 px-0.5 font-semibold decoration-amber-500 decoration-2 underline underline-offset-2 transition-colors hover:bg-amber-200"
        onMouseEnter={() => setActiveNote(index)}
        onMouseLeave={() => setActiveNote(null)}
      >
        {note.anchor}
        <span
          className={`absolute left-0 top-full z-30 mt-2 rounded-md border border-red-200 bg-white p-3 text-left font-normal leading-relaxed text-red-700 shadow-lg ${
            activeNote === index ? "block" : "hidden"
          } ${
            compact ? "w-64 text-xs" : "w-80 text-sm"
          }`}
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
    cursor = end;
  });

  parts.push(content.slice(cursor));
  return <>{parts}</>;
}
