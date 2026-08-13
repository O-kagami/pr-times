"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/Button";

type Props = {
  initialData: any;
};

export default function PRForm({ initialData }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData.title || "");
  const [subtitle, setSubtitle] = useState(initialData.subtitle || "");
  const [company, setCompany] = useState(initialData.company || "");
  const [category, setCategory] = useState(initialData.category || "");
  const [content, setContent] = useState(initialData.content || "");

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: 接続された API に保存する実装に置き換える
    console.log("保存データ", { title, subtitle, company, category, content });
    alert("保存しました（ダミー実装）");
    router.push("/admin/press-releases");
  };

  return (
    <form onSubmit={onSave} className="space-y-4 bg-white shadow p-6 rounded-md">
      <div>
        <label className="block mb-1 font-medium text-sm">タイトル</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="px-3 py-2 border rounded w-full text-sm"
        />
      </div>

      <div>
        <label className="block mb-1 font-medium text-sm">サブタイトル</label>
        <input
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          className="px-3 py-2 border rounded w-full text-sm"
        />
      </div>

      <div className="gap-4 grid grid-cols-2">
        <div>
          <label className="block mb-1 font-medium text-sm">企業</label>
          <input value={company} onChange={(e) => setCompany(e.target.value)} className="px-3 py-2 border rounded w-full text-sm" />
        </div>
        <div>
          <label className="block mb-1 font-medium text-sm">カテゴリ</label>
          <input value={category} onChange={(e) => setCategory(e.target.value)} className="px-3 py-2 border rounded w-full text-sm" />
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium text-sm">本文</label>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={10} className="px-3 py-2 border rounded w-full text-sm" />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={() => router.push("/admin/press-releases")}>キャンセル</Button>
        <Button type="submit">保存</Button>
      </div>
    </form>
  );
}
