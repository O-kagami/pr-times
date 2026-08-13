import React from "react";
import Link from "next/link";
import { Eye, Heart, PenLine } from "lucide-react";
import type { AdminRelease } from "@/lib/adminCompany";

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "long", day: "numeric" }).format(
    date
  );

/** 自分たちが出したPRの一覧。文字より写真が先に目に入るようにカードで並べる */
export function MyReleases({
  companyId,
  releases,
}: {
  companyId: string;
  releases: AdminRelease[];
}) {
  return (
    <section>
      <div className="flex justify-between items-end mb-3">
        <div>
          <h2 className="font-extrabold text-[#4a332b] text-lg">わたしたちのPR</h2>
          <p className="mt-0.5 text-[#a98a76] text-[12px]">
            これまでに出した{releases.length}本。写真をたどると、そのときの空気を思い出せます。
          </p>
        </div>
        <Link
          href={`/admin/companies/${companyId}/press-releases/new`}
          className="hidden sm:flex items-center gap-1.5 bg-[#e0714c] hover:bg-[#cf6242] px-3.5 py-2 rounded-full font-bold text-white text-[12px] transition-colors"
        >
          <PenLine className="w-3.5 h-3.5" />
          新しく書く
        </Link>
      </div>

      {releases.length === 0 ? (
        <div className="bg-white p-10 border border-[#f0e2d6] border-dashed rounded-2xl text-center">
          <p className="text-[#a98a76] text-[13px]">
            まだ1本もありません。最初のPRを書いてみましょう。
          </p>
        </div>
      ) : (
        <div className="gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {releases.map((release) => (
            <Link
              key={release.key}
              href={release.href}
              className="group flex flex-col bg-white hover:shadow-[0_8px_24px_rgba(190,140,100,0.14)] border border-[#f0e2d6] rounded-2xl overflow-hidden transition-all duration-200"
            >
              <div className="relative bg-[#f7ece3] aspect-[16/9] overflow-hidden">
                {release.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={release.imageUrl}
                    alt={release.title}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex justify-center items-center w-full h-full text-[#d6bda9] text-xs">
                    画像なし
                  </div>
                )}
                <span className="bottom-2 left-2 absolute bg-white/90 px-2 py-0.5 rounded-full font-medium text-[#7a5c4d] text-[10px]">
                  {formatDate(release.publishedAt)}
                </span>
              </div>

              <div className="flex flex-col flex-1 p-4">
                <h3 className="font-bold text-[#4a332b] text-[13px] leading-relaxed line-clamp-3">
                  {release.title}
                </h3>

                <div className="flex items-center gap-3 mt-auto pt-3 text-[#a98a76] text-[11px]">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {release.pageView.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" />
                    {release.likeCount.toLocaleString()}
                  </span>
                  {release.keywords.slice(0, 2).map((keyword) => (
                    <span
                      key={keyword}
                      className="bg-[#f7ece3] px-1.5 py-0.5 rounded text-[#a98a76] text-[10px]"
                    >
                      #{keyword}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
