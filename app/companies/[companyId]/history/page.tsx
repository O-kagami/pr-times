import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Images } from "lucide-react";
import { getAdminCompanyHeader } from "@/lib/adminCompany";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * PRを振り返るヒストリー（スライドショー）の置き場所。
 * 中身は未実装で、いまはダッシュボードからの導線が切れないようにするためのページ。
 */
export default async function CompanyHistoryPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  const header = await getAdminCompanyHeader(companyId);

  if (!header) {
    notFound();
  }

  return (
    <div className="flex flex-col justify-center items-center bg-[#fdf7f1] px-6 min-h-screen text-[#4a332b] text-center">
      <span className="flex justify-center items-center bg-[#fdece4] rounded-2xl w-14 h-14">
        <Images className="w-6 h-6 text-[#e0714c]" />
      </span>

      <h1 className="mt-5 font-extrabold text-xl">{header.name}のヒストリー</h1>

      <p className="mt-2 max-w-md text-[#7a5c4d] text-[13px] leading-relaxed">
        これまでのPRをスライドショーで振り返る機能は準備中です。
      </p>

      <Link
        href={`/admin/companies/${companyId}`}
        className="inline-flex items-center gap-2 hover:bg-[#f7ece3] mt-6 px-4 py-2 border border-[#f0e2d6] rounded-full text-[13px] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        ダッシュボードに戻る
      </Link>
    </div>
  );
}
