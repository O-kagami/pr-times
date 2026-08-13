"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { CATEGORIES, PressRelease, TRENDING_KEYWORDS } from "@/data/pressReleases";
import PRQualityScore from "@/components/admin/PRQualityScore";
import PRPreviewModal from "@/components/admin/PRPreviewModal";
import {
  Eye,
  Send,
  Image as ImageIcon,
  Plus,
  Sparkles,
  Tag,
  Calendar,
  Building,
  FileText,
  CheckCircle,
  Clock,
  Columns,
} from "lucide-react";

type PRFormProps = {
  initialData?: Partial<PressRelease>;
  isNew?: boolean;
};

const SAMPLE_PRESET_IMAGES = [
  { label: "テクノロジー/AI", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80" },
  { label: "オフィス/チーム", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80" },
  { label: "製品/イノベーション", url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80" },
  { label: "ヘルスケア/医療", url: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&auto=format&fit=crop&q=80" },
  { label: "グルメ/スイーツ", url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80" },
];

export default function PRForm({ initialData = {}, isNew = false }: PRFormProps) {
  const router = useRouter();

  // Mode state: edit | preview | split
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">("edit");
  const [modalOpen, setModalOpen] = useState(false);
  const [savedToast, setSavedToast] = useState<string | null>(null);
  const [lastSavedTime, setLastSavedTime] = useState<string>("保存済み");

  // Main Form fields
  const [title, setTitle] = useState(initialData.title || "");
  const [subtitle, setSubtitle] = useState(initialData.subtitle || "");
  const [company, setCompany] = useState(initialData.company || "株式会社PR TIMES");
  const [companyId, setCompanyId] = useState(initialData.companyId || "prtimes");
  const [category, setCategory] = useState(initialData.category || "テクノロジー");
  const [subCategory, setSubCategory] = useState(initialData.subCategory || "Webサービス");
  const [publishedAt, setPublishedAt] = useState(
    initialData.publishedAt || new Date().toISOString().slice(0, 16)
  );
  const [isScheduled, setIsScheduled] = useState(false);

  const [imageUrl, setImageUrl] = useState(
    initialData.imageUrl || SAMPLE_PRESET_IMAGES[0].url
  );
  const [secondaryImages, setSecondaryImages] = useState<string[]>(
    initialData.secondaryImages || []
  );

  // Summary highlights (3 points)
  const [summaryHighlights, setSummaryHighlights] = useState<string[]>(
    initialData.summaryHighlights && initialData.summaryHighlights.length > 0
      ? initialData.summaryHighlights
      : ["", "", ""]
  );

  // Main Content
  const [content, setContent] = useState(initialData.content || "");

  // Keywords
  const [keywords, setKeywords] = useState<string[]>(
    initialData.keywords || ["新商品", "Webサービス", "AI"]
  );
  const [tagInput, setTagInput] = useState("");

  // Contact & Profile
  const [contactDepartment, setContactDepartment] = useState(
    initialData.contactInfo?.department || "広報担当事務局"
  );
  const [contactPerson, setContactPerson] = useState(
    initialData.contactInfo?.person || "広報 太郎"
  );
  const [contactEmail, setContactEmail] = useState(
    initialData.contactInfo?.email || "pr@example.com"
  );
  const [contactTel, setContactTel] = useState(
    initialData.contactInfo?.tel || "03-1234-5678"
  );

  const [representative, setRepresentative] = useState(
    initialData.companyProfile?.representative || "代表取締役社長"
  );
  const [address, setAddress] = useState(
    initialData.companyProfile?.address || "東京都千代田区麹町2-1"
  );
  const [business, setBusiness] = useState(
    initialData.companyProfile?.business || "プレスリリース配信事業"
  );
  const [website, setWebsite] = useState(
    initialData.companyProfile?.website || "https://prtimes.jp"
  );

  // Distribution options
  const [distributeWeb, setDistributeWeb] = useState(true);
  const [distributePartners, setDistributePartners] = useState(true);
  const [distributeSns, setDistributeSns] = useState(true);

  // Auto-save effect simulator
  useEffect(() => {
    const timer = setTimeout(() => {
      const now = new Date();
      setLastSavedTime(
        `${now.getHours().toString().padStart(2, "0")}:${now
          .getMinutes()
          .toString()
          .padStart(2, "0")} 下書き自動保存`
      );
    }, 4000);
    return () => clearTimeout(timer);
  }, [title, subtitle, content, keywords, imageUrl]);

  // Insert Rich Text Formatting Snippets
  const insertSnippet = (snippet: string) => {
    setContent((prev) => prev + "\n" + snippet);
  };

  // Keywords Handlers
  const handleAddKeyword = () => {
    if (tagInput.trim() && !keywords.includes(tagInput.trim())) {
      setKeywords([...keywords, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveKeyword = (tagToRemove: string) => {
    setKeywords(keywords.filter((k) => k !== tagToRemove));
  };

  const handleQuickAddKeyword = (kw: string) => {
    if (!keywords.includes(kw)) {
      setKeywords([...keywords, kw]);
    }
  };

  // Submit Handler
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast("プレスリリースを正常に保存しました！");
    setTimeout(() => {
      router.push("/admin/press-releases");
    }, 1200);
  };

  // Current Form Object for Quality score & Preview
  const currentFormData = {
    id: initialData.id || `pr-${Date.now().toString().slice(-4)}`,
    title,
    subtitle,
    company,
    companyId,
    category,
    subCategory,
    publishedAt: isScheduled ? publishedAt.replace("T", " ") : "2026年8月13日 15:00",
    imageUrl,
    secondaryImages,
    summaryHighlights,
    content,
    keywords,
    companyProfile: {
      name: company,
      representative,
      address,
      established: "2014年",
      capital: "1,000万円",
      business,
      website,
    },
    contactInfo: {
      department: contactDepartment,
      person: contactPerson,
      email: contactEmail,
      tel: contactTel,
      website,
    },
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 pb-20">
      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-xl text-sm font-medium animate-in fade-in slide-in-from-top-3">
          <CheckCircle className="w-5 h-5 text-white" />
          {savedToast}
        </div>
      )}

      {/* Header Sticky Control Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 py-3 px-4 -mx-4 sm:-mx-6 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-gray-600 bg-gray-50 flex items-center gap-1">
            <Clock className="w-3 h-3 text-sky-600" />
            {lastSavedTime}
          </Badge>
          <span className="text-xs text-gray-400 hidden md:inline">
            | {content.length} 文字
          </span>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg border border-gray-200">
          <button
            type="button"
            onClick={() => setViewMode("edit")}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              viewMode === "edit"
                ? "bg-white text-gray-900 shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            編集
          </button>
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={`hidden md:flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              viewMode === "split"
                ? "bg-white text-gray-900 shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            左右スプリット
          </button>
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              viewMode === "preview"
                ? "bg-white text-gray-900 shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            プレビュー
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1"
          >
            <Eye className="w-4 h-4 text-sky-600" />
            確認モーダル
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/press-releases")}
          >
            キャンセル
          </Button>
          <Button type="submit" variant="default" size="sm" className="font-bold">
            <Send className="w-4 h-4" />
            {isNew ? "配信登録・公開" : "更新を保存"}
          </Button>
        </div>
      </div>

      {/* Main Container Layout (Full Edit / Split / Preview) */}
      {viewMode === "preview" ? (
        /* Full Preview View */
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <Badge variant="sky">{category}</Badge>
              <span className="text-xs text-gray-400">2026年8月13日 配信予定</span>
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">{title || "無題のプレスリリース"}</h1>
            {subtitle && <h2 className="text-lg text-gray-600 font-medium border-l-4 border-sky-500 pl-3">{subtitle}</h2>}
            {imageUrl && (
              <img src={imageUrl} alt="Main PR" className="w-full max-h-[420px] object-cover rounded-lg border border-gray-200" />
            )}
            <div className="prose max-w-none text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">
              {content || "本文がありません。"}
            </div>
          </Card>
        </div>
      ) : (
        /* Edit or Split View */
        <div className={`grid gap-6 ${viewMode === "split" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 lg:grid-cols-3"}`}>
          {/* Left / Main Editor Section (Spans 2 cols in edit mode) */}
          <div className={`space-y-6 ${viewMode === "split" ? "col-span-1" : "lg:col-span-2"}`}>
            {/* 1. タイトル ＆ サブタイトル */}
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-sky-600" />
                  基本情報
                </CardTitle>
                <CardDescription>プレスリリースの見出しと配信カテゴリを設定します</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <Label required htmlFor="title">
                      プレスリリース タイトル
                    </Label>
                    <span
                      className={`text-xs ${
                        title.length > 80
                          ? "text-amber-600 font-bold"
                          : title.length < 25
                          ? "text-gray-400"
                          : "text-emerald-600 font-semibold"
                      }`}
                    >
                      {title.length} / 100文字 (推奨: 25〜80文字)
                    </span>
                  </div>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="【〇〇社】AIを活用した新サービス「PR Assistant」を本日より提供開始"
                    className="font-semibold text-base py-2.5"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="subtitle" className="mb-1.5">
                    サブタイトル (補足・副題)
                  </Label>
                  <Input
                    id="subtitle"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="業務効率化を50%向上させる革新的な広報支援ソリューション"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <Label htmlFor="category" className="mb-1.5">
                      メインカテゴリ
                    </Label>
                    <Select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="subCategory" className="mb-1.5">
                      サブカテゴリ
                    </Label>
                    <Input
                      id="subCategory"
                      value={subCategory}
                      onChange={(e) => setSubCategory(e.target.value)}
                      placeholder="例: Webサービス, AI開発"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. メイン画像 & 画像ライブラリ */}
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-sky-600" />
                  メイン画像 ＆ アセット
                </CardTitle>
                <CardDescription>プレスリリースのアイキャッチ画像を登録します</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="imageUrl" className="mb-1.5">
                    メイン画像 URL
                  </Label>
                  <Input
                    id="imageUrl"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                {/* Preset image picker */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-gray-500">サンプル画像から選択:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {SAMPLE_PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImageUrl(preset.url)}
                        className={`relative rounded-md overflow-hidden border-2 transition-all ${
                          imageUrl === preset.url ? "border-sky-600 ring-2 ring-sky-300" : "border-gray-200 hover:border-sky-300"
                        }`}
                      >
                        <img src={preset.url} alt={preset.label} className="h-16 w-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] p-0.5 truncate text-center">
                          {preset.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview of main image */}
                {imageUrl && (
                  <div className="mt-3 relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 p-2">
                    <p className="text-xs text-gray-500 mb-1 font-semibold">プレビュー確認:</p>
                    <img src={imageUrl} alt="PR Main Preview" className="max-h-56 w-auto mx-auto rounded object-cover" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 3. 要約ポイント (Summary Highlights) */}
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-600" />
                  要約ポイント (3つの特長)
                </CardTitle>
                <CardDescription>プレスリリースの冒頭に表示される3つの重要箇条書き</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {summaryHighlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <Input
                      value={highlight}
                      onChange={(e) => {
                        const updated = [...summaryHighlights];
                        updated[idx] = e.target.value;
                        setSummaryHighlights(updated);
                      }}
                      placeholder={`ポイント ${idx + 1}: 例）業界最速クラスの処理速度を実現`}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 4. 本文エディタ (Content Editor) */}
            <Card>
              <CardHeader className="py-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-600" />
                    プレスリリース本文
                  </CardTitle>
                  <CardDescription>詳細な本文を入力します (Markdown記述対応)</CardDescription>
                </div>

                {/* Quick Editor Toolbar */}
                <div className="flex flex-wrap items-center gap-1 bg-gray-100 p-1 rounded-md text-xs">
                  <button
                    type="button"
                    onClick={() => insertSnippet("\n## 見出し2タイトルの入力\n")}
                    className="px-2 py-1 bg-white hover:bg-gray-200 rounded font-bold text-gray-700"
                    title="見出し2を挿入"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSnippet("\n### 見出し3タイトルの入力\n")}
                    className="px-2 py-1 bg-white hover:bg-gray-200 rounded font-bold text-gray-700"
                    title="見出し3を挿入"
                  >
                    H3
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSnippet("**強調テキスト**")}
                    className="px-2 py-1 bg-white hover:bg-gray-200 rounded font-extrabold text-gray-800"
                    title="太字"
                  >
                    B
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSnippet("\n- 箇条書き項目1\n- 箇条書き項目2\n")}
                    className="px-2 py-1 bg-white hover:bg-gray-200 rounded text-gray-700"
                    title="リスト挿入"
                  >
                    • リスト
                  </button>
                  <button
                    type="button"
                    onClick={() => insertSnippet("\n> 担当者コメント：「〇〇〇〇〇〇〇〇」\n")}
                    className="px-2 py-1 bg-white hover:bg-gray-200 rounded text-gray-700"
                    title="引用"
                  >
                    引用
                  </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={14}
                  placeholder="プレスリリースの本文を入力してください...&#10;&#10;【開発の背景】&#10;近年、〇〇の需要が急速に高まっており...&#10;&#10;【製品の概要】&#10;本サービスは以下の特徴を備えています..."
                  className="font-sans leading-relaxed text-sm"
                  required
                />
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>推奨文字数: 500〜2,000文字</span>
                  <span className="font-semibold">{content.length} 文字</span>
                </div>
              </CardContent>
            </Card>

            {/* 5. タグ・キーワード設定 */}
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Tag className="w-4 h-4 text-sky-600" />
                  キーワード・タグ設定
                </CardTitle>
                <CardDescription>検索・関連ニュース露出を高めるキーワードを登録します</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                    placeholder="例: AI, DX推進, 限定イベント"
                  />
                  <Button type="button" variant="outline" onClick={handleAddKeyword}>
                    <Plus className="w-4 h-4" />
                    追加
                  </Button>
                </div>

                {/* Active Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  {keywords.map((kw) => (
                    <Badge
                      key={kw}
                      variant="sky"
                      className="px-3 py-1 text-xs flex items-center gap-1.5 bg-sky-100 text-sky-800 border-sky-300"
                    >
                      #{kw}
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(kw)}
                        className="hover:text-red-600 font-bold ml-1"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>

                {/* Suggested Keywords */}
                <div className="pt-2">
                  <span className="text-xs font-semibold text-gray-500 mr-2">トレンド推奨キーワード:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {TRENDING_KEYWORDS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => handleQuickAddKeyword(item)}
                        className="text-xs bg-gray-100 hover:bg-sky-50 hover:text-sky-700 border border-gray-200 rounded px-2 py-0.5 transition-colors"
                      >
                        + #{item}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 6. お問い合わせ先 & 企業情報 */}
            <Card>
              <CardHeader className="py-4">
                <CardTitle className="text-base flex items-center gap-2">
                  <Building className="w-4 h-4 text-sky-600" />
                  お問い合わせ先 ＆ 企業情報
                </CardTitle>
                <CardDescription>メディア取材・一般問い合わせ用の情報を設定します</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactDepartment" className="mb-1">
                      担当部署
                    </Label>
                    <Input
                      id="contactDepartment"
                      value={contactDepartment}
                      onChange={(e) => setContactDepartment(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPerson" className="mb-1">
                      担当者名
                    </Label>
                    <Input
                      id="contactPerson"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactEmail" className="mb-1">
                      メールアドレス
                    </Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactTel" className="mb-1">
                      電話番号
                    </Label>
                    <Input
                      id="contactTel"
                      value={contactTel}
                      onChange={(e) => setContactTel(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column / Assistant & Live Preview Panel */}
          {viewMode === "split" ? (
            /* Live Preview Panel in Split View */
            <div className="col-span-1 space-y-6">
              <Card className="sticky top-20 max-h-[85vh] overflow-y-auto p-6 space-y-4 border-sky-200">
                <div className="flex items-center justify-between border-b pb-2">
                  <Badge variant="emerald" className="text-xs">ライブプレビュー</Badge>
                  <span className="text-xs text-gray-400">リアルタイム同期中</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{title || "タイトル未入力"}</h2>
                {subtitle && <p className="text-xs text-gray-600 border-l-2 border-sky-500 pl-2">{subtitle}</p>}
                {imageUrl && <img src={imageUrl} alt="preview" className="w-full h-40 object-cover rounded" />}
                <div className="text-xs text-gray-700 whitespace-pre-wrap leading-normal line-clamp-12">
                  {content || "本文を入力するとここに表示されます..."}
                </div>
              </Card>
            </div>
          ) : (
            /* Normal Right Sidebar: Quality Score & Publish Settings */
            <div className="col-span-1 space-y-6">
              {/* Quality Score Assist Widget */}
              <PRQualityScore formData={currentFormData} />

              {/* Publish / Schedule Settings Card */}
              <Card>
                <CardHeader className="py-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-sky-600" />
                    配信・スケジュール設定
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Immediate vs Schedule switch */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">予約配信を行う</p>
                      <p className="text-xs text-gray-500">指定した日時に自動配信</p>
                    </div>
                    <Switch checked={isScheduled} onCheckedChange={setIsScheduled} />
                  </div>

                  {isScheduled && (
                    <div className="space-y-1.5 animate-in fade-in">
                      <Label htmlFor="publishedAt">配信予定日時</Label>
                      <Input
                        id="publishedAt"
                        type="datetime-local"
                        value={publishedAt}
                        onChange={(e) => setPublishedAt(e.target.value)}
                      />
                    </div>
                  )}

                  <Separator />

                  {/* Distribution Targets */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                      配信パートナー連携
                    </p>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-700 font-medium">PR TIMES Webサイト掲載</span>
                      <Switch checked={distributeWeb} onCheckedChange={setDistributeWeb} />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-700 font-medium">提携パートナー全30社一括全配信</span>
                      <Switch checked={distributePartners} onCheckedChange={setDistributePartners} />
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-700 font-medium">公式SNSアカウント自動連携</span>
                      <Switch checked={distributeSns} onCheckedChange={setDistributeSns} />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="py-4 border-t bg-gray-50/50">
                  <Button type="submit" variant="accent" className="w-full font-bold py-2.5">
                    <Send className="w-4 h-4 mr-1" />
                    {isNew ? "配信登録を行う" : "更新を配信・反映"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          )}
        </div>
      )}

      {/* Preview Confirmation Modal */}
      <PRPreviewModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        prData={currentFormData}
      />
    </form>
  );
}
