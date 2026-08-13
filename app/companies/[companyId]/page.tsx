import { notFound } from "next/navigation";
import CompanyDemoPage from "@/components/CompanyDemoPage";
import { CompanyDbPage } from "@/components/CompanyDbPage";
import { getCompany, listCompanyReleases } from "@/lib/companiesRepository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * companyId が数値（例: 163727）なら RDS を正とする実装、
 * slug（例: seseragi）なら data/pressReleases.ts のデモ実装を出し分ける。
 * デモ用の静的データとDBの実データが混ざらないようにするための分岐。
 */
export default async function CompanyPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;

  if (!/^\d+$/.test(companyId)) {
    return <CompanyDemoPage companyId={companyId} />;
  }

  const numericId = Number(companyId);
  const company = await getCompany(numericId);

  if (!company) {
    notFound();
  }

  const releases = await listCompanyReleases(numericId);

  return <CompanyDbPage company={company} releases={releases} />;
}
