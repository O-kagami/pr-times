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
  Heart,
  Share2,
  MessageCircle,
  Link2,
  Download,
  ChevronRight,
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
    <div className="min-h-screen bg-white text-[#1a1a1a] flex flex-col font-sans">
      <Header searchQuery="" onSearchChange={() => {}} />
      <CategoryNav selectedCategory="all" onSelectCategory={() => {}} />

      {/* Breadcrumb */}
      <div className="border-b border-[#e5e5e5]">
        <div className="max-w-[900px] mx-auto px-4 py-2.5 flex items-center gap-1 text-xs text-[#767676] overflow-x-auto">
          <Link href="/" className="hover:text-[#0066cc] whitespace-nowrap">
            PR TIMES
          </Link>
          <ChevronRight className="w-3 h-3 text-[#ccc] shrink-0" />
          <span className="hover:text-[#0066cc] cursor-pointer whitespace-nowrap">
            {release.category}
          </span>
          <ChevronRight className="w-3 h-3 text-[#ccc] shrink-0" />
          <span className="text-[#767676] truncate">{release.company}</span>
        </div>
      </div>

      <main className="max-w-[900px] mx-auto w-full px-4 py-8 flex-1">
        {/* View Mode Tabs */}
        <div className="flex items-center gap-6 mb-8 border-b border-[#e5e5e5]">
          <button
            onClick={() => handleTabChange("content")}
            className={`py-2.5 text-sm font-bold border-b-2 -mb-px transition-colors ${
              activeTab === "content"
                ? "border-[#1a1a1a] text-[#1a1a1a]"
                : "border-transparent text-[#999] hover:text-[#1a1a1a]"
            }`}
          >
            公式リリース
          </button>
          <button
            onClick={() => handleTabChange("soft")}
            className={`flex items-center gap-1.5 py-2.5 text-sm font-bold border-b-2 -mb-px transition-colors ${
              activeTab === "soft"
                ? "border-[#a8703a] text-[#a8703a]"
                : "border-transparent text-[#999] hover:text-[#1a1a1a]"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            やわらかいPR
          </button>
        </div>

        <article>
          {activeTab === "content" && (
            <>
              {/* Byline */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-2 border-b border-[#e5e5e5] text-sm">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-[#1a1a1a]">{release.company}</span>
                  <time className="text-[#767676]">{release.publishedAt}</time>
                </div>

                <div className="flex items-center gap-1 text-[#1a1a1a]">
                  <button
                    onClick={handleLike}
                    aria-label="いいね"
                    className="flex items-center gap-1 px-2 py-1 hover:opacity-60 transition-opacity"
                  >
                    <Heart className={`w-4 h-4 ${hasLiked ? "fill-[#1a1a1a]" : ""}`} />
                    <span className="text-xs">{likes}</span>
                  </button>
                  <span className="w-px h-4 bg-[#e5e5e5] mx-1" aria-hidden="true" />
                  <button
                    onClick={() => alert("ツイート用リンクをコピーしました")}
                    aria-label="Xでシェア"
                    className="p-1.5 hover:opacity-60 transition-opacity"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => alert("LINEでシェアします")}
                    aria-label="LINEでシェア"
                    className="p-1.5 hover:opacity-60 transition-opacity"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  <span className="w-px h-4 bg-[#e5e5e5] mx-1" aria-hidden="true" />
                  <button
                    onClick={() => alert("プレスリリース素材のダウンロードを開始します")}
                    aria-label="素材ダウンロード"
                    className="p-1.5 hover:opacity-60 transition-opacity"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => alert("リンクをコピーしました")}
                    aria-label="リンクをコピー"
                    className="p-1.5 hover:opacity-60 transition-opacity"
                  >
                    <Link2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <StandardArticleContent release={release} />
            </>
          )}

          {activeTab === "soft" && release.softPr && <SoftPressReleaseView release={release} />}
        </article>

        {/* Company Info & Related Releases */}
        <div className="mt-14 pt-8 border-t border-[#e5e5e5] grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-sm font-bold text-[#1a1a1a] mb-3">配信元企業</h3>
            <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-[#e5e5e5]">
              <span className="text-sm font-bold text-[#1a1a1a]">{release.company}</span>
              <button
                onClick={() => alert("企業フォロー登録を完了しました")}
                className="px-4 py-1.5 border border-[#1a1a1a] text-[#1a1a1a] text-xs font-bold hover:bg-[#1a1a1a] hover:text-white transition-colors"
              >
                フォロー
              </button>
            </div>

            {companyReleases.length > 0 && (
              <ul className="space-y-2.5">
                {companyReleases.map((rel) => (
                  <li key={rel.id}>
                    <Link
                      href={`/companies/${rel.companyId}/releases/${rel.id}`}
                      className="group block"
                    >
                      <span className="text-xs text-[#1a1a1a] group-hover:text-[#0066cc] line-clamp-2 leading-snug">
                        {rel.title}
                      </span>
                      <span className="block text-[11px] text-[#999] mt-0.5">{rel.timestamp}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {relatedReleases.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-[#1a1a1a] mb-3 pb-3 border-b border-[#e5e5e5]">
                関連するプレスリリース（{release.category}）
              </h3>
              <ul className="space-y-3">
                {relatedReleases.slice(0, 3).map((rel) => (
                  <li key={rel.id}>
                    <Link
                      href={`/companies/${rel.companyId}/releases/${rel.id}`}
                      className="flex items-start gap-3 group"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={rel.imageUrl}
                        alt=""
                        className="w-16 h-11 object-cover shrink-0 bg-[#f5f5f5]"
                      />
                      <div className="min-w-0">
                        <span className="block text-xs text-[#1a1a1a] group-hover:text-[#0066cc] line-clamp-2 leading-snug">
                          {rel.title}
                        </span>
                        <span className="block text-[11px] text-[#999] mt-0.5">{rel.company}</span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};
