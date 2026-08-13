"use client";

import { useState, type ReactNode } from "react";
import { SoftPrNote } from "@/data/pressReleases";

interface SoftPrNoteContentProps {
  content: string;
  notes?: SoftPrNote[];
}

export function SoftPrNoteContent({ content, notes }: SoftPrNoteContentProps) {
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
        className="relative inline cursor-help bg-[linear-gradient(transparent_62%,#f7e3b4_62%)] pb-px"
        onMouseEnter={() => setActiveNote(index)}
        onMouseLeave={() => setActiveNote(null)}
      >
        {note.anchor}
        <span
          className={`absolute top-[calc(100%+12px)] left-0 z-20 w-80 max-w-[92vw] border border-[#e2d2b6] bg-[#fbf6ee] p-4 text-left shadow-lg cursor-default ${
            activeNote === index ? "block" : "hidden"
          }`}
        >
          <span className="absolute -top-[7px] left-6 h-3 w-3 rotate-45 border-t border-l border-[#e2d2b6] bg-[#fbf6ee]" />
          <span className="mb-2 block text-[11px] font-bold tracking-wide text-[#a8703a]">
            広報担当より
          </span>
          <span className="block text-[13.5px] leading-relaxed text-[#443b2e] text-wrap-pretty">
            {note.comment}
          </span>
        </span>
      </span>
    );
    cursor = end;
  });

  parts.push(content.slice(cursor));
  return <>{parts}</>;
}
