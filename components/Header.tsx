"use client";

import React, { useState } from "react";
import { Search, Mail, User, Menu, X } from "lucide-react";

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <header className="w-full bg-[#182b45] text-white shadow-md sticky top-0 z-40">
      <div className="max-w-[1200px] mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
        {/* Logo and Tagline */}
        <div className="flex items-center gap-3 shrink-0">
          <a href="#" className="flex items-center gap-2 group">
            <span className="font-extrabold tracking-tighter text-2xl md:text-3xl text-white group-hover:text-sky-300 transition-colors">
              PR<span className="font-light text-sky-400">TIMES</span>
            </span>
          </a>
          <span className="hidden md:inline-block text-[11px] text-gray-300 border-l border-gray-600 pl-3 leading-tight">
            プレスリリース・ニュースリリース配信サービス
          </span>
        </div>

        {/* Right Controls: Desktop */}
        <div className="hidden lg:flex items-center gap-3 flex-1 justify-end">
          {/* Action buttons */}
          <a
            href="#"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#243d61] hover:bg-[#2e4d7a] rounded text-gray-100 transition-colors border border-[#395682]"
          >
            <Mail className="w-3.5 h-3.5 text-sky-300" />
            <span>プレスリリースを受信</span>
          </a>

          <a
            href="#"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-[#243d61] hover:bg-[#2e4d7a] rounded text-gray-100 transition-colors border border-[#395682]"
          >
            <User className="w-3.5 h-3.5 text-gray-300" />
            <span>ログイン</span>
          </a>

          {/* Search form */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center w-64">
            <input
              type="text"
              placeholder="キーワードで検索"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-3 pr-9 py-1.5 text-xs text-gray-900 bg-white rounded focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder-gray-400"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 bottom-0 px-2.5 bg-[#0066cc] hover:bg-[#0055b8] text-white rounded-r flex items-center justify-center transition-colors"
              title="検索"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Mobile search & menu toggle */}
        <div className="flex lg:hidden items-center gap-2 flex-1 justify-end">
          <div className="relative flex items-center flex-1 max-w-[200px]">
            <input
              type="text"
              placeholder="検索"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-2 pr-7 py-1 text-xs text-gray-900 bg-white rounded focus:outline-none placeholder-gray-400"
            />
            <Search className="w-3.5 h-3.5 text-gray-500 absolute right-2 pointer-events-none" />
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-gray-200 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#122238] border-t border-[#243d61] px-4 py-3 space-y-2">
          <a
            href="#"
            className="flex items-center gap-2 py-2 text-sm text-gray-200 hover:text-white border-b border-gray-700/50"
          >
            <Mail className="w-4 h-4 text-sky-400" />
            プレスリリースを受信
          </a>
          <a
            href="#"
            className="flex items-center gap-2 py-2 text-sm text-gray-200 hover:text-white border-b border-gray-700/50"
          >
            <User className="w-4 h-4 text-gray-400" />
            ログイン
          </a>
          <a
            href="#"
            className="block py-2 text-sm text-sky-300 font-medium"
          >
            企業様ログイン・配信申し込み
          </a>
        </div>
      )}
    </header>
  );
};
