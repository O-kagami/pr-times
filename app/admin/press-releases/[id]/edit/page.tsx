import React from "react";
import AdminLayout from "@/components/AdminLayout";
import { PRESS_RELEASES } from "@/data/pressReleases";
import PRForm from "@/components/admin/PRForm";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

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
      <PRForm initialData={pr} isNew={false} />
    </AdminLayout>
  );
}

