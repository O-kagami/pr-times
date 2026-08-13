"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { CategoryNav } from "@/components/CategoryNav";
import { RankingSection } from "@/components/RankingSection";
import { PressReleaseCard } from "@/components/PressReleaseCard";
import { Sidebar } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { PressReleaseModal } from "@/components/PressReleaseModal";
import {
  PRESS_RELEASES,
  PRTIMES_ANNOUNCEMENTS,
  CATEGORIES,
  PressRelease,
} from "@/data/pressReleases";
import { Filter, ChevronDown, Info } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedRelease, setSelectedRelease] = useState<PressRelease | null>(null);
  const [pressReleases, setPressReleases] = useState<PressRelease[]>(PRESS_RELEASES);

  useEffect(() => {
    let isActive = true;

    const fetchPressReleases = async () => {
      try {
        const response = await fetch("/api/press-releases", { cache: "no-store" });
        if (!response.ok) {
          return;
        }

        const json = (await response.json()) as { data?: PressRelease[] };
        if (isActive && Array.isArray(json.data) && json.data.length > 0) {
          setPressReleases(json.data);
        }
      } catch (error) {
        console.error("Failed to load press releases", error);
      }
    };

    fetchPressReleases();
    return () => {
      isActive = false;
    };
  }, []);

  const filteredReleases = useMemo(() => {
    return pressReleases.filter((release) => {
      if (selectedCategory !== "all") {
        const catObj = CATEGORIES.find((c) => c.id === selectedCategory);
        if (catObj && release.category !== catObj.name) {
          return false;
        }
      }

      if (activeKeyword && !release.keywords.includes(activeKeyword)) {
        return false;
      }

      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const inTitle = release.title.toLowerCase().includes(q);
        const inCompany = release.company.toLowerCase().includes(q);
        const inContent = release.content.toLowerCase().includes(q);
        const inKw = release.keywords.some((k) => k.toLowerCase().includes(q));
        return inTitle || inCompany || inContent || inKw;
      }

      return true;
    });
  }, [searchQuery, selectedCategory, activeKeyword, pressReleases]);

  const visibleReleases = filteredReleases.slice(0, visibleCount);
  const hasMore = visibleCount < filteredReleases.length;
  const currentCategoryName =
    CATEGORIES.find((c) => c.id === selectedCategory)?.name || "総合";

  return (
    <div className="flex flex-col bg-[#f5f6f8] min-h-screen font-sans text-gray-900">
      <Header
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setVisibleCount(8);
        }}
      />

      <CategoryNav
        selectedCategory={selectedCategory}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          setVisibleCount(8);
        }}
      />

      <RankingSection
        pressReleases={pressReleases}
        onSelectRelease={(rel) => setSelectedRelease(rel)}
      />

      <main className="flex-1 mx-auto px-4 py-6 w-full max-w-[1200px]">
        <div className="mb-4 rounded border border-sky-200 bg-sky-50 px-4 py-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs sm:text-sm text-[#1f3a5f]">
              DB の <strong>company_name</strong> 一覧を確認できます。
            </p>
            <Link
              href="/company-names"
              className="inline-flex items-center justify-center rounded border border-[#0066cc] bg-white px-4 py-1.5 text-xs font-bold text-[#0066cc] hover:bg-sky-100"
            >
              company_name 一覧を見る
            </Link>
          </div>
        </div>

        <div className="items-start gap-8 grid grid-cols-1 lg:grid-cols-12">
          <section className="flex flex-col gap-4 lg:col-span-8">
            <div className="flex justify-between items-center bg-white shadow-xs p-3.5 border border-gray-200 rounded">
              <div className="flex items-center gap-2">
                <h1 className="flex items-center gap-2 font-extrabold text-[#182b45] text-lg">
                  <span>新着プレスリリース</span>
                  <span className="font-normal text-gray-500 text-xs">
                    （{currentCategoryName}）
                  </span>
                </h1>

                {(selectedCategory !== "all" || activeKeyword || searchQuery) && (
                  <span className="flex items-center gap-1 bg-sky-100 px-2 py-0.5 rounded font-medium text-[#0066cc] text-xs">
                    <Filter className="w-3 h-3" />
                    絞り込み中
                  </span>
                )}
              </div>

              {(selectedCategory !== "all" || activeKeyword || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setActiveKeyword(null);
                    setSearchQuery("");
                  }}
                  className="font-medium text-[#0066cc] text-xs hover:underline"
                >
                  条件をクリア
                </button>
              )}
            </div>

            {visibleReleases.length > 0 ? (
              <div className="flex flex-col gap-3">
                {visibleReleases.map((release) => (
                  <PressReleaseCard
                    key={release.id}
                    release={release}
                    onClick={() => setSelectedRelease(release)}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 border border-gray-200 rounded text-center">
                <p className="text-gray-500 text-sm">
                  該当するプレスリリースが見つかりませんでした。
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setActiveKeyword(null);
                    setSearchQuery("");
                  }}
                  className="bg-[#0066cc] hover:bg-[#0055b8] mt-3 px-4 py-1.5 rounded font-bold text-white text-xs"
                >
                  すべてのニュースを見る
                </button>
              </div>
            )}

            {hasMore && (
              <div className="my-4 text-center">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="flex justify-center items-center gap-1.5 bg-white hover:bg-sky-50 shadow-xs mx-auto px-6 py-2.5 border border-[#0066cc] rounded-full w-full sm:w-64 font-bold text-[#0066cc] text-xs transition-all"
                >
                  <span>もっと見る</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="bg-white mt-6 p-4 border border-gray-200 rounded">
              <div className="flex items-center gap-1.5 mb-3 pb-2 border-gray-100 border-b font-bold text-gray-800 text-xs">
                <Info className="w-4 h-4 text-[#0066cc]" />
                <span>PR TIMESからのお知らせ</span>
              </div>
              <ul className="space-y-2 text-xs">
                {PRTIMES_ANNOUNCEMENTS.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex sm:flex-row flex-col sm:items-center gap-1 sm:gap-4 text-gray-700 hover:text-[#0066cc] transition-colors"
                  >
                    <span className="font-mono text-[11px] text-gray-400 shrink-0">
                      {item.date}
                    </span>
                    <a href={item.link} className="flex-1 hover:underline truncate">
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="lg:col-span-4">
            <Sidebar
              activeKeyword={activeKeyword}
              onSelectKeyword={(kw) => {
                setActiveKeyword(kw);
                setVisibleCount(8);
              }}
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                setVisibleCount(8);
              }}
            />
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
