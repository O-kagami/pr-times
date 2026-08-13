import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PRESS_RELEASES } from "@/data/pressReleases";
import { ArticlePage } from "@/components/ArticlePage";
import {
  getCompanyReleaseAsPressRelease,
  parseReleaseSlug,
} from "@/lib/companiesRepository";
import { getPressReleaseById } from "@/lib/pressReleasesRepository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * companyId が数値なら RDS の release から本文を取得し、
 * slug なら data/pressReleases.ts のデモ記事を表示する。
 * （企業ページ /companies/[companyId] と同じ出し分け）
 */
export default async function PressReleaseDetail({
  params,
}: {
  params: Promise<{ companyId: string; releaseId: string }>;
}) {
  const { companyId, releaseId } = await params;

  if (/^\d+$/.test(companyId)) {
    const numericCompanyId = Number(companyId);
    const numericReleaseId = parseReleaseSlug(numericCompanyId, releaseId);

    // DBを正とする企業の記事は、見つからなければ別記事にフォールバックせず404にする
    const dbRelease =
      numericReleaseId === null
        ? null
        : await getCompanyReleaseAsPressRelease(numericCompanyId, numericReleaseId);

    if (!dbRelease) {
      notFound();
    }

    // 本文は release テーブルを正とし、管理画面で保存した内容
    // （やわらかPRのコメントなど）を press_releases から重ねる
    const edited = await getPressReleaseById(dbRelease.id);
    const release = edited
      ? { ...dbRelease, softPr: edited.softPr, inlineNotes: edited.inlineNotes }
      : dbRelease;

    return (
      <Suspense fallback={null}>
        <ArticlePage release={release} />
      </Suspense>
    );
  }

  const release =
    PRESS_RELEASES.find(
      (r) => r.id === releaseId && r.companyId === companyId
    ) || PRESS_RELEASES[0];

  return (
    <Suspense fallback={null}>
      <ArticlePage release={release} />
    </Suspense>
  );
}
