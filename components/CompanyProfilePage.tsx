/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Bell,
  Building2,
  CalendarDays,
  Clock3,
  ExternalLink,
  Globe,
  History,
  Link2,
  MapPin,
  Phone,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { CompanyDirectoryEntry } from "../data/companies";
import { CategoryNav } from "./CategoryNav";
import { Footer } from "./Footer";
import { Header } from "./Header";

export default function CompanyProfilePage({
  company,
}: {
  company: CompanyDirectoryEntry;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [following, setFollowing] = useState(false);

  const visibleReleases = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return company.releases.filter((release) => {
      if (selectedCategory !== "all" && release.category !== selectedCategory) return false;
      if (!query) return true;
      return [release.title, release.subtitle ?? "", ...release.keywords]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [company.releases, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-[#f7f8fa] text-gray-900">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <CategoryNav selectedCategory="all" onSelectCategory={() => {}} />

      <main className="mx-auto max-w-[1200px] px-4 py-8">
        <div className="mb-5 text-xs text-gray-500">
          <Link className="hover:text-[#0066cc]" href="/">PR TIMES トップ</Link>
          <span className="mx-2">/</span>
          <span>企業情報</span>
          <span className="mx-2">/</span>
          <strong className="text-gray-700">{company.name}</strong>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <section className="min-w-0">
            <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-xs md:p-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div className="grid h-28 w-28 shrink-0 place-items-center overflow-hidden rounded-xl border border-gray-200 bg-white p-3 md:h-36 md:w-36">
                  {company.logoUrl ? (
                    <img className="h-full w-full object-contain" src={company.logoUrl} alt={`${company.name} ロゴ`} />
                  ) : (
                    <div className="grid h-full w-full place-items-center rounded-lg bg-[#edf4fa] text-[#005bac]">
                      <Building2 className="h-12 w-12" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="mb-2 text-[10px] font-bold tracking-[0.16em] text-[#005bac]">COMPANY PROFILE</p>
                  <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">{company.name}</h1>
                  <p className="mt-4 text-sm leading-7 text-gray-700">{company.description}</p>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <button
                      className={`inline-flex h-11 items-center gap-2 rounded-md border px-5 text-sm font-bold transition-colors ${following ? "border-[#005bac] bg-[#eaf4fc] text-[#005bac]" : "border-[#005bac] bg-white text-[#005bac] hover:bg-[#f1f7fc]"}`}
                      onClick={() => setFollowing((value) => !value)}
                      type="button"
                    >
                      <Bell className="h-4 w-4" />
                      {following ? "フォロー中" : "フォローする"}
                    </button>
                    <a className="grid h-10 w-10 place-items-center rounded-full bg-black text-sm font-black text-white" href="#">X</a>
                    <a className="grid h-10 w-10 place-items-center rounded-full bg-[#1877f2] text-sm font-black text-white" href="#">f</a>
                    <a className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 bg-white text-[#0066cc]" href={company.website} target="_blank" rel="noreferrer">
                      <Link2 className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <Link
              className="group mt-6 block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs transition-all hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-xl"
              href={`/companies/${company.companyId}/history`}
            >
              <div
                className="relative h-[300px] bg-cover bg-center md:h-[390px]"
                style={{ backgroundImage: `linear-gradient(180deg, transparent 35%, rgb(8 24 38 / 75%) 100%), url("${company.coverImageUrl}")` }}
              >
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-6 text-white md:p-8">
                  <div>
                    <span className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/30 bg-black/25 px-3 py-1 text-[10px] font-bold backdrop-blur-sm">
                      <History className="h-3.5 w-3.5" /> 発信のアーカイブ
                    </span>
                    <p className="max-w-xl text-sm leading-6 text-white/85">これまで届けてきたニュースを、写真とともに振り返ります。</p>
                  </div>
                  <ExternalLink className="h-6 w-6 shrink-0 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
              <div className="flex items-center justify-between px-6 py-5 md:px-8">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.18em] text-[#0066cc]">PR ARCHIVE</p>
                  <h2 className="mt-1 text-2xl font-extrabold tracking-tight">HISTORYS</h2>
                </div>
                <span className="text-xs font-bold text-[#0066cc]">履歴を見る →</span>
              </div>
            </Link>

            <div className="mt-9 rounded-xl border border-gray-200 bg-white p-5 md:p-6">
              <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-bold tracking-[0.15em] text-[#0066cc]">PRESS RELEASES</p>
                  <h2 className="mt-1 text-xl font-extrabold">プレスリリース</h2>
                </div>
                <label className="flex h-10 items-center gap-2 rounded-md border border-gray-300 px-3 text-gray-500">
                  <Search className="h-4 w-4" />
                  <input
                    className="w-56 border-0 bg-transparent text-xs outline-none"
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="キーワードで検索"
                    value={searchQuery}
                  />
                </label>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {["all", ...new Set(company.releases.map((release) => release.category))].map((category) => (
                  <button
                    className={`rounded-full px-3 py-1.5 text-[10px] font-bold ${selectedCategory === category ? "bg-[#182b45] text-white" : "bg-gray-100 text-gray-600"}`}
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    type="button"
                  >
                    {category === "all" ? "すべて" : category}
                  </button>
                ))}
              </div>
              <div className="mt-2 divide-y divide-gray-200">
                {visibleReleases.map((release) => (
                  <article className="grid gap-4 py-5 sm:grid-cols-[1fr_180px]" key={release.id}>
                    <div>
                      <div className="mb-2 flex items-center gap-2 text-[10px] text-gray-500">
                        <span className="font-bold text-[#0066cc]">{release.category}</span>
                        <Clock3 className="h-3.5 w-3.5" /> {release.publishedAt}
                      </div>
                      <Link className="text-base font-bold leading-7 hover:text-[#0066cc]" href={`/companies/${release.companyId}/releases/${release.id}`}>{release.title}</Link>
                      {release.subtitle && <p className="mt-2 line-clamp-2 text-xs leading-5 text-gray-600">{release.subtitle}</p>}
                    </div>
                    <Link href={`/companies/${release.companyId}/releases/${release.id}`}>
                      <img className="aspect-video h-full w-full rounded-md object-cover" src={release.imageUrl} alt={release.title} />
                    </Link>
                  </article>
                ))}
                {visibleReleases.length === 0 && <p className="py-12 text-center text-sm text-gray-500">該当するプレスリリースはありません。</p>}
              </div>
            </div>
          </section>

          <aside className="self-start rounded-xl border border-gray-200 bg-white p-5 shadow-xs lg:sticky lg:top-24">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <h2 className="text-lg font-extrabold text-[#244f82]">企業情報</h2>
              <span className="text-[10px] text-gray-400">最終更新 {company.lastUpdated}</span>
            </div>
            <dl className="divide-y divide-gray-200 text-sm">
              {[
                ["業種", company.industry],
                ["本社所在地", company.location],
                ["電話番号", company.phone],
                ["代表者名", company.representative],
                ["資本金", company.capital],
                ["設立", company.established],
              ].map(([label, value]) => (
                <div className="grid grid-cols-[92px_1fr] gap-3 py-4" key={label}>
                  <dt className="font-bold">{label}</dt>
                  <dd className="leading-6 text-gray-700">{value}</dd>
                </div>
              ))}
            </dl>
            <div className="space-y-3 border-t border-gray-200 pt-5 text-xs">
              <a className="flex items-center gap-2 text-[#0066cc] hover:underline" href={company.website} target="_blank" rel="noreferrer"><Globe className="h-4 w-4" />公式サイト</a>
              <span className="flex items-center gap-2 text-gray-600"><MapPin className="h-4 w-4" />{company.location}</span>
              <span className="flex items-center gap-2 text-gray-600"><Phone className="h-4 w-4" />{company.phone}</span>
              <span className="flex items-center gap-2 text-gray-600"><CalendarDays className="h-4 w-4" />{company.established}</span>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
