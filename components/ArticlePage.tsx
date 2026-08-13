"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/Header";
import { CategoryNav } from "@/components/CategoryNav";
import { Footer } from "@/components/Footer";
import { StandardArticleContent } from "@/components/StandardArticleContent";
import { SoftPressReleaseView } from "@/components/SoftPressReleaseView";
import { PressRelease, PRESS_RELEASES } from "@/data/pressReleases";
import {
  Building2,
  Heart,
  Share2,
  Download,
  ChevronRight,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface ArticlePageProps {
  release: PressRelease;
}

type ViewTab = "content" | "soft";

export const ArticlePage: React.FC<ArticlePageProps> = ({ release }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [likes, setLikes] = useState(release.likesCount || 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<ViewTab>(
    searchParams.get("mode") === "soft" ? "soft" : "content"
  );

  const handleTabChange = (tab: ViewTab) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    if (tab === "soft") {
      params.set("mode", "soft");
    } else {
      params.delete("mode");
    }
    const query = params.toString();
    router.replace(query ? `?${query}` : "?", { scroll: false });
  };

  const handleLike = () => {
    if (hasLiked) {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    }
  };

  // Filter related releases
  const companyReleases = PRESS_RELEASES.filter(
    (r) => r.company === release.company && r.id !== release.id
  );
  const relatedReleases = PRESS_RELEASES.filter(
    (r) => r.category === release.category && r.id !== release.id
  );

  return (
    <div className="min-h-screen bg-[#f5f6f8] text-gray-900 flex flex-col font-sans">
      {/* 1. Header & Navigation */}
      <Header searchQuery="" onSearchChange={() => {}} />
      <CategoryNav selectedCategory="all" onSelectCategory={() => {}} />

      {/* 2. Breadcrumbs & Top Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 py-2 flex items-center justify-between text-xs text-gray-500 overflow-x-auto">
          <nav className="flex items-center gap-1.5 min-w-max">
            <Link href="/" className="hover:text-[#0066cc] flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              <span>PR TIMES トップ</span>
            </Link>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="hover:text-[#0066cc] cursor-pointer">{release.category}</span>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="hover:text-[#0066cc] cursor-pointer truncate max-w-[150px]">
              {release.company}
            </span>
            <ChevronRight className="w-3 h-3 text-gray-400" />
            <span className="text-gray-800 font-medium">プレスリリース</span>
          </nav>

          <div className="hidden md:flex items-center gap-3 shrink-0">
            <span className="text-[11px] text-gray-400">配信日時：{release.publishedAt}</span>
          </div>
        </div>
      </div>

      {/* 3. Main Article Body Container */}
      <main className="max-w-[1200px] mx-auto w-full px-4 py-6 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left / Center Article Main Column (8 cols) */}
          <article className="lg:col-span-8 bg-white border border-gray-200 rounded-lg p-4 md:p-8 shadow-xs">
            {/* Action Bar (Top of Article) */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-gray-200 text-xs">
              <div className="flex items-center gap-2">
                <span className="bg-[#0066cc] text-white font-bold px-2.5 py-1 rounded text-xs">
                  {release.category}
                </span>
                <span className="text-gray-500">{release.timestamp}</span>
              </div>

              {/* Social Share & Download Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-bold transition-all ${
                    hasLiked
                      ? "bg-rose-50 border-rose-300 text-rose-600"
                      : "bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${hasLiked ? "fill-rose-600" : ""}`} />
                  <span>いいね！ {likes}</span>
                </button>

                <button
                  onClick={() => alert("ツイート用リンクをコピーしました")}
                  className="flex items-center gap-1 px-3 py-1 bg-sky-500 hover:bg-sky-600 text-white rounded text-xs font-bold transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>ツイート</span>
                </button>

                <button
                  onClick={() => alert("プレスリリース素材のダウンロードを開始します")}
                  className="flex items-center gap-1 px-3 py-1 bg-[#182b45] hover:bg-[#243d61] text-white rounded text-xs font-bold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>素材DL</span>
                </button>
              </div>
            </div>

            {/* View Mode Tabs */}
            <div className="flex items-center gap-1 mb-6 border-b border-gray-200">
              <button
                onClick={() => handleTabChange("content")}
                className={`px-4 py-2.5 text-sm font-bold border-b-2 -mb-px transition-colors ${
                  activeTab === "content"
                    ? "border-[#0066cc] text-[#0066cc]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                公式リリース
              </button>
              <button
                onClick={() => handleTabChange("soft")}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold border-b-2 -mb-px transition-colors ${
                  activeTab === "soft"
                    ? "border-[#a8703a] text-[#a8703a]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                やわらかいPR
              </button>
            </div>

            {activeTab === "soft" && release.softPr ? (
              <SoftPressReleaseView release={release} />
            ) : (
              <StandardArticleContent release={release} />
            )}

            {/* Bottom Social Share Bar */}
            <div className="p-4 bg-[#182b45] text-white rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <span className="text-xs text-sky-300 block font-bold">このプレスリリースを共有</span>
                <span className="text-[11px] text-gray-300">SNSやメッセージで最新ニュースをお届け</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-bold transition-colors"
                >
                  <Heart className="w-4 h-4 fill-white" />
                  <span>いいね！</span>
                </button>
                <button
                  onClick={() => alert("シェア用リンクをコピーしました")}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#0066cc] hover:bg-[#0055b8] text-white rounded text-xs font-bold transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>シェア</span>
                </button>
              </div>
            </div>
          </article>

          {/* Right Sidebar Column (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Company Info Box */}
            <div className="bg-white rounded border border-gray-200 p-4 shadow-xs">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                配信元企業
              </h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded bg-[#182b45] text-white font-bold flex items-center justify-center text-base shrink-0">
                  <Building2 className="w-6 h-6 text-sky-300" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-gray-900">{release.company}</h4>
                  <span className="text-[11px] text-gray-500">PR TIMES 認証企業</span>
                </div>
              </div>
              <button
                onClick={() => alert("企業フォロー登録を完了しました")}
                className="w-full py-2 bg-[#0066cc] hover:bg-[#0055b8] text-white text-xs font-bold rounded shadow transition-colors"
              >
                この企業をフォロー
              </button>
            </div>

            {/* Company's Other Releases */}
            {companyReleases.length > 0 && (
              <div className="bg-white rounded border border-gray-200 p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100">
                  {release.company} の最新プレスリリース
                </h3>
                <div className="space-y-3">
                  {companyReleases.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/companies/${rel.companyId}/releases/${rel.id}`}
                      className="block group space-y-1 pb-2 border-b border-gray-100 last:border-b-0"
                    >
                      <h4 className="text-xs font-bold text-gray-800 group-hover:text-[#0066cc] line-clamp-2 leading-snug">
                        {rel.title}
                      </h4>
                      <span className="text-[10px] text-gray-400">{rel.timestamp}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Releases in Same Category */}
            {relatedReleases.length > 0 && (
              <div className="bg-white rounded border border-gray-200 p-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100">
                  関連するプレスリリース（{release.category}）
                </h3>
                <div className="space-y-3">
                  {relatedReleases.slice(0, 3).map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/companies/${rel.companyId}/releases/${rel.id}`}
                      className="flex items-start gap-2 group pb-2 border-b border-gray-100 last:border-b-0"
                    >
                      <img
                        src={rel.imageUrl}
                        alt={rel.title}
                        className="w-16 h-12 object-cover rounded shrink-0 bg-gray-100"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-800 group-hover:text-[#0066cc] line-clamp-2 leading-snug">
                          {rel.title}
                        </h4>
                        <span className="text-[10px] text-gray-400 block mt-0.5">{rel.company}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </main>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
};
