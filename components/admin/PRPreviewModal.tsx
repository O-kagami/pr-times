"use client";

import React from "react";
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { PressRelease } from "@/data/pressReleases";
import { AnnotatedContent } from "@/components/AnnotatedContent";


interface PRPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prData: Partial<PressRelease>;
}

export default function PRPreviewModal({ open, onOpenChange, prData }: PRPreviewModalProps) {
  const sampleCompany = prData.company || "株式会社サンプル";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <DialogTitle>プレビュー確認</DialogTitle>
            <DialogDescription>
              実際のPR TIMES配信ページでの表示イメージです
            </DialogDescription>
          </div>
          <Badge variant="sky" className="text-xs">
            プレビュー表示中
          </Badge>
        </div>
      </DialogHeader>

      {/* Simulated Article Layout */}
      <div className="bg-white rounded-lg p-6 space-y-6 max-h-[70vh] overflow-y-auto border border-gray-100 shadow-inner">
        {/* Category & Timestamp */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
          <Badge variant="secondary" className="font-semibold text-sky-700 bg-sky-50">
            {prData.category || "テクノロジー"}
          </Badge>
          {prData.subCategory && (
            <span className="text-gray-400">/ {prData.subCategory}</span>
          )}
          <span className="ml-auto text-gray-400">
            {prData.publishedAt || "2026年8月13日 15時00分"}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
          {prData.title || "（タイトルが未入力です）"}
        </h1>

        {/* Subtitle */}
        {prData.subtitle && (
          <h2 className="text-base text-gray-600 font-medium leading-relaxed border-l-4 border-sky-500 pl-3">
            {prData.subtitle}
          </h2>
        )}

        {/* Company Name */}
        <div className="flex items-center gap-3 py-2 border-y border-gray-100">
          <div className="w-10 h-10 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
            {sampleCompany.substring(0, 2)}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">{sampleCompany}</p>
            <p className="text-xs text-gray-500">プレスリリース配信事業者</p>
          </div>
        </div>

        {/* Summary Highlights */}
        {prData.summaryHighlights && prData.summaryHighlights.filter((s) => s.trim()).length > 0 && (
          <div className="bg-sky-50/70 border border-sky-100 rounded-lg p-4 space-y-2">
            <p className="text-xs font-bold text-sky-900 tracking-wide uppercase">
              【このプレスリリースのポイント】
            </p>
            <ul className="list-disc list-inside text-sm text-gray-800 space-y-1">
              {prData.summaryHighlights
                .filter((s) => s.trim())
                .map((highlight, idx) => (
                  <li key={idx} className="leading-snug">
                    {highlight}
                  </li>
                ))}
            </ul>
          </div>
        )}

        {/* Main Image */}
        {prData.imageUrl ? (
          <div className="rounded-lg overflow-hidden border border-gray-200 shadow-xs">
            <img
              src={prData.imageUrl}
              alt={prData.title || "Main PR Image"}
              className="w-full h-auto max-h-[400px] object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1000&auto=format&fit=crop&q=80";
              }}
            />
          </div>
        ) : (
          <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 text-sm">
            （メイン画像未設定）
          </div>
        )}

        {/* Content Body */}
        <div className="prose max-w-none text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
          {prData.softPr ? (
            <AnnotatedContent
              content={prData.content || "（本文が未入力です）"}
              softNotes={prData.softPr.notes}
            />
          ) : (
            prData.content || "（本文が未入力です）"
          )}
        </div>

        {/* Soft PR Reflection Message Block */}
        {prData.softPr && prData.softPr.reflection && (
          <div className="border border-[#ebdfcb] bg-[#fbf6ee] p-5 rounded-lg space-y-3">
            <div className="text-xs font-bold text-[#a8703a] tracking-wide uppercase">
              広報担当より　このリリースについて
            </div>
            <div className="space-y-2 text-xs text-[#362f26] leading-relaxed">
              {prData.softPr.reflection.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
            {prData.softPr.author && (
              <div className="pt-2 border-t border-[#e8ddc9] text-[11px] text-[#786b59] font-medium">
                投稿者: 広報担当 {prData.softPr.author.name} （{prData.softPr.author.role}）
              </div>
            )}
          </div>
        )}

        {/* Keywords / Tags */}
        {prData.keywords && prData.keywords.length > 0 && (
          <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-1.5 items-center">
            <span className="text-xs font-bold text-gray-500 mr-1">関連キーワード:</span>
            {prData.keywords.map((tag, idx) => (
              <Badge key={idx} variant="outline" className="text-xs text-sky-700 border-sky-200 bg-sky-50/50">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Company Profile & Contact Info */}
        <div className="grid sm:grid-cols-2 gap-4 pt-6 border-t border-gray-200 bg-gray-50/70 p-4 rounded-lg">
          <div>
            <h4 className="text-xs font-bold text-gray-900 mb-2">{sampleCompany} について</h4>
            <div className="text-xs space-y-1 text-gray-600">
              <p><span className="font-semibold text-gray-700">代表者:</span> {prData.companyProfile?.representative || "代表取締役"}</p>
              <p><span className="font-semibold text-gray-700">所在地:</span> {prData.companyProfile?.address || "東京都千代田区"}</p>
              <p><span className="font-semibold text-gray-700">事業内容:</span> {prData.companyProfile?.business || "Webサービスの企画・開発"}</p>
              <p><span className="font-semibold text-gray-700">URL:</span> <a href="#" className="text-sky-600 hover:underline">{prData.companyProfile?.website || "https://example.com"}</a></p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-900 mb-2">本件に関するお問い合わせ先</h4>
            <div className="text-xs space-y-1 text-gray-600">
              <p><span className="font-semibold text-gray-700">部署:</span> {prData.contactInfo?.department || "広報担当"}</p>
              <p><span className="font-semibold text-gray-700">担当者:</span> {prData.contactInfo?.person || "広報担当窓口"}</p>
              <p><span className="font-semibold text-gray-700">TEL:</span> {prData.contactInfo?.tel || "03-0000-0000"}</p>
              <p><span className="font-semibold text-gray-700">E-mail:</span> {prData.contactInfo?.email || "pr@example.com"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          閉じる
        </Button>
      </div>
    </Dialog>
  );
}
