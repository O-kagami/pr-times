import React from "react";
import Link from "next/link";
import { ArrowRight, Images } from "lucide-react";
import type { AdminRelease } from "@/lib/adminCompany";

/**
 * ヒストリー（/companies/[companyId]/history）への入口。
 * これまでのPRを写真で振り返るスライドショーへ誘導する。
 */
export function HistoryInvite({
  companyId,
  releases,
  yearsLabel,
}: {
  companyId: string;
  releases: AdminRelease[];
  yearsLabel: string | null;
}) {
  const thumbnails = releases
    .filter((release) => release.imageUrl)
    .slice(0, 4);

  return (
    <section className="relative bg-[#4a332b] p-6 sm:p-8 rounded-3xl overflow-hidden text-white">
      <div className="flex md:flex-row flex-col md:items-center gap-6">
        <div className="flex-1 min-w-0">
          <span className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full font-medium text-[11px]">
            <Images className="w-3.5 h-3.5" />
            ヒストリー
          </span>

          <h2 className="mt-3 font-extrabold text-xl sm:text-2xl leading-snug">
            これまでのPRを、スライドショーで振り返る
          </h2>

          <p className="mt-2 max-w-lg text-white/70 text-[13px] leading-relaxed">
            {yearsLabel
              ? `${yearsLabel}のあいだに書いてきた${releases.length}本を、写真と一緒に順番に見返せます。`
              : "書いてきたリリースを、写真と一緒に順番に見返せます。"}
            自分たちの歩みは、次の1本のいちばんの材料になります。
          </p>

          <Link
            href={`/companies/${companyId}/history`}
            className="inline-flex items-center gap-2 bg-[#ffd24d] hover:bg-[#ffcf3b] mt-5 px-5 py-2.5 rounded-full font-bold text-[#4a332b] text-[13px] transition-colors"
          >
            ヒストリーを見る
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {thumbnails.length > 0 && (
          <div className="flex md:justify-end -space-x-6 shrink-0">
            {thumbnails.map((release, index) => (
              <div
                key={release.key}
                className="bg-[#5c4136] shadow-lg border-4 border-[#4a332b] rounded-2xl w-24 sm:w-28 h-24 sm:h-28 overflow-hidden"
                style={{ transform: `rotate(${(index - 1.5) * 4}deg)` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={release.imageUrl as string}
                  alt={release.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
