"use client";

import React from "react";
import { PressRelease } from "@/data/pressReleases";
import {
  X,
  Building2,
  Calendar,
  Eye,
  Heart,
  Share2,
  ExternalLink,
  Mail,
  Phone,
  Globe,
  Tag,
} from "lucide-react";

interface PressReleaseModalProps {
  release: PressRelease | null;
  onClose: () => void;
}

export const PressReleaseModal: React.FC<PressReleaseModalProps> = ({
  release,
  onClose,
}) => {
  if (!release) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div
        className="relative w-full max-w-3xl bg-white rounded-lg shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Sticky Header */}
        <div className="sticky top-0 z-10 bg-[#182b45] text-white px-4 py-3 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <span className="bg-[#0066cc] text-white font-bold px-2 py-0.5 rounded text-[11px]">
              {release.category}
            </span>
            <span>プレスリリース詳細</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-300 hover:text-white rounded hover:bg-white/10 transition-colors"
            title="閉じる"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Release Header */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="flex items-center gap-1 font-semibold text-[#0066cc]">
                <Building2 className="w-4 h-4" />
                {release.company}
              </span>
              <span className="flex items-center gap-1 text-gray-400">
                <Calendar className="w-3.5 h-3.5" />
                {release.publishedAt}
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 leading-snug">
              {release.title}
            </h1>

            {release.subtitle && (
              <p className="text-sm font-medium text-gray-600 border-l-4 border-[#0066cc] pl-3 py-0.5">
                {release.subtitle}
              </p>
            )}

            {/* Stats & Keywords */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs border-y border-gray-100 py-2">
              <div className="flex items-center gap-4 text-gray-500">
                {release.pvCount && (
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-sky-500" />
                    <strong className="text-gray-800">{release.pvCount.toLocaleString()}</strong> PV
                  </span>
                )}
                {release.likesCount && (
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                    <strong className="text-gray-800">{release.likesCount.toLocaleString()}</strong> いいね
                  </span>
                )}
              </div>

              <div className="flex items-center gap-1 flex-wrap">
                <Tag className="w-3.5 h-3.5 text-gray-400" />
                {release.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="bg-sky-50 text-[#0066cc] px-2 py-0.5 rounded text-[11px] font-medium"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Hero Image */}
          <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm aspect-video max-h-[400px]">
            <img
              src={release.imageUrl}
              alt={release.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Press Release Content Text */}
          <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed space-y-4 whitespace-pre-line font-sans">
            {release.content}
          </div>

          {/* Company Contact Box */}
          {release.contactInfo && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3 mt-6">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200 pb-2">
                【本件に関する報道関係者からのお問い合わせ先】
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-700">
                <div>
                  <span className="text-gray-400 block text-[10px]">企業・部署名</span>
                  <span className="font-semibold">{release.company}</span>
                  <span className="block text-gray-600">{release.contactInfo.department}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Mail className="w-3.5 h-3.5 text-sky-600" />
                    <span>{release.contactInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-600">
                    <Phone className="w-3.5 h-3.5 text-sky-600" />
                    <span>{release.contactInfo.tel}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#0066cc]">
                    <Globe className="w-3.5 h-3.5" />
                    <a
                      href={release.contactInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-medium hover:text-[#0055b8]"
                    >
                      公式Webサイトを見る
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Social Share Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert("URLをコピーしました！")}
                className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>シェアする</span>
              </button>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#182b45] hover:bg-[#243d61] text-white text-xs font-bold rounded transition-colors"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
