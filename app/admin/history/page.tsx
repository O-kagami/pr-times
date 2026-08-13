import { redirect } from "next/navigation";
import { getCompanySlugByAdminId } from "../../../data/companies";

export default async function LegacyAdminHistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ companyId?: string | string[] }>;
}) {
  const params = await searchParams;
  const rawCompanyId = Array.isArray(params.companyId)
    ? params.companyId[0]
    : params.companyId;
  const companyId = Number(rawCompanyId ?? 1001);
  redirect(`/companies/${getCompanySlugByAdminId(companyId)}/history`);
}
