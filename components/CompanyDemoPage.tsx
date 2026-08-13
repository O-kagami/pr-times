"use client";

import React, { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PressReleaseCard } from "@/components/PressReleaseCard";
import { PressReleaseModal } from "@/components/PressReleaseModal";
import { PRESS_RELEASES, PressRelease } from "@/data/pressReleases";
import { ArrowRight, Building2, History } from "lucide-react";
import Link from "next/link";

/**
 * data/pressReleases.ts の静的データを正とするデモ用の企業ページ。
 * slug形式のcompanyId（例: seseragi）で使う。DBを正とする実装は CompanyPage を参照。
 */
export default function CompanyDemoPage({ companyId }: { companyId: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRelease, setSelectedRelease] = useState<PressRelease | null>(null);

  const companyReleases = useMemo(() => {
    return PRESS_RELEASES
      .filter((release) => release.companyId === companyId)
      .filter((release) => {
        if (searchQuery.trim() === "") {
          return true;
        }
        const q = searchQuery.toLowerCase();
        return (
          release.title.toLowerCase().includes(q) ||
          release.content.toLowerCase().includes(q) ||
          release.keywords.some((k) => k.toLowerCase().includes(q))
        );
      });
  }, [companyId, searchQuery]);

  const profile = companyReleases[0]?.companyProfile;
  const companyName = profile?.name || companyReleases[0]?.company || companyId;

  return (
    <div className="flex flex-col bg-[#f5f6f8] min-h-screen font-sans text-gray-900">
      <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="flex-1 mx-auto px-4 py-6 w-full max-w-[1200px]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-white mb-6 p-5 border border-gray-200 rounded">
          <div className="flex justify-center items-center bg-sky-50 border border-sky-100 rounded w-14 h-14 shrink-0">
            <Building2 className="w-7 h-7 text-[#0066cc]" />
          </div>
          <div className="flex-1">
            <h1 className="font-extrabold text-[#182b45] text-lg">{companyName}</h1>
            <p className="mt-0.5 text-gray-500 text-xs">
              プレスリリース {companyReleases.length}件
            </p>
          </div>
          {companyId === "seseragi" && (
            <Link
              className="inline-flex shrink-0 items-center gap-2 rounded bg-[#0d5960] px-4 py-3 text-xs font-bold text-white shadow-sm transition-colors hover:bg-[#087c84]"
              href="/companies/seseragi/history"
            >
              <History aria-hidden="true" className="h-4 w-4" />
              この会社のHISTORYを見る
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          )}
        </div>

        <div className="items-start gap-8 grid grid-cols-1 lg:grid-cols-12">
          <section className="flex flex-col gap-3 lg:col-span-8">
            <h2 className="bg-white shadow-xs p-3.5 border border-gray-200 rounded font-extrabold text-[#182b45] text-lg">
              プレスリリース一覧
            </h2>

            {companyReleases.length > 0 ? (
              companyReleases.map((release) => (
                <PressReleaseCard
                  key={release.id}
                  release={release}
                  onClick={() => setSelectedRelease(release)}
                />
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
              {profile ? (
                <dl className="divide-y divide-gray-100 text-xs">
                  <div className="flex gap-2 py-2">
                    <dt className="w-16 text-gray-500 shrink-0">代表者</dt>
                    <dd className="text-gray-800">{profile.representative}</dd>
                  </div>
                  <div className="flex gap-2 py-2">
                    <dt className="w-16 text-gray-500 shrink-0">所在地</dt>
                    <dd className="text-gray-800">{profile.address}</dd>
                  </div>
                  <div className="flex gap-2 py-2">
                    <dt className="w-16 text-gray-500 shrink-0">設立</dt>
                    <dd className="text-gray-800">{profile.established}</dd>
                  </div>
                  <div className="flex gap-2 py-2">
                    <dt className="w-16 text-gray-500 shrink-0">資本金</dt>
                    <dd className="text-gray-800">{profile.capital}</dd>
                  </div>
                  <div className="flex gap-2 py-2">
                    <dt className="w-16 text-gray-500 shrink-0">事業内容</dt>
                    <dd className="text-gray-800">{profile.business}</dd>
                  </div>
                  <div className="flex items-center gap-2 py-2">
                    <dt className="w-16 text-gray-500 shrink-0">URL</dt>
                    <dd className="text-[#0066cc] truncate">
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {profile.website}
                      </a>
                    </dd>
                  </div>
                </dl>
              ) : (
                <p className="text-gray-500 text-xs">企業情報は登録されていません。</p>
              )}
            </div>
          </section>
        </div>
      </main>

      <Footer />

      <PressReleaseModal
        release={selectedRelease}
        onClose={() => setSelectedRelease(null)}
      />
    </div>
  );
}
