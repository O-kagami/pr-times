import React from "react";
import AdminLayout from "@/components/AdminLayout";
import { PRESS_RELEASES } from "@/data/pressReleases";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, ExternalLink } from "lucide-react";

export default function PressReleasesPage() {
  return (
    <AdminLayout>
      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="font-extrabold text-2xl text-gray-900">プレスリリース管理</h1>
          <p className="text-xs text-gray-500">自社の配信済み・下書き・予約配信プレスリリース一覧</p>
        </div>
        <Link href="/admin/press-releases/new">
          <Button variant="accent" className="font-bold shadow-xs">
            <Plus className="w-4 h-4" />
            新規プレスリリース作成
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="px-5 py-3">プレスリリース名</th>
                <th className="px-4 py-3">企業</th>
                <th className="px-4 py-3">カテゴリ</th>
                <th className="px-4 py-3">公開日時</th>
                <th className="px-4 py-3 text-right">閲覧数 (PV)</th>
                <th className="px-5 py-3 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {PRESS_RELEASES.map((pr) => (
                <tr key={pr.id} className="hover:bg-sky-50/30 transition-colors">
                  <td className="px-5 py-4 max-w-[420px]">
                    <div className="font-semibold text-gray-900 truncate hover:text-sky-600 transition-colors">
                      {pr.title}
                    </div>
                    {pr.subtitle && (
                      <div className="text-xs text-gray-500 truncate mt-0.5">{pr.subtitle}</div>
                    )}
                  </td>
                  <td className="px-4 py-4 text-xs font-medium text-gray-700">{pr.company}</td>
                  <td className="px-4 py-4">
                    <Badge variant="sky" className="text-[11px]">
                      {pr.category}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-xs text-gray-500 whitespace-nowrap">{pr.publishedAt}</td>
                  <td className="px-4 py-4 text-right font-mono text-xs font-bold text-gray-800">
                    {pr.pvCount != null ? pr.pvCount.toLocaleString() : "-"}
                  </td>
                  <td className="px-5 py-4 text-right whitespace-nowrap">
                    <div className="flex justify-end gap-2">
                      <Link href={`/${pr.companyId}/${pr.id}`} target="_blank">
                        <Button variant="outline" size="sm" className="h-8 text-xs">
                          <ExternalLink className="w-3.5 h-3.5" />
                          表示
                        </Button>
                      </Link>
                      <Link href={`/admin/press-releases/${pr.id}/edit`}>
                        <Button variant="default" size="sm" className="h-8 text-xs font-semibold">
                          <Edit className="w-3.5 h-3.5" />
                          編集
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
