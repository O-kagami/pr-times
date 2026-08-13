import React from "react";
import AdminLayout from "@/components/AdminLayout";
import { PRESS_RELEASES, type PressRelease } from "@/data/pressReleases";
import PRForm from "@/components/admin/PRForm";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  getCompanyReleaseAsPressRelease,
  parseReleaseKey,
} from "@/lib/companiesRepository";
import { getPressReleaseById } from "@/lib/pressReleasesRepository";

type Props = { params: Promise<{ id: string }> | { id: string } };

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 編集対象を、記事ページと同じ優先順で解決する。
 * 保存済みの内容をDBから読むので、リロードしても編集内容が残る。
 */
const resolveInitialData = async (id: string): Promise<PressRelease | null> => {
  const saved = await getPressReleaseById(id);
  const key = parseReleaseKey(id);

  if (key) {
    // RDSのreleaseを正とする記事。本文をDBから読み、保存済みの編集内容を重ねる
    const base = await getCompanyReleaseAsPressRelease(key.companyId, key.releaseId);
    if (base) {
      return saved
        ? { ...base, softPr: saved.softPr, inlineNotes: saved.inlineNotes }
        : base;
    }
  }

  return saved ?? PRESS_RELEASES.find((p) => p.id === id) ?? null;
};

export default async function EditPage({ params }: Props) {
  const resolvedParams = await params;
  const pr = await resolveInitialData(resolvedParams.id);

  if (!pr) {
    return (
      <AdminLayout>
        <div className="p-6 text-center py-12">
          <p className="text-gray-500 mb-4">該当のプレスリリースが見つかりませんでした。</p>
          <Link href="/admin/press-releases">
            <Button variant="outline">一覧に戻る</Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PRForm initialData={pr} isNew={false} />
    </AdminLayout>
  );
}
