import React from "react";
import AdminLayout from "../../../../../components/AdminLayout";
import { PRESS_RELEASES } from "../../../../../data/pressReleases";
import PRForm from "../../../../../components/admin/PRForm";

type Props = { params: { id: string } };

export default function EditPage({ params }: Props) {
  const pr = PRESS_RELEASES.find((p) => p.id === params.id);
  if (!pr) {
    return (
      <AdminLayout>
        <div className="p-6">該当のプレスリリースが見つかりません。</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h2 className="mb-4 font-semibold text-2xl">プレスリリースを編集</h2>
      <PRForm initialData={pr} />
    </AdminLayout>
  );
}
