import React from "react";
import { notFound } from "next/navigation";
import PRForm from "@/components/admin/PRForm";
import type { PressRelease } from "@/data/pressReleases";
import { getAdminCompany } from "@/lib/adminCompany";
import { getCompany } from "@/lib/companiesRepository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 企業を確定させた状態で開く新規作成画面。
 * どの企業のリリースを書いているのかがURLで決まるので、
 * フォームの企業名・企業情報はここで埋めて渡す。
 */
export default async function NewCompanyPressReleasePage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  const company = await getAdminCompany(companyId);

  if (!company) {
    notFound();
  }

  const initialData: Partial<PressRelease> = {
    companyId,
    company: company.name,
  };

  // RDSを正とする企業は、企業情報も入力済みの状態から書き始められるようにする
  if (/^\d+$/.test(companyId)) {
    const dbCompany = await getCompany(Number(companyId));

    if (dbCompany) {
      initialData.companyProfile = {
        name: dbCompany.name,
        representative: dbCompany.president || "-",
        address: dbCompany.address || "-",
        established: dbCompany.foundationDate || "-",
        capital:
          dbCompany.capital > 0 ? `${dbCompany.capital.toLocaleString()}万円` : "-",
        business: dbCompany.description || "-",
        website: dbCompany.url || "",
      };
    }
  }

  return (
    <div className="p-6">
      <PRForm
        isNew
        initialData={initialData}
        returnHref={`/admin/companies/${companyId}/press-releases`}
      />
    </div>
  );
}
