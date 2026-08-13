import React from "react";
import Link from "next/link";
import PRForm from "@/components/admin/PRForm";
import { PRESS_RELEASES, type PressRelease } from "@/data/pressReleases";
import {
  getCompanyReleaseAsPressRelease,
  parseReleaseSlug,
} from "@/lib/companiesRepository";
import { getPressReleaseById } from "@/lib/pressReleasesRepository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 企業ごとの編集画面。/admin/press-releases/[id]/edit と同じ解決の仕方をするが、
 * URLで企業が確定しているので、その企業のリリースかどうかまで見る。
 */
const resolveInitialData = async (
  companyId: string,
  id: string
): Promise<PressRelease | null> => {
  const saved = await getPressReleaseById(id);

  if (/^\d+$/.test(companyId)) {
    const numericCompanyId = Number(companyId);
    const releaseId = parseReleaseSlug(numericCompanyId, id);

    // RDSのreleaseを正として本文を読み、保存済みの編集内容（やわらかPR等）を重ねる
    const base =
      releaseId === null
        ? null
        : await getCompanyReleaseAsPressRelease(numericCompanyId, releaseId);

    if (!base) {
      return null;
    }

    return saved ? { ...base, softPr: saved.softPr, inlineNotes: saved.inlineNotes } : base;
  }

  const demo = saved ?? PRESS_RELEASES.find((release) => release.id === id) ?? null;
  return demo?.companyId === companyId ? demo : null;
};

export default async function EditCompanyPressReleasePage({
  params,
}: {
  params: Promise<{ companyId: string; id: string }>;
}) {
  const { companyId, id } = await params;
  const release = await resolveInitialData(companyId, id);
  const listHref = `/admin/companies/${companyId}/press-releases`;

  if (!release) {
    return (
      <div className="flex flex-col justify-center items-center bg-[#fdf7f1] px-6 min-h-screen text-center">
        <p className="text-[#7a5c4d] text-[13px]">
          該当のプレスリリースが見つかりませんでした。
        </p>
        <Link
          href={listHref}
          className="mt-4 px-4 py-2 border border-[#f0e2d6] rounded-full text-[#4a332b] text-[13px]"
        >
          一覧に戻る
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PRForm initialData={release} isNew={false} returnHref={listHref} />
    </div>
  );
}
