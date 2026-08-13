"use client";

import React, { useState, useMemo } from "react";
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
import { Filter, ChevronDown, Info, ExternalLink } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [activeKeyword, setActiveKeyword] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(8);
  const [selectedRelease, setSelectedRelease] = useState<PressRelease | null>(
    null
  );

  // Filter press releases based on search, category, and active keyword
  const filteredReleases = useMemo(() => {
    return PRESS_RELEASES.filter((release) => {
      // Category filter
      if (selectedCategory !== "all") {
        const catObj = CATEGORIES.find((c) => c.id === selectedCategory);
        if (catObj && release.category !== catObj.name) {
          return false;
        }
      }

      // Keyword filter
      if (activeKeyword && !release.keywords.includes(activeKeyword)) {
        return false;
      }

      // Search query filter
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
  }, [searchQuery, selectedCategory, activeKeyword]);

  const visibleReleases = filteredReleases.slice(0, visibleCount);
  const hasMore = visibleCount < filteredReleases.length;

  const currentCategoryName =
    CATEGORIES.find((c) => c.id === selectedCategory)?.name || "総合";

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-gray-900 flex flex-col font-sans">
      {/* 1. Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          setVisibleCount(8);
        }}
      />

      {/* 2. Horizontal Category Nav */}
      <CategoryNav
        selectedCategory={selectedCategory}
        onSelectCategory={(catId) => {
          setSelectedCategory(catId);
          setVisibleCount(8);
        }}
      />

      {/* 3. Top Ranking Section (1-6 Ranking Carousel) */}
      <RankingSection
        pressReleases={PRESS_RELEASES}
        onSelectRelease={(rel) => setSelectedRelease(rel)}
      />

      {/* 4. Main Body Content (2 Columns: Main 70% + Sidebar 30%) */}
      <main className="max-w-[1200px] mx-auto w-full px-4 py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Feed Column (8 cols on desktop) */}
          <section className="lg:col-span-8 flex flex-col gap-4">
            {/* Feed Section Title */}
            <div className="bg-white p-3.5 rounded border border-gray-200 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold text-[#182b45] flex items-center gap-2">
                  <span>新着プレスリリース</span>
                  <span className="text-xs font-normal text-gray-500">
                    （{currentCategoryName}）
                  </span>
                </h1>

                {(selectedCategory !== "all" || activeKeyword || searchQuery) && (
                  <span className="text-xs bg-sky-100 text-[#0066cc] font-medium px-2 py-0.5 rounded flex items-center gap-1">
                    <Filter className="w-3 h-3" />
                    絞り込み中
                  </span>
                )}
              </div>

              {/* Reset Filters button */}
              {(selectedCategory !== "all" || activeKeyword || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setActiveKeyword(null);
                    setSearchQuery("");
                  }}
                  className="text-xs text-[#0066cc] hover:underline font-medium"
                >
                  条件をクリア
                </button>
              )}
            </div>

            {/* Press Release Cards List */}
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
              <div className="bg-white rounded p-8 text-center border border-gray-200">
                <p className="text-gray-500 text-sm">
                  該当するプレスリリースが見つかりませんでした。
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setActiveKeyword(null);
                    setSearchQuery("");
                  }}
                  className="mt-3 px-4 py-1.5 bg-[#0066cc] text-white text-xs font-bold rounded hover:bg-[#0055b8]"
                >
                  すべてのニュースを見る
                </button>
              </div>
            )}

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center my-4">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="w-full sm:w-64 py-2.5 px-6 bg-white hover:bg-sky-50 text-[#0066cc] border border-[#0066cc] font-bold text-xs rounded-full shadow-xs transition-all flex items-center justify-center gap-1.5 mx-auto"
                >
                  <span>もっと見る</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* PR TIMES Announcements Section */}
            <div className="mt-6 bg-white rounded border border-gray-200 p-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 border-b border-gray-100 pb-2 mb-3">
                <Info className="w-4 h-4 text-[#0066cc]" />
                <span>PR TIMESからのお知らせ</span>
              </div>
              <ul className="space-y-2 text-xs">
                {PRTIMES_ANNOUNCEMENTS.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-gray-700 hover:text-[#0066cc] transition-colors"
                  >
                    <span className="text-gray-400 font-mono text-[11px] shrink-0">
                      {item.date}
                    </span>
                    <a href={item.link} className="hover:underline flex-1 truncate">
                      {item.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Right Sidebar Column (4 cols on desktop) */}
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

      {/* 5. Footer */}
      <Footer />

      {/* 6. Detail Viewer Modal */}
      <PressReleaseModal
        release={selectedRelease}
        onClose={() => setSelectedRelease(null)}
      />
    </div>
  );
}
