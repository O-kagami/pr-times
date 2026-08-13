"use client";

import React, { useState } from "react";
import {
  TRENDING_KEYWORDS,
  CATEGORIES,
} from "@/data/pressReleases";
import {
  Eye,
  Building,
  Newspaper,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Play,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";

interface SidebarProps {
  activeKeyword: string | null;
  onSelectKeyword: (kw: string | null) => void;
  onSelectCategory: (catId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeKeyword,
  onSelectKeyword,
  onSelectCategory,
}) => {
  const [openCategories, setOpenCategories] = useState(true);

  return (
    <aside className="w-full flex flex-col gap-6">
      {/* 1. Service Promotion Banner Box */}
      <div className="bg-[#eaf2f9] border border-[#bcd3ea] rounded p-4 text-gray-800 shadow-xs">
        <div className="text-center mb-3">
          <span className="text-[11px] font-bold text-[#0066cc] tracking-wide uppercase">
            プレスリリース配信サービス
          </span>
          <h3 className="text-xl font-extrabold text-[#182b45] mt-0.5">
            PR <span className="text-[#0066cc]">TIMES</span>
          </h3>
        </div>

        {/* Stats list */}
        <div className="bg-white rounded p-3 border border-sky-100 space-y-2 mb-3">
          <div className="flex items-center gap-2 text-xs">
            <div className="p-1 bg-sky-100 text-[#0066cc] rounded">
              <Eye className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 block leading-none">月間PV数</span>
              <span className="font-extrabold text-sm text-[#182b45]">8,000万PV超</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="p-1 bg-sky-100 text-[#0066cc] rounded">
              <Building className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 block leading-none">利用企業数</span>
              <span className="font-extrabold text-sm text-[#182b45]">100,000社超</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <div className="p-1 bg-sky-100 text-[#0066cc] rounded">
              <Newspaper className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[10px] text-gray-500 block leading-none">提携メディア数</span>
              <span className="font-extrabold text-sm text-[#182b45]">25,000媒体超</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] text-gray-600 text-center leading-relaxed mb-3">
          企業とメディア、生活者をニュースでつなぐ国内No.1プレスリリース配信プラットフォーム
        </p>

        <a
          href="#"
          className="block w-full text-center py-2 px-4 bg-[#0066cc] hover:bg-[#0055b8] text-white text-xs font-bold rounded shadow transition-colors"
        >
          ご利用をご検討の方はこちら
        </a>
      </div>

      {/* 2. Trending Keywords */}
      <div className="bg-white rounded border border-gray-200 p-4">
        <h3 className="text-sm font-bold text-gray-900 mb-3 pb-2 border-b border-gray-100 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>いま話題のキーワード</span>
        </h3>

        <div className="flex flex-wrap gap-1.5">
          {TRENDING_KEYWORDS.map((kw) => {
            const isSelected = activeKeyword === kw;
            return (
              <button
                key={kw}
                onClick={() => onSelectKeyword(isSelected ? null : kw)}
                className={`px-2.5 py-1 text-xs rounded transition-colors ${
                  isSelected
                    ? "bg-[#0066cc] text-white font-medium"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                #{kw}
              </button>
            );
          })}
        </div>

        {activeKeyword && (
          <button
            onClick={() => onSelectKeyword(null)}
            className="mt-3 text-[11px] text-[#0066cc] underline block w-full text-right"
          >
            キーワード選択を解除
          </button>
        )}
      </div>

      {/* 3. Search by Category Accordion */}
      <div className="bg-white rounded border border-gray-200 p-4">
        <button
          onClick={() => setOpenCategories(!openCategories)}
          className="w-full flex items-center justify-between text-sm font-bold text-gray-900 pb-2 border-b border-gray-100"
        >
          <span>カテゴリから探す</span>
          {openCategories ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {openCategories && (
          <div className="mt-3 space-y-1">
            {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className="w-full text-left px-2 py-1.5 text-xs text-gray-700 hover:bg-sky-50 hover:text-[#0066cc] rounded flex items-center justify-between group transition-colors"
              >
                <span>{cat.name}</span>
                <ArrowUpRight className="w-3 h-3 text-gray-400 group-hover:text-[#0066cc] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. PR TIMES STORY Banner */}
      <div className="bg-white rounded border border-gray-200 overflow-hidden">
        <div className="bg-[#182b45] text-white px-3 py-2 text-xs font-bold flex items-center justify-between">
          <span>PR TIMES STORY</span>
          <span className="text-[10px] text-sky-300 font-normal">プロジェクトの裏側</span>
        </div>
        <div className="p-3">
          <div className="relative aspect-video rounded overflow-hidden mb-2 bg-gray-100">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=80"
              alt="PR TIMES STORY"
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1.5 py-0.5 rounded">
              STORY
            </span>
          </div>
          <h4 className="text-xs font-bold text-gray-800 line-clamp-2 leading-snug mb-2">
            【開発秘話】日本初の移動式店舗で地方創生をプロデュースした挑戦の記録
          </h4>
          <a
            href="#"
            className="block text-center py-1.5 bg-sky-50 hover:bg-sky-100 text-[#0066cc] text-xs font-semibold rounded border border-sky-200 transition-colors"
          >
            もっと見る
          </a>
        </div>
      </div>

      {/* 5. PR TIMES MAGAZINE Banner */}
      <div className="bg-white rounded border border-gray-200 overflow-hidden">
        <div className="bg-[#182b45] text-white px-3 py-2 text-xs font-bold flex items-center justify-between">
          <span>PR TIMES MAGAZINE</span>
          <span className="text-[10px] text-sky-300 font-normal">広報PRノウハウ</span>
        </div>
        <div className="p-3">
          <div className="relative aspect-video rounded overflow-hidden mb-2 bg-gray-100">
            <img
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500&auto=format&fit=crop&q=80"
              alt="PR TIMES MAGAZINE"
              className="w-full h-full object-cover"
            />
          </div>
          <h4 className="text-xs font-bold text-gray-800 line-clamp-2 leading-snug mb-2">
            広報担当者必見！2026年下半期のプレスリリース配信トレンドとメディアアプローチ手法
          </h4>
          <a
            href="#"
            className="block text-center py-1.5 bg-sky-50 hover:bg-sky-100 text-[#0066cc] text-xs font-semibold rounded border border-sky-200 transition-colors"
          >
            もっと見る
          </a>
        </div>
      </div>

      {/* 6. PR TIMES TV Banner */}
      <div className="bg-white rounded border border-gray-200 overflow-hidden">
        <div className="bg-[#182b45] text-white px-3 py-2 text-xs font-bold flex items-center justify-between">
          <span>PR TIMES TV</span>
          <span className="text-[10px] text-sky-300 font-normal">動画プレスリリース</span>
        </div>
        <div className="p-3">
          <div className="relative aspect-video rounded overflow-hidden mb-2 bg-gray-900 group cursor-pointer">
            <img
              src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=500&auto=format&fit=crop&q=80"
              alt="PR TIMES TV"
              className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-10 h-10 bg-[#0066cc]/90 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 fill-white ml-0.5" />
              </div>
            </div>
          </div>
          <h4 className="text-xs font-bold text-gray-800 line-clamp-2 leading-snug mb-2">
            【動画】最新ロボット掃除機発表会：AI障害物回避機能を実演デモ
          </h4>
          <a
            href="#"
            className="block text-center py-1.5 bg-sky-50 hover:bg-sky-100 text-[#0066cc] text-xs font-semibold rounded border border-sky-200 transition-colors"
          >
            もっと見る
          </a>
        </div>
      </div>

      {/* 7. PR EDITOR Tool Box */}
      <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-center">
        <div className="flex items-center justify-center gap-1 text-emerald-700 text-xs font-extrabold mb-1">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>PR EDITOR</span>
        </div>
        <p className="text-[11px] text-emerald-800 leading-snug mb-2">
          AI文章校正・効果測定サポートエディターツール
        </p>
        <a
          href="#"
          className="block py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded transition-colors"
        >
          詳細を見る
        </a>
      </div>

      {/* 8. MARSH Feature */}
      <div className="bg-gray-50 border border-gray-200 rounded p-3 text-center">
        <span className="text-xs font-black text-gray-800 tracking-wider">MARSH</span>
        <p className="text-[10px] text-gray-500 mb-2">カルチャー＆ライフスタイルウェブマガジン</p>
        <div className="aspect-3/2 rounded overflow-hidden mb-2 bg-gray-200">
          <img
            src="https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&auto=format&fit=crop&q=80"
            alt="MARSH"
            className="w-full h-full object-cover"
          />
        </div>
        <a
          href="#"
          className="text-xs text-[#0066cc] hover:underline font-medium inline-flex items-center gap-1"
        >
          <span>MARSHをチェック</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </aside>
  );
};
