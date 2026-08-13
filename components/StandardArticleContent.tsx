/* eslint-disable @next/next/no-img-element */
"use client";

import { AnnotatedContent } from "@/components/AnnotatedContent";
import { PressRelease } from "@/data/pressReleases";
import Link from "next/link";
import {
  Building2,
  Calendar,
  Eye,
  Mail,
  Phone,
  Globe,
  CheckCircle2,
  Tag,
  FileText,
  Download,
} from "lucide-react";

interface StandardArticleContentProps {
  release: PressRelease;
}

export function StandardArticleContent({ release }: StandardArticleContentProps) {
  return (
    <>
      {/* Company Header */}
      <div className="flex items-center gap-3 mb-4 p-3 bg-slate-50 rounded border border-slate-100">
        <div className="w-10 h-10 rounded bg-[#182b45] text-white font-bold flex items-center justify-center text-sm shrink-0">
          <Building2 className="w-5 h-5 text-sky-400" />
        </div>
        <div>
          <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wider">
            プレスリリース配信企業
          </span>
          <h3 className="text-sm font-bold text-gray-900">
            <Link className="hover:text-[#0066cc]" href={`/companies/${release.companyId}`}>
              {release.company}
            </Link>
          </h3>
        </div>
      </div>

      {/* Main Title */}
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-snug mb-4">
        {release.title}
      </h1>

      {/* Subtitle / Lead */}
      {release.subtitle && (
        <p className="text-sm md:text-base font-semibold text-gray-700 leading-relaxed border-l-4 border-[#0066cc] pl-4 py-1 mb-6 bg-sky-50/50 rounded-r">
          {release.subtitle}
        </p>
      )}

      {/* PV & Stats Bar */}
      <div className="flex items-center justify-between text-xs text-gray-500 pb-4 mb-6 border-b border-gray-100 flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1 font-medium">
            <Eye className="w-4 h-4 text-sky-600" />
            <span>閲覧数：<strong>{release.pvCount?.toLocaleString()}</strong> PV</span>
          </span>
          <span className="flex items-center gap-1 font-medium">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{release.publishedAt}</span>
          </span>
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          <Tag className="w-3.5 h-3.5 text-gray-400" />
          {release.keywords.map((kw) => (
            <span
              key={kw}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-0.5 rounded text-[11px]"
            >
              #{kw}
            </span>
          ))}
        </div>
      </div>

      {/* Key Visual Hero Image */}
      <div className="mb-8 rounded-lg overflow-hidden border border-gray-200 shadow-xs">
        <img
          src={release.imageUrl}
          alt={release.title}
          className="w-full aspect-video object-cover"
        />
        <div className="p-2 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-600 flex items-center justify-center gap-1">
          <span>▲ メインプレスリリース画像（高解像度版は素材ダウンロードより取得可能）</span>
        </div>
      </div>

      {/* Executive Summary Callout Box */}
      {release.summaryHighlights && (
        <div className="mb-8 p-5 bg-[#eaf2f9] border-2 border-[#bcd3ea] rounded-lg shadow-2xs">
          <h3 className="text-sm font-extrabold text-[#182b45] mb-3 flex items-center gap-2 border-b border-[#bcd3ea] pb-2">
            <CheckCircle2 className="w-5 h-5 text-[#0066cc]" />
            <span>本プレスリリースの重要ポイント</span>
          </h3>
          <ul className="space-y-2 text-xs md:text-sm text-gray-800">
            {release.summaryHighlights.map((point, index) => (
              <li key={index} className="flex items-start gap-2 leading-relaxed">
                <span className="text-[#0066cc] font-bold text-sm shrink-0">■</span>
                <span className="font-semibold">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Text Content Body */}
      <div className="prose prose-sm max-w-none text-gray-800 leading-relaxed space-y-6 mb-8 whitespace-pre-line text-sm md:text-base font-sans">
        <AnnotatedContent content={release.content} notes={release.inlineNotes} />
      </div>

      {/* Secondary Images Gallery */}
      {release.secondaryImages && release.secondaryImages.length > 0 && (
        <div className="mb-8 space-y-4">
          <h3 className="text-sm font-extrabold text-gray-900 border-l-4 border-[#0066cc] pl-3 py-0.5">
            関連画像・図表
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {release.secondaryImages.map((imgUrl, i) => (
              <div key={i} className="rounded border border-gray-200 overflow-hidden bg-gray-50">
                <img src={imgUrl} alt={`図表 ${i + 1}`} className="w-full aspect-video object-cover" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Survey Data Tables (Reproducing exact table layout from screenshot!) */}
      {release.surveyTables && release.surveyTables.length > 0 && (
        <div className="mb-10 space-y-8">
          {release.surveyTables.map((table, tIdx) => (
            <div key={tIdx} className="space-y-3">
              <h3 className="text-sm font-extrabold text-gray-900 flex items-center gap-2 border-l-4 border-[#182b45] pl-3 py-1 bg-slate-50">
                <FileText className="w-4 h-4 text-[#0066cc]" />
                <span>{table.title}</span>
              </h3>

              {/* Styled Data Table */}
              <div className="overflow-x-auto rounded border border-gray-300 shadow-2xs">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-[#faf5e8] border-b border-gray-300 text-gray-800 font-extrabold">
                      {table.headers.map((header, hIdx) => (
                        <th
                          key={hIdx}
                          className="px-3.5 py-2.5 border-r border-gray-300 last:border-r-0 text-center"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {table.rows.map((row, rIdx) => {
                      const isTotalRow =
                        String(row[0]).includes("合計") || String(row[0]).includes("全体");
                      return (
                        <tr
                          key={rIdx}
                          className={`hover:bg-sky-50/60 transition-colors ${
                            isTotalRow
                              ? "bg-amber-50/70 font-extrabold border-t-2 border-amber-300 text-gray-900"
                              : rIdx % 2 === 1
                              ? "bg-gray-50/50"
                              : ""
                          }`}
                        >
                          {row.map((cell, cIdx) => (
                            <td
                              key={cIdx}
                              className={`px-3.5 py-2.5 border-r border-gray-200 last:border-r-0 text-gray-800 ${
                                cIdx === 0
                                  ? "font-medium"
                                  : "text-center font-mono"
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Code & App Download Block */}
      {release.qrCodes && release.qrCodes.length > 0 && (
        <div className="mb-10 bg-slate-900 text-white rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs text-sky-400 font-bold tracking-wider uppercase">
              アプリ・サービスリンク
            </span>
            <h4 className="text-lg font-bold">
              スマートフォンから今すぐアクセス
            </h4>
            <p className="text-xs text-gray-300 max-w-md">
              カメラでQRコードを読み取ると、最新アプリのダウンロードおよび専用ページへ直接移動できます。
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white text-gray-900 p-3 rounded-md shrink-0">
            {release.qrCodes.map((qr, qIdx) => (
              <div key={qIdx} className="text-center space-y-1">
                <img src={qr.qrUrl} alt={qr.label} className="w-24 h-24 mx-auto" />
                <span className="text-[10px] font-bold text-gray-700 block">
                  {qr.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Download Press Kit Assets Bar */}
      <div className="mb-10 p-4 bg-sky-50 border border-sky-200 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#0066cc] text-white rounded">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">
              報道関係者様向け メディア素材ダウンロード
            </h4>
            <p className="text-[11px] text-gray-600">
              高解像度プレス画像、ロゴデータ、調査データCSVを一括ダウンロードいただけます
            </p>
          </div>
        </div>

        <button
          onClick={() => alert("素材一括ZIPファイルのダウンロードを開始しました")}
          className="px-5 py-2 bg-[#0066cc] hover:bg-[#0055b8] text-white text-xs font-bold rounded shadow transition-colors shrink-0"
        >
          画像素材一括DL (ZIP)
        </button>
      </div>

      {/* Company Profile Section */}
      {release.companyProfile && (
        <div className="mb-8 border border-gray-300 rounded-lg overflow-hidden">
          <div className="bg-[#182b45] text-white px-4 py-2.5 text-xs font-bold flex items-center justify-between">
            <Link className="hover:text-sky-200" href={`/companies/${release.companyId}`}>
              {release.companyProfile.name} 会社概要
            </Link>
            <span className="text-[10px] text-sky-300">企業情報</span>
          </div>
          <div className="p-4 bg-white text-xs">
            <table className="w-full border-collapse">
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <th className="py-2 px-3 text-left bg-gray-50 text-gray-600 w-28 font-semibold">社名</th>
                  <td className="py-2 px-3 text-gray-900 font-bold">
                    <Link className="hover:text-[#0066cc]" href={`/companies/${release.companyId}`}>
                      {release.companyProfile.name}
                    </Link>
                  </td>
                </tr>
                <tr>
                  <th className="py-2 px-3 text-left bg-gray-50 text-gray-600 font-semibold">代表者</th>
                  <td className="py-2 px-3 text-gray-900">{release.companyProfile.representative}</td>
                </tr>
                <tr>
                  <th className="py-2 px-3 text-left bg-gray-50 text-gray-600 font-semibold">所在地</th>
                  <td className="py-2 px-3 text-gray-900">{release.companyProfile.address}</td>
                </tr>
                <tr>
                  <th className="py-2 px-3 text-left bg-gray-50 text-gray-600 font-semibold">設立</th>
                  <td className="py-2 px-3 text-gray-900">{release.companyProfile.established}</td>
                </tr>
                <tr>
                  <th className="py-2 px-3 text-left bg-gray-50 text-gray-600 font-semibold">資本金</th>
                  <td className="py-2 px-3 text-gray-900">{release.companyProfile.capital}</td>
                </tr>
                <tr>
                  <th className="py-2 px-3 text-left bg-gray-50 text-gray-600 font-semibold">事業内容</th>
                  <td className="py-2 px-3 text-gray-900">{release.companyProfile.business}</td>
                </tr>
                <tr>
                  <th className="py-2 px-3 text-left bg-gray-50 text-gray-600 font-semibold">URL</th>
                  <td className="py-2 px-3 text-[#0066cc]">
                    <a href={release.companyProfile.website} target="_blank" rel="noopener noreferrer" className="underline hover:text-[#0055b8]">
                      {release.companyProfile.website}
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Press Contact Section */}
      {release.contactInfo && (
        <div className="p-5 bg-gray-50 border border-gray-300 rounded-lg space-y-3 mb-8">
          <h4 className="text-xs font-extrabold text-gray-800 uppercase tracking-wider border-b border-gray-300 pb-2">
            【本件に関する報道関係者からのお問い合わせ先】
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-800">
            <div className="space-y-1">
              <span className="text-gray-500 block text-[10px]">担当部署・担当者</span>
              <p className="font-bold">
                <Link className="hover:text-[#0066cc]" href={`/companies/${release.companyId}`}>
                  {release.company}
                </Link>
              </p>
              <p className="text-gray-700">{release.contactInfo.department}</p>
              {release.contactInfo.person && <p className="text-gray-700">{release.contactInfo.person}</p>}
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0066cc]" />
                <span className="font-mono">{release.contactInfo.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#0066cc]" />
                <span className="font-mono">{release.contactInfo.tel}</span>
              </div>
              <div className="flex items-center gap-2 text-[#0066cc]">
                <Globe className="w-4 h-4" />
                <a href={release.contactInfo.website} target="_blank" rel="noopener noreferrer" className="underline font-bold">
                  公式お問い合わせフォーム
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
