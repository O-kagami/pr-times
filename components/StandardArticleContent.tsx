/* eslint-disable @next/next/no-img-element */
"use client";

import { AnnotatedContent } from "@/components/AnnotatedContent";
import { PressRelease } from "@/data/pressReleases";
import { Mail, Phone, Globe, Download } from "lucide-react";

interface StandardArticleContentProps {
  release: PressRelease;
  showSoftPr?: boolean;
}

export function StandardArticleContent({ release, showSoftPr = false }: StandardArticleContentProps) {
  const softPr = showSoftPr ? release.softPr : undefined;

  return (
    <>
      {/* Main Title */}
      <h1 className="text-xl md:text-[26px] font-bold text-[#1a1a1a] leading-snug mt-6 mb-3">
        {release.title}
      </h1>

      {/* Subtitle / Lead */}
      {release.subtitle && (
        <p className="text-sm text-[#666] leading-relaxed mb-6">{release.subtitle}</p>
      )}

      {softPr && (
        <div className="mb-6 flex items-center gap-3 border border-[#ebdfcb] bg-[#fbf6ee] px-4 py-3">
          <div className="h-8 w-8 shrink-0 rounded-full border border-[#e0d5c0] bg-[repeating-linear-gradient(135deg,#efe7d9_0_6px,#e6dcc9_6px_12px)]" />
          <p className="text-xs leading-relaxed text-[#574d40]">
            <span className="font-bold">広報担当 {softPr.author.name}（{softPr.author.role}）</span>
            が本文にコメントを添えています。文中の
            <span className="bg-[linear-gradient(transparent_62%,#f7e3b4_62%)]">マーカー部分</span>
            にカーソルを合わせるとご覧いただけます。
          </p>
        </div>
      )}

      {/* PV & Keywords */}
      <div className="flex items-center justify-between text-xs text-[#999] pb-4 mb-6 border-b border-[#e5e5e5] flex-wrap gap-2">
        <span>閲覧数：{release.pvCount?.toLocaleString()} PV</span>
        {release.keywords.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            {release.keywords.map((kw) => (
              <span key={kw} className="text-[#767676]">
                #{kw}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Key Visual Hero Image */}
      <div className="mb-8">
        <img
          src={release.imageUrl}
          alt={release.title}
          className="w-full aspect-video object-cover"
        />
      </div>

      {/* Executive Summary */}
      {release.summaryHighlights && (
        <div className="mb-8">
          <h3 className="text-base font-bold text-[#1a1a1a] mb-3">■ 本リリースのポイント</h3>
          <ul className="space-y-1.5 text-sm text-[#1a1a1a]">
            {release.summaryHighlights.map((point, index) => (
              <li key={index} className="flex items-start gap-2 leading-relaxed">
                <span className="shrink-0">・</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Text Content Body */}
      <div className="max-w-none text-[#1a1a1a] leading-[1.9] space-y-6 mb-8 whitespace-pre-line text-sm md:text-base">
        <AnnotatedContent
          content={release.content}
          notes={release.inlineNotes}
          softNotes={softPr?.notes}
        />
      </div>

      {/* Soft PR Reflection */}
      {softPr && (
        <div className="mb-10 border border-[#ebdfcb] bg-[#fbf6ee] px-6 py-8 md:px-10">
          <div className="mb-5 text-[13px] font-bold tracking-wide text-[#a8703a]">
            広報担当より　このリリースについて
          </div>
          <div className="flex flex-col gap-4">
            {softPr.reflection.map((paragraph, index) => (
              <p key={index} className="text-sm leading-[1.9] text-[#362f26]">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-6 flex items-center gap-3 border-t border-[#e8ddc9] pt-4">
            <div className="h-10 w-10 shrink-0 rounded-full border border-[#e0d5c0] bg-[repeating-linear-gradient(135deg,#efe7d9_0_6px,#e6dcc9_6px_12px)]" />
            <div className="text-sm leading-relaxed">
              <div className="font-bold text-[#1a1a1a]">{softPr.author.name}</div>
              <div className="text-xs text-[#7a6f5e]">{softPr.author.role}</div>
            </div>
          </div>
        </div>
      )}

      {/* Secondary Images Gallery */}
      {release.secondaryImages && release.secondaryImages.length > 0 && (
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {release.secondaryImages.map((imgUrl, i) => (
            <img
              key={i}
              src={imgUrl}
              alt={`図表 ${i + 1}`}
              className="w-full aspect-video object-cover bg-[#f5f5f5]"
            />
          ))}
        </div>
      )}

      {/* Survey Data Tables */}
      {release.surveyTables && release.surveyTables.length > 0 && (
        <div className="mb-10 space-y-8">
          {release.surveyTables.map((table, tIdx) => (
            <div key={tIdx} className="space-y-2">
              <h3 className="text-sm font-bold text-[#1a1a1a]">{table.title}</h3>
              <div className="overflow-x-auto border border-[#d9d9d9]">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-[#f5f5f5] border-b border-[#d9d9d9] text-[#1a1a1a] font-bold">
                      {table.headers.map((header, hIdx) => (
                        <th
                          key={hIdx}
                          className="px-3.5 py-2.5 border-r border-[#d9d9d9] last:border-r-0 text-center"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e5e5e5] bg-white">
                    {table.rows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className={`px-3.5 py-2.5 border-r border-[#e5e5e5] last:border-r-0 text-[#1a1a1a] ${
                              cIdx === 0 ? "font-medium" : "text-center"
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* QR Code & App Download Block */}
      {release.qrCodes && release.qrCodes.length > 0 && (
        <div className="mb-10 border border-[#e5e5e5] p-5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <h4 className="text-sm font-bold text-[#1a1a1a]">スマートフォンから今すぐアクセス</h4>
            <p className="text-xs text-[#666] max-w-md">
              カメラでQRコードを読み取ると、最新アプリのダウンロードおよび専用ページへ直接移動できます。
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            {release.qrCodes.map((qr, qIdx) => (
              <div key={qIdx} className="text-center space-y-1">
                <img src={qr.qrUrl} alt={qr.label} className="w-20 h-20 mx-auto" />
                <span className="text-[10px] text-[#666] block">{qr.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Download Press Kit Assets */}
      <div className="mb-10 pt-5 border-t border-[#e5e5e5]">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            alert("素材一括ZIPファイルのダウンロードを開始しました");
          }}
          className="inline-flex items-center gap-2 px-4 py-2 border border-[#1a1a1a] text-[#1a1a1a] text-xs font-bold hover:bg-[#1a1a1a] hover:text-white transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          プレスリリース素材をダウンロード
        </a>
      </div>

      {/* Company Profile Section */}
      {release.companyProfile && (
        <div className="mb-8">
          <h3 className="text-sm font-bold text-[#1a1a1a] mb-3">■ 会社概要</h3>
          <table className="w-full border-collapse text-xs border border-[#e5e5e5]">
            <tbody className="divide-y divide-[#e5e5e5]">
              <tr>
                <th className="py-2 px-3 text-left bg-[#f9f9f9] text-[#666] w-28 font-medium align-top">社名</th>
                <td className="py-2 px-3 text-[#1a1a1a] font-bold">{release.companyProfile.name}</td>
              </tr>
              <tr>
                <th className="py-2 px-3 text-left bg-[#f9f9f9] text-[#666] font-medium align-top">代表者</th>
                <td className="py-2 px-3 text-[#1a1a1a]">{release.companyProfile.representative}</td>
              </tr>
              <tr>
                <th className="py-2 px-3 text-left bg-[#f9f9f9] text-[#666] font-medium align-top">所在地</th>
                <td className="py-2 px-3 text-[#1a1a1a]">{release.companyProfile.address}</td>
              </tr>
              <tr>
                <th className="py-2 px-3 text-left bg-[#f9f9f9] text-[#666] font-medium align-top">設立</th>
                <td className="py-2 px-3 text-[#1a1a1a]">{release.companyProfile.established}</td>
              </tr>
              <tr>
                <th className="py-2 px-3 text-left bg-[#f9f9f9] text-[#666] font-medium align-top">資本金</th>
                <td className="py-2 px-3 text-[#1a1a1a]">{release.companyProfile.capital}</td>
              </tr>
              <tr>
                <th className="py-2 px-3 text-left bg-[#f9f9f9] text-[#666] font-medium align-top">事業内容</th>
                <td className="py-2 px-3 text-[#1a1a1a]">{release.companyProfile.business}</td>
              </tr>
              <tr>
                <th className="py-2 px-3 text-left bg-[#f9f9f9] text-[#666] font-medium align-top">URL</th>
                <td className="py-2 px-3 text-[#0066cc]">
                  <a
                    href={release.companyProfile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:no-underline"
                  >
                    {release.companyProfile.website}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* Press Contact Section */}
      {release.contactInfo && (
        <div className="pt-5 border-t border-[#e5e5e5] space-y-3">
          <h4 className="text-xs font-bold text-[#1a1a1a]">
            【本件に関する報道関係者からのお問い合わせ先】
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-[#1a1a1a]">
            <div className="space-y-1">
              <p className="font-bold">{release.company}</p>
              <p className="text-[#666]">{release.contactInfo.department}</p>
              {release.contactInfo.person && <p className="text-[#666]">{release.contactInfo.person}</p>}
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#666]" />
                <span>{release.contactInfo.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#666]" />
                <span>{release.contactInfo.tel}</span>
              </div>
              <div className="flex items-center gap-2 text-[#0066cc]">
                <Globe className="w-3.5 h-3.5" />
                <a href={release.contactInfo.website} target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">
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
