import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SeseragiHistoryPage from "@/components/SeseragiHistoryPage";

export const metadata: Metadata = {
  title: "医療法人せせらぎのHISTORY | PR TIMES",
  description:
    "医療法人せせらぎが届けてきた小児医療・子育て支援の発信を振り返る静的アーカイブです。",
};

export default async function CompanyHistoryRoute({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;

  if (companyId !== "seseragi") {
    notFound();
  }

  return <SeseragiHistoryPage />;
}
