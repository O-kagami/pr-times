import React from "react";
import AdminLayout from "@/components/AdminLayout";
import { PRESS_RELEASES } from "@/data/pressReleases";
import PRForm from "@/components/admin/PRForm";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

type Props = { params: Promise<{ id: string }> | { id: string } };

export default async function EditPage({ params }: Props) {
  const resolvedParams = await params;
  const pr = PRESS_RELEASES.find((p) => p.id === resolvedParams.id) || PRESS_RELEASES[0];

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
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/press-releases">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ArrowLeft className="w-4 h-4" />
              一覧へ戻る
            </Button>
          </Link>
          <div>
            <h1 className="font-extrabold text-2xl text-gray-900">プレスリリース編集</h1>
            <p className="text-xs text-gray-500">ID: {pr.id} のプレスリリース内容を編集します</p>
          </div>
        </div>
      </div>

      <PRForm initialData={pr} isNew={false} />
    </AdminLayout>
  );
}
