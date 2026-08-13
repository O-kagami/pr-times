"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { CATEGORIES, PressRelease, SoftPrNote, TRENDING_KEYWORDS } from "@/data/pressReleases";
import PRQualityScore from "@/components/admin/PRQualityScore";
import PRPreviewModal from "@/components/admin/PRPreviewModal";
import { AnnotatedContent } from "@/components/AnnotatedContent";
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
  X,
  HelpCircle,
  Command,
  MessageSquare,
  Wand2,
  Music,
  Link2,
  File,
  LayoutGrid,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  DollarSign,
  User,
  MoreHorizontal,
  ArrowLeft,
  ChevronRight,
  Sliders,
  Heart,
  Volume2,
  FileCode,
  Smile,
  Trash2,
  MessageSquarePlus,
  Highlighter,
} from "lucide-react";

type PRFormProps = {
  initialData?: Partial<PressRelease>;
  isNew?: boolean;
};

const SAMPLE_PRESET_IMAGES = [
  { label: "テクノロジー/AI", url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80" },
  { label: "医療/ヘルスケア", url: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&auto=format&fit=crop&q=80" },
  { label: "オフィス/チーム", url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80" },
  { label: "製品/イノベーション", url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop&q=80" },
  { label: "グルメ/スイーツ", url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80" },
];

const SAMPLE_CONTENT = `共働き世帯の“もしも”を支える365日診療の小児科「あんどこどもクリニック 昭島モリパーク」が9月1日に開院

小児科クリニックを運営する医療法人せせらぎ（埼玉県さいたま市大宮区桜木町2-902 大宮サクラスクエアモール302、理事長：野崎 彰）は、2026年9月1日（火）、東京都昭島市に、土・日・祝日も一般外来に対応する「あんどこどもクリニック 昭島モリパーク」を開院いたします。

開院に先立ち、8月29日（土）・30日（日）の2日間、地域保護者の皆様に向けた特別イベントを開催します。

■開院の背景
消費者庁が厚生労働省「人口動態調査」を分析した結果によると、平成26年から令和元年までの6年間で、食品を誤嚥して窒息し死亡した14歳以下の子どもは80名にのぼり、そのうち5歳以下が73名と全体の9割を占めています。誤嚥・窒息は、家庭内で誰にでも起こり得る身近な事故です。`;

export default function PRForm({ initialData = {}, isNew = false }: PRFormProps) {
  const router = useRouter();

  // Mode state: "press_release" | "yawaraka_pr"
  const [activeMode, setActiveMode] = useState<"press_release" | "yawaraka_pr">("press_release");

  // View state: edit | preview | split
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">("edit");
  const [modalOpen, setModalOpen] = useState(false);
  const [optionsMenuOpen, setOptionsMenuOpen] = useState(false);
  const [savedToast, setSavedToast] = useState<string | null>(null);
  const [lastSavedTime, setLastSavedTime] = useState<string>("保存済み");

  // Left Rail Active Panel: null | "ai" | "toc" | "score" | "settings" | "help"
  const [activeSidePanel, setActiveSidePanel] = useState<string | null>(null);
  const [showAiBanner, setShowAiBanner] = useState(true);

  // Block Insertion Popup Menu
  const [blockMenuOpen, setBlockMenuOpen] = useState(false);

  // Image Modal
  const [showImagePicker, setShowImagePicker] = useState(false);

  // Main Form fields (Identical text across both modes)
  const [title, setTitle] = useState(
    initialData.title ||
      "共働き世帯の“もしも”を支える365日診療の小児科「あんどこどもクリニック 昭島モリパーク」が9月1日に開院"
  );
  const [subtitle, setSubtitle] = useState(
    initialData.subtitle ||
      "今年9月で200周年を迎えるクリニック！開院に先立ち先着100名へ「あんど探検隊」を開催。"
  );
  const [company, setCompany] = useState(initialData.company || "医療法人せせらぎ");
  const [companyId, setCompanyId] = useState(initialData.companyId || "seseragi");
  const [category, setCategory] = useState(initialData.category || "医療・ヘルスケア");
  const [subCategory, setSubCategory] = useState(initialData.subCategory || "小児科・地域医療");
  const [publishedAt, setPublishedAt] = useState(
    initialData.publishedAt || new Date().toISOString().slice(0, 16)
  );
  const [isScheduled, setIsScheduled] = useState(false);

  const [imageUrl, setImageUrl] = useState(
    initialData.imageUrl || SAMPLE_PRESET_IMAGES[1].url
  );
  const [secondaryImages, setSecondaryImages] = useState<string[]>(
    initialData.secondaryImages || []
  );

  // Summary highlights (3 points)
  const [summaryHighlights, setSummaryHighlights] = useState<string[]>(
    initialData.summaryHighlights && initialData.summaryHighlights.length > 0
      ? initialData.summaryHighlights
      : [
          "2026年9月1日、東京都昭島市に年中無休（土・日・祝日も一般外来対応）の小児科が開院",
          "8月29日・30日、親子参加型イベント「あんど探検隊」と院長講演「子どもの誤嚥・窒息」を開催",
          "共働き世帯の急な受診ニーズに応える診療体制を、地域の保護者の声をもとに構築",
        ]
  );

  // Main Content (Identical in both Press Release & Yawaraka PR modes)
  const [content, setContent] = useState(initialData.content || SAMPLE_CONTENT);

  // Soft PR specific state (Supplementary overlay notes & commentary)
  const [softPrEnabled, setSoftPrEnabled] = useState(!!initialData.softPr || activeMode === "yawaraka_pr");
  const [softPrAuthorName, setSoftPrAuthorName] = useState(
    initialData.softPr?.author.name || "野崎 彰"
  );
  const [softPrAuthorRole, setSoftPrAuthorRole] = useState(
    initialData.softPr?.author.role || "理事長・院長"
  );

  // Soft PR Annotations (マーカー注釈)
  const [softNotes, setSoftNotes] = useState<SoftPrNote[]>(
    initialData.softPr?.notes && initialData.softPr.notes.length > 0
      ? initialData.softPr.notes
      : [
          {
            anchor: "土・日・祝日も一般外来に対応する",
            comment:
              "この一文は何度も書き直しました。特別このように書くべきか迷いましたが、働くご家庭にとっては一番知りたい情報だと思い、最初に置いています。",
          },
          {
            anchor: "食品を誤嚥して窒息し死亡した14歳以下の子どもは80名にのぼり、そのうち5歳以下が73名と全体の9割を占めています。",
            comment:
              "当院の院長が長年警鐘を鳴らしてきたテーマです。少しでも多くの保護者の方に届くよう、本リリースに盛り込みました。",
          },
        ]
  );

  // Form for adding new Soft PR note
  const [newAnchor, setNewAnchor] = useState("");
  const [newComment, setNewComment] = useState("");

  const [softPrReflection, setSoftPrReflection] = useState<string>(
    initialData.softPr?.reflection?.join("\n\n") ||
      "開業にあたり、地域の保護者の皆様から「休日に診てくれる小児科が少ない」という切実な声を多数いただきました。\n医療従事者として単に病気を治すだけでなく、忙しいご家族の不安に寄り添える存在を目指して準備を進めてまいりました。"
  );

  // Keywords
  const [keywords, setKeywords] = useState<string[]>(
    initialData.keywords || ["小児科", "昭島市", "年中無休", "地域医療"]
  );
  const [tagInput, setTagInput] = useState("");

  // Contact & Profile
  const [contactDepartment, setContactDepartment] = useState(
    initialData.contactInfo?.department || "医療法人せせらぎ 広報事務局"
  );
  const [contactPerson, setContactPerson] = useState(
    initialData.contactInfo?.person || "野崎"
  );
  const [contactEmail, setContactEmail] = useState(
    initialData.contactInfo?.email || "pr@seseragi-med.or.jp"
  );
  const [contactTel, setContactTel] = useState(
    initialData.contactInfo?.tel || "048-000-0000"
  );

  const [representative, setRepresentative] = useState(
    initialData.companyProfile?.representative || "理事長 野崎 彰"
  );
  const [address, setAddress] = useState(
    initialData.companyProfile?.address || "埼玉県さいたま市大宮区桜木町2-902"
  );
  const [business, setBusiness] = useState(
    initialData.companyProfile?.business || "小児科診療・地域医療事業"
  );
  const [website, setWebsite] = useState(
    initialData.companyProfile?.website || "https://seseragi-med.or.jp"
  );

  // Distribution options
  const [distributeWeb, setDistributeWeb] = useState(true);
  const [distributePartners, setDistributePartners] = useState(true);
  const [distributeSns, setDistributeSns] = useState(true);

  // Auto-save simulator
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

  // Insert Snippet into Body
  const insertSnippet = (snippet: string) => {
    setContent((prev) => (prev ? prev + "\n" + snippet : snippet));
    setBlockMenuOpen(false);
  };

  // Add Soft PR note handler
  const handleAddSoftNote = () => {
    if (!newAnchor.trim() || !newComment.trim()) return;
    setSoftNotes([
      ...softNotes,
      { anchor: newAnchor.trim(), comment: newComment.trim() },
    ]);
    setNewAnchor("");
    setNewComment("");
    setSavedToast("「広報担当より」マーカー注釈を追加しました！");
    setTimeout(() => setSavedToast(null), 2500);
  };

  const handleRemoveSoftNote = (index: number) => {
    setSoftNotes(softNotes.filter((_, i) => i !== index));
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
  const handleSave = async () => {
    try {
      const payload: PressRelease = {
        ...currentFormData,
        timestamp: "たった今",
      };

      const response = await fetch("/api/press-releases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("保存に失敗しました");
      }

      setSavedToast(
        activeMode === "yawaraka_pr"
          ? "やわらかPR補足情報を保存しました！"
          : "プレスリリースを正常に保存しました！"
      );
      setTimeout(() => {
        router.push("/admin/press-releases");
      }, 1200);
    } catch (error) {
      console.error("Failed to save press release", error);
      setSavedToast("保存に失敗しました。DB接続または設定を確認してください。");
      setTimeout(() => setSavedToast(null), 2500);
    }
  };

  // Extract table of contents headings
  const tocHeadings = (title ? [`# ${title}`] : []).concat(
    content
      .split("\n")
      .filter((line) => line.startsWith("# ") || line.startsWith("## ") || line.startsWith("### "))
  );

  // Character Count
  const totalCharCount = title.length + subtitle.length + content.length;

  // Current Form Object for Quality score & Preview
  const currentFormData = {
    id: initialData.id || `pr-${Date.now().toString().slice(-4)}`,
    title: title || "無題のプレスリリース",
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
    softPr:
      activeMode === "yawaraka_pr" || softPrEnabled
        ? {
            author: { name: softPrAuthorName, role: softPrAuthorRole },
            notes: softNotes,
            reflection: softPrReflection.split("\n\n").filter(Boolean),
          }
        : undefined,
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-900 flex flex-col -m-6 font-sans">
      {/* Toast Notification */}
      {savedToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-xl text-sm font-medium animate-in fade-in slide-in-from-top-3">
          <CheckCircle className="w-5 h-5 text-white" />
          {savedToast}
        </div>
      )}

      {/* Note-style Top Header Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 px-4 py-2.5 flex items-center justify-between shadow-xs">
        {/* Left: Close Link */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin/press-releases"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-4 h-4 text-gray-500" />
            <span>閉じる</span>
          </Link>
          <div className="h-4 w-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-mono hidden sm:inline">
            {lastSavedTime}
          </span>
        </div>

        {/* Center: Mode Switching Tabs */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl border border-gray-200/80 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveMode("press_release")}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
              activeMode === "press_release"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/60"
            }`}
          >
            <Building className="w-4 h-4" />
            <span>プレスリリース</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveMode("yawaraka_pr");
              setSoftPrEnabled(true);
            }}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
              activeMode === "yawaraka_pr"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-amber-100/50"
            }`}
          >
            <Heart className="w-4 h-4 fill-current text-white/90" />
            <span>やわらかPR</span>
          </button>
        </div>

        {/* Right: Character Count, Options & Save/Publish */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-500 hidden md:inline">
            {totalCharCount} 文字
          </span>

          {/* Options Menu Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setOptionsMenuOpen(!optionsMenuOpen)}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              title="その他の操作"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {optionsMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-1.5 text-xs text-gray-700 animate-in fade-in slide-in-from-top-2">
                <button
                  type="button"
                  onClick={() => {
                    setViewMode(viewMode === "preview" ? "edit" : "preview");
                    setOptionsMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-gray-100 flex items-center justify-between cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-sky-600" />
                    プレビュー切り替え
                  </span>
                  <span className="text-[10px] text-gray-400">⌘P</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(true);
                    setOptionsMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                >
                  <Columns className="w-4 h-4 text-emerald-600" />
                  確認ダイアログ表示
                </button>
                <Separator className="my-1" />
                <button
                  type="button"
                  onClick={() => {
                    setActiveSidePanel(activeSidePanel === "settings" ? null : "settings");
                    setOptionsMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2 hover:bg-gray-100 flex items-center gap-2 cursor-pointer"
                >
                  <Sliders className="w-4 h-4 text-gray-600" />
                  配信詳細設定
                </button>
              </div>
            )}
          </div>

          {/* Save Draft Button */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              const now = new Date();
              setLastSavedTime(
                `${now.getHours().toString().padStart(2, "0")}:${now
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")} 手動保存`
              );
              setSavedToast("下書きを保存しました");
              setTimeout(() => setSavedToast(null), 2500);
            }}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg border-gray-300 hover:bg-gray-100"
          >
            下書き保存
          </Button>

          {/* Main Action Button */}
          <Button
            type="button"
            onClick={handleSave}
            className={`text-xs sm:text-sm font-extrabold px-4 py-1.5 rounded-lg text-white transition-all shadow-sm ${
              activeMode === "yawaraka_pr"
                ? "bg-amber-500 hover:bg-amber-600 shadow-amber-200"
                : "bg-sky-600 hover:bg-sky-700 shadow-sky-200"
            }`}
          >
            <Send className="w-3.5 h-3.5 mr-1" />
            {isNew ? "公開に進む" : "更新を配信"}
          </Button>
        </div>
      </header>

      {/* Main Workspace Body: Left Rail + Canvas + Right Panel */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Note-style Far-Left Vertical Icon Rail */}
        <aside className="w-14 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4 shrink-0 z-20">
          {/* AI Assistant Icon Button */}
          <div className="relative group">
            <button
              type="button"
              onClick={() => setActiveSidePanel(activeSidePanel === "ai" ? null : "ai")}
              className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                activeSidePanel === "ai"
                  ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-400"
                  : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
              }`}
              title="AIアシスタント"
            >
              <Sparkles className="w-5 h-5 fill-current" />
            </button>

            {/* Note Speech Bubble Banner */}
            {showAiBanner && activeSidePanel !== "ai" && (
              <div className="absolute left-14 top-0 z-50 w-64 bg-gray-900 text-white text-xs rounded-xl p-3 shadow-xl border border-gray-800 animate-in fade-in slide-in-from-left-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AIアシスタント機能</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowAiBanner(false);
                    }}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-gray-300 text-[11px] leading-relaxed">
                  AIと構成づくりや推敲を一緒に進められます
                </p>
                <div className="absolute left-[-6px] top-4 w-3 h-3 bg-gray-900 transform rotate-45" />
              </div>
            )}
          </div>

          {/* Table of Contents Icon */}
          <button
            type="button"
            onClick={() => setActiveSidePanel(activeSidePanel === "toc" ? null : "toc")}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              activeSidePanel === "toc"
                ? "bg-sky-100 text-sky-700 ring-2 ring-sky-400"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}
            title="目次・構成一覧"
          >
            <List className="w-5 h-5" />
          </button>

          {/* PR Quality Score Icon */}
          <button
            type="button"
            onClick={() => setActiveSidePanel(activeSidePanel === "score" ? null : "score")}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              activeSidePanel === "score"
                ? "bg-amber-100 text-amber-700 ring-2 ring-amber-400"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}
            title="PR品質スコア"
          >
            <Sliders className="w-5 h-5" />
          </button>

          {/* Mode Settings Icon */}
          <button
            type="button"
            onClick={() => setActiveSidePanel(activeSidePanel === "settings" ? null : "settings")}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              activeSidePanel === "settings"
                ? "bg-purple-100 text-purple-700 ring-2 ring-purple-400"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}
            title="リリース属性・設定"
          >
            <Tag className="w-5 h-5" />
          </button>

          <div className="flex-1" />

          {/* Help Icon */}
          <button
            type="button"
            onClick={() => setActiveSidePanel(activeSidePanel === "help" ? null : "help")}
            className="w-10 h-10 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
            title="ヘルプ・ガイド"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          {/* Keyboard Shortcuts Icon */}
          <button
            type="button"
            onClick={() =>
              alert("【ショートカット】\n⌘+S: 下書き保存\n⌘+P: プレビュー切替\n⌘+B: 太字")
            }
            className="w-10 h-10 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
            title="キーボードショートカット"
          >
            <Command className="w-5 h-5" />
          </button>
        </aside>

        {/* Collapsible Left Side Panel Drawer */}
        {activeSidePanel && (
          <aside className="w-72 bg-white border-r border-gray-200 p-4 space-y-4 shrink-0 overflow-y-auto z-10 animate-in fade-in slide-in-from-left-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
                {activeSidePanel === "ai" && <Sparkles className="w-4 h-4 text-emerald-600" />}
                {activeSidePanel === "toc" && <List className="w-4 h-4 text-sky-600" />}
                {activeSidePanel === "score" && <Sliders className="w-4 h-4 text-amber-600" />}
                {activeSidePanel === "settings" && <Tag className="w-4 h-4 text-purple-600" />}
                {activeSidePanel === "help" && <HelpCircle className="w-4 h-4 text-gray-600" />}
                <span>
                  {activeSidePanel === "ai" && "AIアシスタント"}
                  {activeSidePanel === "toc" && "目次・構成アウトライン"}
                  {activeSidePanel === "score" && "PR品質スコア"}
                  {activeSidePanel === "settings" && "配信・属性設定"}
                  {activeSidePanel === "help" && "書き方ヘルプ"}
                </span>
              </h3>
              <button
                type="button"
                onClick={() => setActiveSidePanel(null)}
                className="text-gray-400 hover:text-gray-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* AI Panel Content */}
            {activeSidePanel === "ai" && (
              <div className="space-y-3 text-xs">
                <p className="text-gray-600 leading-relaxed">
                  AIが魅力的なプレスリリース作成および「広報担当より」の補足コメント推敲をサポートします。
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setNewAnchor("土・日・祝日も一般外来に対応する");
                    setNewComment("AIが自動生成した広報補足コメント: 働くご家庭にとって休日診療は最も切実なニーズです。");
                  }}
                  className="w-full justify-start text-xs font-semibold text-amber-800 border-amber-200 bg-amber-50 hover:bg-amber-100"
                >
                  <MessageSquarePlus className="w-3.5 h-3.5 mr-2 text-amber-600" />
                  マーカー注釈のコメント案を生成
                </Button>
              </div>
            )}

            {/* TOC Panel Content */}
            {activeSidePanel === "toc" && (
              <div className="space-y-2 text-xs">
                {tocHeadings.length > 0 ? (
                  tocHeadings.map((h, i) => (
                    <div
                      key={i}
                      className="p-2 rounded bg-gray-50 hover:bg-sky-50 text-gray-700 font-medium truncate border border-gray-100"
                    >
                      {h}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-6">
                    見出しを設定すると表示されます
                  </p>
                )}
              </div>
            )}

            {/* Score Panel Content */}
            {activeSidePanel === "score" && (
              <PRQualityScore formData={currentFormData} />
            )}

            {/* Settings Panel Content */}
            {activeSidePanel === "settings" && (
              <div className="space-y-4 text-xs">
                <div>
                  <Label className="mb-1">カテゴリ</Label>
                  <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <Label className="mb-1">予約配信日時</Label>
                  <Input
                    type="datetime-local"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                  />
                </div>
              </div>
            )}
          </aside>
        )}

        {/* Central Writing Canvas Area (Note Viewport) */}
        <main className="flex-1 overflow-y-auto py-8 px-4 sm:px-8 flex justify-center bg-[#f9fafb]">
          <div className="w-full max-w-3xl space-y-6">
            {/* Soft PR Banner Alert in Yawaraka PR Mode */}
            {activeMode === "yawaraka_pr" && (
              <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 font-bold shadow-xs">
                    <Heart className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <span className="font-extrabold text-amber-950 text-sm flex items-center gap-2">
                      やわらかPR モード（補足情報オーバーレイ）
                      <Badge variant="amber" className="text-[10px] px-2 font-bold">
                        文章はプレスリリースと同じ
                      </Badge>
                    </span>
                    <p className="text-xs text-amber-800/80 mt-0.5">
                      プレスリリース本文はそのままに、文中のマーカー注釈や広報担当者の補足コメントを重畳表示します。
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Note Canvas Container Card */}
            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-6 sm:p-10 space-y-6 min-h-[700px] relative">
              {/* Note Header Cover Image Area */}
              <div className="relative group rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 hover:border-sky-300 transition-all">
                {imageUrl ? (
                  <div className="relative">
                    <img
                      src={imageUrl}
                      alt="Header visual"
                      className="w-full h-56 sm:h-72 object-cover rounded-xl"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setShowImagePicker(true)}
                        className="font-bold text-xs bg-white text-gray-900 shadow"
                      >
                        <ImageIcon className="w-4 h-4 mr-1 text-sky-600" />
                        画像を変更
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => setImageUrl("")}
                        className="font-bold text-xs"
                      >
                        削除
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowImagePicker(true)}
                    className="w-full py-12 flex flex-col items-center justify-center text-gray-400 hover:text-sky-600 transition-colors cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-full bg-gray-100 group-hover:bg-sky-50 flex items-center justify-center mb-2 transition-colors">
                      <Plus className="w-6 h-6 text-gray-400 group-hover:text-sky-600" />
                    </div>
                    <span className="text-xs font-bold text-gray-500 group-hover:text-sky-700">
                      ヘッダー画像を追加
                    </span>
                  </button>
                )}
              </div>

              {/* Preset Image Picker Drawer / Modal */}
              {showImagePicker && (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3 animate-in fade-in">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-700">
                      ヘッダー画像を選択 / URL指定
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowImagePicker(false)}
                      className="text-gray-400 hover:text-gray-700 text-xs"
                    >
                      ✕ 閉じる
                    </button>
                  </div>
                  <Input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="text-xs bg-white"
                  />
                  <div className="grid grid-cols-5 gap-2 pt-1">
                    {SAMPLE_PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setImageUrl(preset.url);
                          setShowImagePicker(false);
                        }}
                        className="rounded-lg overflow-hidden border border-gray-200 hover:border-sky-500 transition-all cursor-pointer"
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          className="h-12 w-full object-cover"
                        />
                        <span className="block text-[9px] text-center bg-white truncate py-0.5 px-1">
                          {preset.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Title Field */}
              <div className="space-y-2">
                <Textarea
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="記事タイトル"
                  rows={2}
                  className="w-full text-2xl sm:text-3xl font-extrabold text-gray-900 border-none focus:ring-0 focus:outline-none placeholder:text-gray-300 resize-none p-0 bg-transparent leading-tight"
                />
              </div>

              {/* Subtitle Field */}
              <div>
                <Input
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="サブタイトル・リード文を入力（任意）"
                  className="w-full text-base font-medium text-gray-600 border-none focus:ring-0 focus:outline-none placeholder:text-gray-300 p-0 bg-transparent"
                />
              </div>

              <Separator className="bg-gray-100" />

              {/* Main Content Body Editor */}
              <div className="relative space-y-4">
                {/* Floating Inline Block Menu Trigger Button (`+` Button) */}
                <div className="relative flex items-center gap-2 py-1">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setBlockMenuOpen(!blockMenuOpen)}
                      className="w-8 h-8 rounded-full border border-gray-300 text-gray-500 hover:text-gray-900 hover:border-gray-500 flex items-center justify-center transition-all bg-white shadow-xs cursor-pointer"
                      title="ブロック挿入メニュー"
                    >
                      <Plus
                        className={`w-4 h-4 transition-transform ${
                          blockMenuOpen ? "rotate-45" : ""
                        }`}
                      />
                    </button>

                    {/* Note Block Insertion Menu */}
                    {blockMenuOpen && (
                      <div className="absolute left-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 py-2 text-xs font-medium text-gray-700 animate-in fade-in slide-in-from-top-2">
                        <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          挿入
                        </div>

                        <button
                          type="button"
                          onClick={() => insertSnippet("🪄 AIアシスタント提案テキスト")}
                          className="w-full text-left px-3.5 py-2 hover:bg-emerald-50 text-emerald-800 flex items-center gap-2.5 cursor-pointer"
                        >
                          <Sparkles className="w-4 h-4 text-emerald-600" />
                          <span>AIアシスタント</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            insertSnippet(
                              "![挿入画像](https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800)"
                            )
                          }
                          className="w-full text-left px-3.5 py-2 hover:bg-gray-100 flex items-center gap-2.5 cursor-pointer"
                        >
                          <ImageIcon className="w-4 h-4 text-sky-600" />
                          <span>画像</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => insertSnippet("🎧 ［音声コンテンツプレイヤー］")}
                          className="w-full text-left px-3.5 py-2 hover:bg-gray-100 flex items-center gap-2.5 cursor-pointer"
                        >
                          <Volume2 className="w-4 h-4 text-purple-600" />
                          <span>音声</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            insertSnippet("🔗 https://prtimes.jp (埋め込みリンク)")
                          }
                          className="w-full text-left px-3.5 py-2 hover:bg-gray-100 flex items-center gap-2.5 cursor-pointer"
                        >
                          <Link2 className="w-4 h-4 text-blue-600" />
                          <span>埋め込み</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => insertSnippet("\n## 大見出しタイトルの入力\n")}
                          className="w-full text-left px-3.5 py-2 hover:bg-gray-100 flex items-center gap-2.5 cursor-pointer"
                        >
                          <span className="font-bold text-xs text-gray-600">h2</span>
                          <span>大見出し</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => insertSnippet("\n### 小見出しタイトルの入力\n")}
                          className="w-full text-left px-3.5 py-2 hover:bg-gray-100 flex items-center gap-2.5 cursor-pointer"
                        >
                          <span className="font-bold text-xs text-gray-500">h3</span>
                          <span>小見出し</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => insertSnippet("\n- 箇条書き項目1\n- 箇条書き項目2\n")}
                          className="w-full text-left px-3.5 py-2 hover:bg-gray-100 flex items-center gap-2.5 cursor-pointer"
                        >
                          <List className="w-4 h-4 text-gray-600" />
                          <span>箇条書きリスト</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            insertSnippet("\n> 担当者コメント：「〜〜〜」\n")
                          }
                          className="w-full text-left px-3.5 py-2 hover:bg-gray-100 flex items-center gap-2.5 cursor-pointer"
                        >
                          <Quote className="w-4 h-4 text-gray-600" />
                          <span>引用</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => insertSnippet("\n---\n")}
                          className="w-full text-left px-3.5 py-2 hover:bg-gray-100 flex items-center gap-2.5 cursor-pointer"
                        >
                          <Minus className="w-4 h-4 text-gray-600" />
                          <span>区切り線</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <span className="text-xs text-gray-400 font-sans">
                    プレスリリース本文（※やわらかPRモードでも共通の文章です）
                  </span>
                </div>

                {/* Textarea for Editing Article Content */}
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={14}
                  placeholder="ここにプレスリリースの本文を記述します..."
                  className="w-full text-base text-gray-800 border border-gray-100 rounded-lg p-3 bg-white leading-relaxed focus:ring-1 focus:ring-sky-400"
                />

                {/* In Yawaraka PR Mode: Live Annotated Content Preview with Yellow Text Markers & Tooltip Cards */}
                {activeMode === "yawaraka_pr" && (
                  <div className="mt-6 border-2 border-amber-300/80 rounded-xl p-5 bg-[#fffdf9] space-y-3">
                    <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                      <span className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5">
                        <Highlighter className="w-4 h-4 text-amber-600" />
                        やわらかPR ライブアノテーション表示確認（マーカーにカーソルを合わせるとポップアップが表示されます）
                      </span>
                      <Badge variant="amber" className="text-[10px]">
                        実際の配信ページと同様の表示
                      </Badge>
                    </div>

                    <div className="text-sm text-gray-800 leading-relaxed whitespace-pre-line p-3 bg-white rounded-lg border border-amber-100 shadow-inner">
                      <AnnotatedContent content={content} softNotes={softNotes} />
                    </div>
                  </div>
                )}
              </div>

              {/* Yawaraka PR Supplementary Overlay Controls Section */}
              {activeMode === "yawaraka_pr" && (
                <div className="mt-8 border border-amber-200 bg-amber-50/60 rounded-2xl p-6 space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                    <span className="font-extrabold text-base text-amber-950 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-amber-600 fill-current" />
                      「広報担当より」の補足情報・マーカー注釈設定
                    </span>
                    <Badge variant="amber" className="text-xs font-bold px-2 py-0.5">
                      PR本文に重ねて掲載
                    </Badge>
                  </div>

                  {/* Representative Profile */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <Label className="text-amber-900 mb-1 font-bold">広報担当者名</Label>
                      <Input
                        value={softPrAuthorName}
                        onChange={(e) => setSoftPrAuthorName(e.target.value)}
                        placeholder="例: 野崎 彰"
                        className="bg-white border-amber-200"
                      />
                    </div>
                    <div>
                      <Label className="text-amber-900 mb-1 font-bold">役職・部署</Label>
                      <Input
                        value={softPrAuthorRole}
                        onChange={(e) => setSoftPrAuthorRole(e.target.value)}
                        placeholder="例: 理事長・院長"
                        className="bg-white border-amber-200"
                      />
                    </div>
                  </div>

                  {/* Add New Soft PR Note Marker */}
                  <div className="bg-white rounded-xl p-4 border border-amber-200 space-y-3">
                    <span className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5">
                      <MessageSquarePlus className="w-4 h-4 text-amber-600" />
                      新しい「広報担当より」マーカー注釈の追加
                    </span>

                    <div className="space-y-2 text-xs">
                      <div>
                        <Label className="text-gray-700 mb-1">
                          対象テキスト（本文中のハイライトしたいキーワード・フレーズ）
                        </Label>
                        <Input
                          value={newAnchor}
                          onChange={(e) => setNewAnchor(e.target.value)}
                          placeholder="例: 土・日・祝日も一般外来に対応する"
                          className="bg-amber-50/40 border-amber-200 font-medium"
                        />
                      </div>

                      <div>
                        <Label className="text-gray-700 mb-1">
                          広報担当者の補足コメント（マーカーホバー時にカード表示されるメッセージ）
                        </Label>
                        <Textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          rows={2}
                          placeholder="例: この一文は何度も書き直しました。特別なこのように書くべきか迷いましたが..."
                          className="bg-amber-50/40 border-amber-200 text-xs"
                        />
                      </div>

                      <Button
                        type="button"
                        onClick={handleAddSoftNote}
                        className="text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white w-full py-2"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        マーカー注釈を追加
                      </Button>
                    </div>
                  </div>

                  {/* Active Soft PR Notes List */}
                  <div className="space-y-2">
                    <span className="text-xs font-extrabold text-amber-900">
                      現在登録されている「広報担当より」注釈リスト ({softNotes.length}件):
                    </span>

                    {softNotes.map((note, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-amber-200 rounded-xl p-3.5 space-y-1.5 text-xs shadow-2xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-200">
                            対象: 「{note.anchor}」
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSoftNote(idx)}
                            className="text-gray-400 hover:text-red-600 p-1"
                            title="削除"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-gray-700 text-xs leading-relaxed bg-amber-50/30 p-2 rounded">
                          <span className="font-bold text-amber-800 mr-1">広報担当より:</span>
                          {note.comment}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Reflection Text Box */}
                  <div>
                    <Label className="text-amber-950 mb-1 text-xs font-extrabold">
                      広報担当より　このリリースについて（記事末尾のメッセージ枠）
                    </Label>
                    <Textarea
                      value={softPrReflection}
                      onChange={(e) => setSoftPrReflection(e.target.value)}
                      rows={4}
                      className="bg-white border-amber-200 text-xs text-gray-900 leading-relaxed"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Preview Confirmation Modal */}
      <PRPreviewModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        prData={currentFormData}
      />
    </div>
  );
}


