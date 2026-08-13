import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Edit, ExternalLink, Eye, Heart, Plus } from "lucide-react";
import { CompanyAdminShell } from "@/components/admin/dashboard/CompanyAdminShell";
import { getAdminCompany } from "@/lib/adminCompany";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  const company = await getAdminCompany(companyId);

  return {
    title: company ? `${company.name} - プレスリリース` : "プレスリリース",
  };
}

/** その企業のプレスリリースだけを並べる一覧。全社横断の /admin/press-releases とは分けている */
export default async function CompanyPressReleasesPage({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) {
  const { companyId } = await params;
  const company = await getAdminCompany(companyId);

  if (!company) {
    notFound();
  }

  return (
    <CompanyAdminShell
      companyId={companyId}
      companyName={company.name}
      industryName={company.industryName}
    >
      <div className="flex flex-wrap justify-between items-end gap-3 mb-5">
        <div>
          <h1 className="font-extrabold text-[#4a332b] text-xl">プレスリリース</h1>
          <p className="mt-0.5 text-[#a98a76] text-[12px]">
            {company.name}が出した{company.releases.length}本
          </p>
        </div>

        <Link
          href={`/admin/companies/${companyId}/press-releases/new`}
          className="flex items-center gap-1.5 bg-[#e0714c] hover:bg-[#cf6242] px-4 py-2 rounded-full font-bold text-white text-[12px] transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          新規作成
        </Link>
      </div>

      {company.releases.length === 0 ? (
        <div className="bg-white p-10 border border-[#f0e2d6] border-dashed rounded-2xl text-center">
          <p className="text-[#a98a76] text-[13px]">まだプレスリリースがありません。</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {company.releases.map((release) => (
            <li
              key={release.key}
              className="flex sm:flex-row flex-col sm:items-center gap-4 bg-white p-3.5 border border-[#f0e2d6] rounded-2xl"
            >
              <div className="bg-[#f7ece3] rounded-xl w-full sm:w-28 aspect-video sm:aspect-[4/3] overflow-hidden shrink-0">
                {release.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={release.imageUrl}
                    alt={release.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[#b79c8c] text-[11px]">
                  {formatDate(release.publishedAt)}
                </p>
                <h2 className="mt-0.5 font-bold text-[#4a332b] text-[13px] leading-snug line-clamp-2">
                  {release.title}
                </h2>
                <div className="flex items-center gap-3 mt-1.5 text-[#a98a76] text-[11px]">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    {release.pageView.toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-3.5 h-3.5" />
                    {release.likeCount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={release.href}
                  target="_blank"
                  className="flex items-center gap-1.5 hover:bg-[#f7ece3] px-3 py-1.5 border border-[#f0e2d6] rounded-full text-[#6b5045] text-[11px] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  表示
                </Link>
                <Link
                  href={`/admin/companies/${companyId}/press-releases/${release.key}/edit`}
                  className="flex items-center gap-1.5 bg-[#4a332b] hover:bg-[#5c4136] px-3 py-1.5 rounded-full font-bold text-white text-[11px] transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                  編集
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </CompanyAdminShell>
  );
}
