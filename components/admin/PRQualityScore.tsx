"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export interface QualityCheckItem {
  label: string;
  passed: boolean;
  hint: string;
}

export function calculateQualityScore(formData: {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  summaryHighlights?: string[];
  keywords?: string[];
  content: string;
  contactEmail?: string;
  contactTel?: string;
}) {
  const items: QualityCheckItem[] = [
    {
      label: "適切なタイトル長 (25〜80文字)",
      passed: formData.title.length >= 25 && formData.title.length <= 80,
      hint: "タイトルはニュース一覧で読まれる重要部分です。25〜80文字が推奨されます。",
    },
    {
      label: "サブタイトルの入力",
      passed: !!(formData.subtitle && formData.subtitle.trim().length > 5),
      hint: "サブタイトルを入力すると要点がクリアになります。",
    },
    {
      label: "メイン画像の設定",
      passed: !!(formData.imageUrl && formData.imageUrl.trim().length > 0),
      hint: "アイキャッチ画像があるとメディア掲載率が大幅に向上します。",
    },
    {
      label: "3つの要約ポイント",
      passed: !!(
        formData.summaryHighlights &&
        formData.summaryHighlights.filter((h) => h.trim().length > 0).length >= 3
      ),
      hint: "要約（Summary Highlights）を3つ入力すると読者の理解が早まります。",
    },
    {
      label: "キーワード・タグ設定 (3つ以上)",
      passed: !!(formData.keywords && formData.keywords.length >= 3),
      hint: "検索や関連記事での露出を増やすため、3つ以上のタグを設定しましょう。",
    },
    {
      label: "十分な本文テキスト (300文字以上)",
      passed: formData.content.length >= 300,
      hint: "本文には背景・詳細・今後の展開などの具体的な記述を含めましょう。",
    },
    {
      label: "お問い合わせ先の記載",
      passed: !!(formData.contactEmail && formData.contactTel),
      hint: "メディア取材を受けやすくするため、担当窓口情報を記載してください。",
    },
  ];

  const passedCount = items.filter((item) => item.passed).length;
  const score = Math.round((passedCount / items.length) * 100);

  let grade = "C";
  let gradeBadgeVariant: "destructive" | "amber" | "sky" | "emerald" = "destructive";
  let gradeLabel = "要改善";

  if (score >= 85) {
    grade = "S";
    gradeBadgeVariant = "emerald";
    gradeLabel = "完璧なプレスリリース";
  } else if (score >= 70) {
    grade = "A";
    gradeBadgeVariant = "sky";
    gradeLabel = "高スコア・推奨基準クリア";
  } else if (score >= 50) {
    grade = "B";
    gradeBadgeVariant = "amber";
    gradeLabel = "標準レベル";
  }

  return { score, items, grade, gradeBadgeVariant, gradeLabel };
}

export default function PRQualityScore({
  formData,
}: {
  formData: {
    title: string;
    subtitle?: string;
    imageUrl?: string;
    summaryHighlights?: string[];
    keywords?: string[];
    content: string;
    contactEmail?: string;
    contactTel?: string;
  };
}) {
  const { score, items, grade, gradeBadgeVariant, gradeLabel } = calculateQualityScore(formData);

  return (
    <Card className="border-sky-100 bg-linear-to-br from-sky-50/50 via-white to-sky-50/20">
      <CardHeader className="py-4 px-5 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold flex items-center gap-1.5 text-gray-800">
            <Sparkles className="w-4 h-4 text-sky-600" />
            PR品質アシスト・スコア
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={gradeBadgeVariant} className="text-xs px-2 py-0.5 font-bold">
              ランク {grade}
            </Badge>
            <span className="text-lg font-bold text-sky-700">{score}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="py-2 px-5 pb-4 space-y-3">
        <Progress value={score} className="h-2 bg-sky-100" barClassName={score >= 80 ? "bg-emerald-600" : score >= 60 ? "bg-sky-600" : "bg-amber-500"} />
        <p className="text-xs text-gray-600 font-medium">{gradeLabel}</p>

        <div className="space-y-1.5 pt-1">
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-2 text-xs">
              {item.passed ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
              )}
              <span className={item.passed ? "text-gray-700 font-medium" : "text-gray-400 line-through"}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
