/* eslint-disable @next/next/no-img-element */
"use client";

import { PressRelease } from "@/data/pressReleases";
import { SoftPrNoteContent } from "@/components/SoftPrNoteContent";
import Link from "next/link";

interface SoftPressReleaseViewProps {
  release: PressRelease;
}

export function SoftPressReleaseView({ release }: SoftPressReleaseViewProps) {
  const softPr = release.softPr;
  if (!softPr) return null;

  return (
    <div className="font-sans text-[#1a1a1a]">
      <div className="flex items-center justify-between gap-4 border-b border-[#e5e5e5] pb-4 mb-8">
        <Link className="text-sm font-bold hover:text-[#0066cc]" href={`/companies/${release.companyId}`}>{release.company}</Link>
        <span className="whitespace-nowrap text-xs text-[#666]">広報担当コメント付き版</span>
      </div>

      <h1 className="mb-6 text-2xl md:text-[28px] font-bold leading-relaxed text-wrap-pretty">
        {release.title}
      </h1>
      {release.subtitle && (
        <p className="mb-6 text-base font-bold leading-relaxed text-wrap-pretty">
          {release.subtitle}
        </p>
      )}
      <div className="mb-8 flex items-center gap-4">
        <Link className="text-sm font-bold hover:text-[#0066cc]" href={`/companies/${release.companyId}`}>{release.company}</Link>
        <span className="text-sm text-[#767676]">{release.publishedAt}</span>
      </div>

      <div className="mb-9 flex items-center gap-3.5 border border-[#ebdfcb] bg-[#fbf6ee] px-5 py-4">
        <div className="h-10 w-10 shrink-0 rounded-full border border-[#e0d5c0] bg-[repeating-linear-gradient(135deg,#efe7d9_0_6px,#e6dcc9_6px_12px)]" />
        <div>
          <div className="mb-1 text-xs font-bold">
            広報担当　{softPr.author.name}（{softPr.author.role}）
          </div>
          <p className="text-[13px] leading-relaxed text-[#574d40] text-wrap-pretty">
            本文中の
            <span className="bg-[linear-gradient(transparent_62%,#f7e3b4_62%)]">マーカー部分</span>
            にカーソルを合わせると、広報担当のコメントが表示されます。発表内容は公式リリースと同一です。
          </p>
        </div>
      </div>

      <div className="mb-11 whitespace-pre-line text-[15px] md:text-base leading-[1.95] text-wrap-pretty">
        <SoftPrNoteContent content={release.content} notes={softPr.notes} />
      </div>

      <div className="mb-11 aspect-video overflow-hidden border border-[#e5e5e5]">
        <img src={release.imageUrl} alt={release.title} className="h-full w-full object-cover" />
      </div>

      <div className="mb-8 border border-[#ebdfcb] bg-[#fbf6ee] px-6 py-9 md:px-10">
        <div className="mb-5 text-[13px] font-bold tracking-wide text-[#a8703a]">
          広報担当より　このリリースについて
        </div>
        <div className="flex flex-col gap-4">
          {softPr.reflection.map((paragraph, index) => (
            <p key={index} className="text-[15px] md:text-base leading-[1.95] text-[#362f26] text-wrap-pretty">
              {paragraph}
            </p>
          ))}
        </div>
        <div className="mt-7 flex items-center gap-3.5 border-t border-[#e8ddc9] pt-5">
          <div className="h-11 w-11 shrink-0 rounded-full border border-[#e0d5c0] bg-[repeating-linear-gradient(135deg,#efe7d9_0_6px,#e6dcc9_6px_12px)]" />
          <div className="text-sm leading-relaxed">
            <div className="font-bold">{softPr.author.name}</div>
            <div className="text-[13px] text-[#7a6f5e]">{softPr.author.role}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
