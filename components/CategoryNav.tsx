"use client";

import React from "react";
import { CATEGORIES } from "@/data/pressReleases";

interface CategoryNavProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <nav className="w-full bg-[#1e3454] border-t border-[#29456e] text-white overflow-x-auto scrollbar-none">
      <div className="max-w-[1200px] mx-auto px-4">
        <ul className="flex items-center gap-1 md:gap-2 min-w-max text-xs md:text-sm font-medium py-1">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category.id;
            return (
              <li key={category.id}>
                <button
                  onClick={() => onSelectCategory(category.id)}
                  className={`px-3 py-1.5 rounded transition-all whitespace-nowrap ${
                    isSelected
                      ? "bg-[#0066cc] text-white font-bold shadow-sm"
                      : "text-gray-200 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {category.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
