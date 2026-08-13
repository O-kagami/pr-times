"use client";

import React, { useState } from "react";
import { PressRelease, RANKING_TABS } from "@/data/pressReleases";
import { TrendingUp, Award, Heart, Calendar, ChevronRight } from "lucide-react";

interface RankingSectionProps {
  pressReleases: PressRelease[];
  onSelectRelease: (release: PressRelease) => void;
}

export const RankingSection: React.FC<RankingSectionProps> = ({
  pressReleases,
  onSelectRelease,
}) => {
  const [activeTab, setActiveTab] = useState("general");

  // Sort press releases according to active ranking tab
  const sortedReleases = [...pressReleases].sort((a, b) => {
    if (activeTab === "pv") {
      return (b.pvCount || 0) - (a.pvCount || 0);
    }
    if (activeTab === "likes") {
      return (b.likesCount || 0) - (a.likesCount || 0);
    }
    return 0; // Default order
  });

  const topSix = sortedReleases.slice(0, 6);

  const getTabIcon = (id: string) => {
    switch (id) {
      case "general":
        return <Award className="w-3.5 h-3.5" />;
      case "pv":
        return <TrendingUp className="w-3.5 h-3.5" />;
      case "likes":
        return <Heart className="w-3.5 h-3.5" />;
      case "weekly":
        return <Calendar className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  return (
    <section className="w-full bg-[#eef4f9] border-b border-gray-200 py-4">
      <div className="max-w-[1200px] mx-auto px-4">
        {/* Header & Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 pb-2 border-b border-gray-300/70">
          <div className="flex items-center gap-1.5 flex-wrap">
            {RANKING_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#182b45] text-white shadow-sm"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                  }`}
                >
                  {getTabIcon(tab.id)}
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          <a
            href="#"
            className="flex items-center gap-0.5 text-xs text-[#0066cc] font-medium hover:underline shrink-0 self-end sm:self-auto"
          >
            <span>一覧をみる</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Top 6 Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {topSix.map((release, index) => {
            const rank = index + 1;
            return (
              <div
                key={release.id}
                onClick={() => onSelectRelease(release)}
                className="group cursor-pointer bg-white rounded border border-gray-200 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden relative"
              >
                {/* Rank Badge */}
                <div
                  className={`absolute top-1.5 left-1.5 z-10 w-5 h-5 rounded flex items-center justify-center text-xs font-black text-white shadow-sm ${
                    rank === 1
                      ? "bg-amber-500"
                      : rank === 2
                      ? "bg-slate-400"
                      : rank === 3
                      ? "bg-amber-700"
                      : "bg-[#182b45]"
                  }`}
                >
                  {rank}
                </div>

                {/* Thumbnail Image */}
                <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                  <img
                    src={release.imageUrl}
                    alt={release.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Content */}
                <div className="p-2 flex flex-col flex-1 justify-between">
                  <h3 className="text-xs font-bold text-gray-800 line-clamp-2 leading-snug group-hover:text-[#0066cc] transition-colors">
                    {release.title}
                  </h3>
                  <div className="mt-2 pt-1.5 border-t border-gray-100 flex flex-col gap-0.5 text-[10px] text-gray-500">
                    <span className="truncate">{release.company}</span>
                    <span className="text-gray-400">{release.timestamp}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
