import React from "react";
import { notFound } from "next/navigation";
import { CompanyAdminShell } from "@/components/admin/dashboard/CompanyAdminShell";
import { getAdminCompanyHeader } from "@/lib/adminCompany";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 企業ごとの管理画面（/admin/companies/[companyId]）の共通枠。
 * 全社共通の /admin とは別に、企業単位（数値ID: 杉村精工 / slug: せせらぎ）で分けている。
 */
export default async function CompanyAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  const header = await getAdminCompanyHeader(companyId);

  if (!header) {
    notFound();
  }

  return (
    <CompanyAdminShell
      companyId={companyId}
      companyName={header.name}
      industryName={header.industryName}
    >
      {children}
    </CompanyAdminShell>
  );
}
