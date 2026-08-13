"use client";

import React from "react";
import AdminLayout from "@/components/AdminLayout";
import PRForm from "@/components/admin/PRForm";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowLeft } from "lucide-react";

export default function NewPressReleasePage() {
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
            <h1 className="font-extrabold text-2xl text-gray-900">プレスリリース新規作成</h1>
            <p className="text-xs text-gray-500">新規のプレスリリースを作成・配信予約します</p>
          </div>
        </div>
      </div>

      <PRForm isNew={true} />
    </AdminLayout>
  );
}
