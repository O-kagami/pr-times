"use client";

import React from "react";
import { PressRelease } from "@/data/pressReleases";
import { getCompanyHref } from "@/lib/companyLinks";
import { Clock, Building2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PressReleaseCardProps {
  release: PressRelease;
  onClick?: () => void;
}

export const PressReleaseCard: React.FC<PressReleaseCardProps> = ({
  release,
  onClick,
}) => {
  const router = useRouter();
  const companyHref = getCompanyHref(release.companyId);

  return (
    <Link
      href={`/companies/${release.companyId}/releases/${release.id}`}
      onClick={onClick}
      className="group cursor-pointer bg-white p-3.5 rounded border border-gray-200 hover:border-sky-300 hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row gap-3 justify-between items-start"
    >
      {/* Left Text Block */}
      <div className="flex-1 flex flex-col justify-between h-full min-w-0">
        <div>
          {/* Header metadata */}
          <div className="flex items-center gap-2 text-[11px] text-gray-500 mb-1.5 flex-wrap">
            <span className="font-semibold px-1.5 py-0.5 bg-sky-50 text-[#0066cc] rounded border border-sky-100">
              {release.category}
            </span>
            <span className="flex items-center gap-1 text-gray-400">
              <Clock className="w-3 h-3" />
              {release.timestamp}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-sm md:text-base font-bold text-gray-900 leading-snug group-hover:text-[#0066cc] transition-colors line-clamp-2">
            {release.title}
          </h2>

          {/* Subtitle / Snippet */}
          {release.subtitle && (
            <p className="text-xs text-gray-600 line-clamp-2 mt-1 hidden sm:block">
              {release.subtitle}
            </p>
          )}
        </div>

        {/* Footer Company Info */}
        <div className="mt-3 flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span className="flex items-center gap-1 font-medium text-gray-700 truncate max-w-[240px]">
            <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            {companyHref ? (
              // カード全体が Link のため、入れ子の <a> を避けて手動で遷移する
              <span
                role="link"
                tabIndex={0}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(companyHref);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push(companyHref);
                  }
                }}
                className="truncate hover:text-[#0066cc] hover:underline cursor-pointer"
              >
                {release.company}
              </span>
            ) : (
              <span className="truncate">{release.company}</span>
            )}
          </span>

          <div className="flex items-center gap-1 text-[10px] text-gray-400 shrink-0">
            {release.keywords.slice(0, 2).map((kw) => (
              <span key={kw} className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                #{kw}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right Image Thumbnail */}
      <div className="w-full sm:w-36 md:w-40 aspect-video sm:aspect-4/3 shrink-0 overflow-hidden rounded bg-gray-100 border border-gray-100">
        <img
          src={release.imageUrl}
          alt={release.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
      </div>
    </Link>
  );
};
