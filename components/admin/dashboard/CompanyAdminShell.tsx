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
    { title: "プレスリリース", href: "/admin/press-releases", icon: Newspaper },
    { title: "新規作成", href: "/admin/press-releases/new", icon: PenLine },
  ];

  return (
    <div className="flex lg:flex-row flex-col bg-[#fdf7f1] min-h-screen text-[#4a332b]">
      <aside className="lg:sticky lg:top-0 bg-[#fffaf5] lg:border-r border-b lg:border-b-0 border-[#f0e2d6] w-full lg:w-[248px] lg:h-screen shrink-0">
        <div className="flex lg:flex-col gap-4 lg:gap-6 px-5 lg:px-4 py-4 lg:py-6">
          <div className="min-w-0">
            <Link href="/" className="inline-block font-extrabold text-lg tracking-tight">
              PR<span className="font-light text-[#e0714c]">TIMES</span>
              <span className="ml-2 font-medium text-[#a98a76] text-[11px]">for 広報</span>
            </Link>

            <div className="hidden lg:flex items-start gap-2.5 bg-[#fdece4] mt-5 p-3 rounded-xl">
              <span className="flex justify-center items-center bg-white rounded-lg w-8 h-8 shrink-0">
                <Building2 className="w-4 h-4 text-[#e0714c]" />
              </span>
              <span className="min-w-0">
                <span className="block font-bold text-[13px] leading-snug">
                  {companyName}
                </span>
                <span className="block mt-0.5 text-[#a98a76] text-[11px]">
                  {industryName}
                </span>
              </span>
            </div>
          </div>

          <nav className="flex-1 lg:mt-2">
            <ul className="flex lg:flex-col gap-1 lg:gap-1.5 overflow-x-auto">
              {items.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <li key={item.href}>
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
