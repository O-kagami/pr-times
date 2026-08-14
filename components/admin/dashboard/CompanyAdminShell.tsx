"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  ExternalLink,
  History,
  LayoutDashboard,
  Newspaper,
  PenLine,
} from "lucide-react";

/**
 * 企業ごとの管理画面（/admin/companies/[companyId]）の外枠。
 * 公開側のヘッダー（紺色）とは切り替えて、温かみのある配色にしている。
 */
export function CompanyAdminShell({
  companyId,
  companyName,
  industryName,
  children,
}: {
  companyId: string;
  companyName: string;
  industryName: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const publicBase = `/companies/${companyId}`;

  const items = [
    {
      title: "ダッシュボード",
      href: `/admin/companies/${companyId}`,
      icon: LayoutDashboard,
    },
    { title: "ヒストリー", href: `${publicBase}/history`, icon: History },
    {
      title: "プレスリリース",
      href: `/admin/companies/${companyId}/press-releases`,
      icon: Newspaper,
    },
    {
      title: "新規作成",
      href: `/admin/companies/${companyId}/press-releases/new`,
      icon: PenLine,
    },
  ];

  return (
    <div className="flex lg:flex-row flex-col bg-[#fdf7f1] min-h-screen text-[#4a332b]">
      <aside className="lg:sticky lg:top-0 bg-[#fffaf5] lg:border-r border-b lg:border-b-0 border-[#f0e2d6] w-full lg:w-[248px] lg:h-screen shrink-0">
        <div className="flex flex-col gap-3 lg:gap-6 px-5 lg:px-4 py-3 lg:py-6">
          {/* スマホでは1段目（ロゴ・企業名・公開ページ）、PCではサイドバー上部 */}
          <div className="flex lg:flex-col items-center lg:items-stretch gap-3 lg:gap-0 min-w-0">
            <Link
              href="/"
              className="inline-block font-extrabold text-lg tracking-tight shrink-0"
            >
              PR<span className="font-light text-[#e0714c]">TIMES</span>
              <span className="hidden lg:inline ml-2 font-medium text-[#a98a76] text-[11px]">
                for 広報
              </span>
            </Link>

            <div className="flex flex-1 lg:flex-none items-center lg:items-start gap-2 lg:gap-2.5 bg-[#fdece4] lg:mt-5 px-2.5 lg:px-3 py-1.5 lg:py-3 rounded-full lg:rounded-xl min-w-0">
              <span className="flex justify-center items-center bg-white rounded-md lg:rounded-lg w-6 lg:w-8 h-6 lg:h-8 shrink-0">
                <Building2 className="w-3.5 lg:w-4 h-3.5 lg:h-4 text-[#e0714c]" />
              </span>
              <span className="min-w-0">
                <span className="block font-bold text-[12px] lg:text-[13px] leading-snug truncate lg:whitespace-normal">
                  {companyName}
                </span>
                <span className="hidden lg:block mt-0.5 text-[#a98a76] text-[11px]">
                  {industryName}
                </span>
              </span>
            </div>

            {/* PCでは下部に同じリンクがあるので、スマホだけアイコンで出す */}
            <Link
              href={publicBase}
              aria-label="公開ページを見る"
              className="lg:hidden flex justify-center items-center bg-white border border-[#f0e2d6] rounded-full w-8 h-8 text-[#a98a76] shrink-0"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* スマホでは2段目に横スクロールのタブとして並べる */}
          <nav className="lg:flex-1 lg:mt-2 -mx-5 lg:mx-0 overflow-x-auto lg:overflow-visible [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <ul className="flex lg:flex-col gap-1 lg:gap-1.5 px-5 lg:px-0">
              {items.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.href} className="shrink-0">
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] whitespace-nowrap transition-colors ${
                        active
                          ? "bg-[#e0714c] font-bold text-white"
                          : "hover:bg-[#f7ece3] text-[#6b5045]"
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {item.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <Link
            href={publicBase}
            className="hidden lg:flex items-center gap-1.5 hover:bg-[#f7ece3] px-3 py-2 rounded-xl text-[#a98a76] text-[12px] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            公開ページを見る
          </Link>
        </div>
      </aside>

      <main className="flex-1 mx-auto px-4 sm:px-6 py-6 sm:py-8 w-full max-w-[1080px]">
        {children}
      </main>
    </div>
  );
}
