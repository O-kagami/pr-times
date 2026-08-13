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
 * プレスリリース詳細ページ
 * 1. 管理画面等で DB (press_releases テーブル) に保存された内容を取得
 * 2. companyId が数値の場合は RDS (release / company テーブル) の情報も確認し統合
 * 3. DB (press_releases) に該当記事が存在する場合はそれを優先表示
 * 4. デモデータ (data/pressReleases.ts) を検索して表示
 * 5. どこにも存在しない場合は 404
 */
export default async function PressReleaseDetail({
  params,
}: {
  params: Promise<{ companyId: string; releaseId: string }>;
}) {
  const { companyId, releaseId } = await params;

  // 1. 管理画面等で DB (press_releases テーブル) に保存された記事を取得
  const savedDbRelease = await getPressReleaseById(releaseId);

  // 2. companyId が数値の場合、RDS (release / company テーブル) も確認
  if (/^\d+$/.test(companyId)) {
    const numericCompanyId = Number(companyId);
    const numericReleaseId = parseReleaseSlug(numericCompanyId, releaseId);

    const dbRelease =
      numericReleaseId === null
        ? null
        : await getCompanyReleaseAsPressRelease(numericCompanyId, numericReleaseId);

    if (dbRelease) {
      // 本文は release テーブルを正とし、管理画面で保存した内容（やわらかPRなど）を重ねる
      const release = savedDbRelease
        ? { ...dbRelease, softPr: savedDbRelease.softPr, inlineNotes: savedDbRelease.inlineNotes }
        : dbRelease;

      return (
        <Suspense fallback={null}>
          <ArticlePage release={release} />
        </Suspense>
      );
    }
  }

  // 3. DB (press_releases テーブル) に該当記事があれば表示
  if (savedDbRelease) {
    return (
      <Suspense fallback={null}>
        <ArticlePage release={savedDbRelease} />
      </Suspense>
    );
  }

  // 4. デモデータ (data/pressReleases.ts) から検索
  const staticRelease =
    PRESS_RELEASES.find(
      (r) => r.id === releaseId && (r.companyId === companyId || !r.companyId)
    ) || PRESS_RELEASES.find((r) => r.id === releaseId);

  if (staticRelease) {
    return (
      <Suspense fallback={null}>
        <ArticlePage release={staticRelease} />
      </Suspense>
    );
  }

  // 5. どこにも存在しない場合は 404
  notFound();
}
