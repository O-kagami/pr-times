import React from "react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import type { DbCompany, DbRelease } from "@/lib/companiesRepository";
import { Building2, Clock, Eye, Heart } from "lucide-react";

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);

/**
 * RDS の company / release テーブルを正とする企業ページ。
 * 数値の company_id（例: 163727）で使う。
 */
export function CompanyDbPage({
  company,
  releases,
}: {
  company: DbCompany;
  releases: DbRelease[];
}) {
  return (
    <div className="flex flex-col bg-[#f5f6f8] min-h-screen font-sans text-gray-900">
      <header className="top-0 z-40 sticky bg-[#182b45] shadow-md w-full text-white">
        <div className="flex items-center gap-3 mx-auto px-4 py-2.5 max-w-[1200px]">
          <Link href="/" className="group flex items-center gap-2">
            <span className="font-extrabold text-white group-hover:text-sky-300 text-2xl md:text-3xl tracking-tighter transition-colors">
              PR<span className="font-light text-sky-400">TIMES</span>
            </span>
          </Link>
          <span className="hidden md:inline-block pl-3 border-gray-600 border-l text-[11px] text-gray-300 leading-tight">
            プレスリリース・ニュースリリース配信サービス
          </span>
        </div>
      </header>

      <main className="flex-1 mx-auto px-4 py-6 w-full max-w-[1200px]">
        <div className="flex sm:flex-row flex-col sm:items-start gap-4 bg-white mb-6 p-5 border border-gray-200 rounded">
          <div className="flex justify-center items-center bg-sky-50 border border-sky-100 rounded w-14 h-14 shrink-0">
            <Building2 className="w-7 h-7 text-[#0066cc]" />
          </div>
          <div className="min-w-0">
            <h1 className="font-extrabold text-[#182b45] text-lg">{company.name}</h1>
            <p className="mt-0.5 text-gray-500 text-xs">
              プレスリリース {releases.length}件
              {company.industryName && ` ・ ${company.industryName}`}
            </p>
            {company.description && (
              <p className="mt-2 text-gray-700 text-xs leading-relaxed">
                {company.description}
              </p>
            )}
          </div>
        </div>

        <div className="items-start gap-8 grid grid-cols-1 lg:grid-cols-12">
          <section className="flex flex-col gap-3 lg:col-span-8">
            <h2 className="bg-white shadow-xs p-3.5 border border-gray-200 rounded font-extrabold text-[#182b45] text-lg">
              プレスリリース一覧
            </h2>

            {releases.length > 0 ? (
              releases.map((release) => (
                <article
                  key={release.releaseId}
                  className="flex sm:flex-row flex-col justify-between items-start gap-3 bg-white hover:shadow-md p-3.5 border border-gray-200 hover:border-sky-300 rounded transition-all duration-200"
                >
                  <div className="flex flex-col flex-1 justify-between min-w-0 h-full">
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1.5 text-[11px] text-gray-500">
                        <span className="flex items-center gap-1 text-gray-400">
                          <Clock className="w-3 h-3" />
                          {formatDate(release.createdAt)}
                        </span>
                        <span className="flex items-center gap-1 text-gray-400">
                          <Eye className="w-3 h-3" />
                          {release.pageView.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1 text-gray-400">
                          <Heart className="w-3 h-3" />
                          {release.likeCount.toLocaleString()}
                        </span>
                      </div>

                      <h3 className="font-bold text-gray-900 text-sm md:text-base leading-snug line-clamp-2">
                        {release.title}
                      </h3>

                      {release.subtitle && (
                        <p className="hidden sm:block mt-1 text-gray-600 text-xs line-clamp-2">
                          {release.subtitle}
                        </p>
                      )}
                    </div>

                    {release.keywords.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 mt-3 pt-2 border-gray-100 border-t text-[10px] text-gray-400">
                        {release.keywords.slice(0, 5).map((kw) => (
                          <span
                            key={kw}
                            className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600"
                          >
                            #{kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {release.mainImage && (
                    <div className="bg-gray-100 border border-gray-100 rounded w-full sm:w-36 md:w-40 aspect-video sm:aspect-4/3 overflow-hidden shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={release.mainImage}
                        alt={release.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                </article>
              ))
            ) : (
              <div className="bg-white p-8 border border-gray-200 rounded text-center">
                <p className="text-gray-500 text-sm">
                  プレスリリースが見つかりませんでした。
                </p>
              </div>
            )}
          </section>

          <section className="lg:col-span-4">
            <div className="bg-white p-4 border border-gray-200 rounded">
              <h3 className="mb-3 font-bold text-[#182b45] text-sm">企業情報</h3>
              <dl className="divide-y divide-gray-100 text-xs">
                <div className="flex gap-2 py-2">
                  <dt className="w-16 text-gray-500 shrink-0">代表者</dt>
                  <dd className="text-gray-800">{company.president || "-"}</dd>
                </div>
                <div className="flex gap-2 py-2">
                  <dt className="w-16 text-gray-500 shrink-0">所在地</dt>
                  <dd className="text-gray-800">{company.address || "-"}</dd>
                </div>
                <div className="flex gap-2 py-2">
                  <dt className="w-16 text-gray-500 shrink-0">電話番号</dt>
                  <dd className="text-gray-800">{company.phone || "-"}</dd>
                </div>
                <div className="flex gap-2 py-2">
                  <dt className="w-16 text-gray-500 shrink-0">設立</dt>
                  <dd className="text-gray-800">{company.foundationDate || "-"}</dd>
                </div>
                <div className="flex gap-2 py-2">
                  <dt className="w-16 text-gray-500 shrink-0">資本金</dt>
                  <dd className="text-gray-800">
                    {company.capital > 0 ? `${company.capital.toLocaleString()}万円` : "-"}
                  </dd>
                </div>
                <div className="flex gap-2 py-2">
                  <dt className="w-16 text-gray-500 shrink-0">業種</dt>
                  <dd className="text-gray-800">{company.industryName || "-"}</dd>
                </div>
                <div className="flex items-center gap-2 py-2">
                  <dt className="w-16 text-gray-500 shrink-0">URL</dt>
                  <dd className="text-[#0066cc] truncate">
                    {company.url ? (
                      <a
                        href={company.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {company.url}
                      </a>
                    ) : (
                      <span className="text-gray-800">-</span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
