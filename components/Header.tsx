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
    <header className="top-0 z-40 sticky bg-[#182b45] shadow-md w-full text-white">
      <div className="flex justify-between items-center gap-4 mx-auto px-4 py-2.5 max-w-[1200px]">
        {/* Logo and Tagline */}
        <div className="flex items-center gap-3 shrink-0">
          <a href="#" className="group flex items-center gap-2">
            <span className="font-extrabold text-white group-hover:text-sky-300 text-2xl md:text-3xl tracking-tighter transition-colors">
              PR<span className="font-light text-sky-400">TIMES</span>
            </span>
          </a>
          <span className="hidden md:inline-block pl-3 border-gray-600 border-l text-[11px] text-gray-300 leading-tight">
            プレスリリース・ニュースリリース配信サービス
          </span>
        </div>

        {/* Right Controls: Desktop */}
        <div className="hidden lg:flex flex-1 justify-end items-center gap-3">
          {/* Action buttons */}
          <a
            href="#"
            className="flex items-center gap-1.5 bg-[#243d61] hover:bg-[#2e4d7a] px-3 py-1.5 border border-[#395682] rounded font-medium text-gray-100 text-xs transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-sky-300" />
            <span>プレスリリースを受信</span>
          </a>

          <a
            href="#"
            className="flex items-center gap-1 bg-[#243d61] hover:bg-[#2e4d7a] px-3 py-1.5 border border-[#395682] rounded font-medium text-gray-100 text-xs transition-colors"
          >
            <User className="w-3.5 h-3.5 text-gray-300" />
            <span>ログイン</span>
          </a>

          <a
            href="/admin"
            className="flex items-center gap-1 bg-[#ffd24d] hover:bg-[#ffcf3b] px-3 py-1.5 border border-[#e0b93b] rounded font-medium text-[#1b1b1b] text-xs transition-colors"
          >
            <span>管理画面</span>
          </a>

          {/* Search form */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center w-64">
            <input
              type="text"
              placeholder="キーワードで検索"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-white py-1.5 pr-9 pl-3 rounded focus:outline-none focus:ring-2 focus:ring-sky-400 w-full text-gray-900 text-xs placeholder-gray-400"
            />
            <button
              type="submit"
              className="top-0 right-0 bottom-0 absolute flex justify-center items-center bg-[#0066cc] hover:bg-[#0055b8] px-2.5 rounded-r text-white transition-colors"
              title="検索"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Mobile search & menu toggle */}
        <div className="lg:hidden flex flex-1 justify-end items-center gap-2">
          <div className="relative flex flex-1 items-center max-w-[200px]">
            <input
              type="text"
              placeholder="検索"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-white py-1 pr-7 pl-2 rounded focus:outline-none w-full text-gray-900 text-xs placeholder-gray-400"
            />
            <Search className="right-2 absolute w-3.5 h-3.5 text-gray-500 pointer-events-none" />
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
        <div className="lg:hidden space-y-2 bg-[#122238] px-4 py-3 border-[#243d61] border-t">
          <a
            href="#"
            className="flex items-center gap-2 py-2 border-gray-700/50 border-b text-gray-200 hover:text-white text-sm"
          >
            <Mail className="w-4 h-4 text-sky-400" />
            プレスリリースを受信
          </a>
          <a
            href="#"
            className="flex items-center gap-2 py-2 border-gray-700/50 border-b text-gray-200 hover:text-white text-sm"
          >
            <User className="w-4 h-4 text-gray-400" />
            ログイン
          </a>
          <a
            href="#"
            className="block py-2 font-medium text-sky-300 text-sm"
          >
            企業様ログイン・配信申し込み
          </a>
          <a
            href="/admin"
            className="block py-2 font-medium text-yellow-300 text-sm"
          >
            管理画面
          </a>
        </div>
      )}
    </header>
  );
};
