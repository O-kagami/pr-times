import React from "react";
import AdminLayout from "../../../components/AdminLayout";
import { PRESS_RELEASES } from "../../../data/pressReleases";
import Link from "next/link";
import { Button } from "../../../components/ui/Button";

export default function PressReleasesPage() {
  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-2xl">プレスリリース</h2>
        <Link href="/admin/press-releases/new">
          <Button variant="accent">新規作成</Button>
        </Link>
      </div>

      <div className="bg-white shadow-sm rounded-md overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">タイトル</th>
              <th className="px-4 py-3 text-left">企業</th>
              <th className="px-4 py-3 text-left">カテゴリ</th>
              <th className="px-4 py-3 text-left">公開日</th>
              <th className="px-4 py-3 text-right">PV</th>
              <th className="px-4 py-3 text-right">操作</th>
            </tr>
          </thead>
          <tbody>
            {PRESS_RELEASES.map((pr) => (
              <tr key={pr.id} className="border-t">
                <td className="px-4 py-3 max-w-[480px] truncate">{pr.title}</td>
                <td className="px-4 py-3">{pr.company}</td>
                <td className="px-4 py-3">{pr.category}</td>
                <td className="px-4 py-3">{pr.publishedAt}</td>
                <td className="px-4 py-3 text-right">{pr.pvCount ?? "-"}</td>
                <td className="flex justify-end gap-2 px-4 py-3 text-right">
                  <Link href={`/${pr.companyId}/${pr.id}`}>
                    <Button variant="ghost">表示</Button>
                  </Link>
                  <Link href={`/admin/press-releases/${pr.id}/edit`}>
                    <Button variant="default">編集</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
