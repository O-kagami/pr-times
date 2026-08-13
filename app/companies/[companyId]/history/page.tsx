import { notFound } from "next/navigation";
import CompanyHistoryPage from "../../../../components/CompanyHistoryPage";
import { COMPANY_DIRECTORY, getCompany } from "../../../../data/companies";

export function generateStaticParams() {
  return COMPANY_DIRECTORY.map((company) => ({ companyId: company.companyId }));
}

export default async function PublicCompanyHistoryPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  const company = getCompany(companyId);
  if (!company) notFound();

  return <CompanyHistoryPage company={company} />;
}
