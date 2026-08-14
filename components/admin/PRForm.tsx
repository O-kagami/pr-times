"use client";

import React, { useCallback, useState, useEffect, useRef } from "react";
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
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CATEGORIES, PressRelease, SoftPrNote, TRENDING_KEYWORDS } from "@/data/pressReleases";

import PRQualityScore from "@/components/admin/PRQualityScore";
import PRPreviewModal from "@/components/admin/PRPreviewModal";
import { AnnotatedContent } from "@/components/AnnotatedContent";
import {
  Eye,
  Send,
  Image as ImageIcon,
  Plus,
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
  Trash2,
  MessageSquarePlus,
  Highlighter,
  Edit3,
} from "lucide-react";

type PRFormProps = {
  initialData?: Partial<PressRelease>;
  isNew?: boolean;
  /** 保存後・キャンセル時の戻り先。企業ごとの管理画面から開いたときはその一覧に戻す */
  returnHref?: string;
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

export default function PRForm({
  initialData = {},
  isNew = false,
  returnHref = "/admin/press-releases",
}: PRFormProps) {
  const router = useRouter();

  // 新規作成（企業未確定）とせせらぎのPRでは、デモ用の初期値をそのまま残す。
  // 他の企業のPRを編集するときは、せせらぎの内容が紛れ込まないよう空にする。
  const useDemoDefaults =
    !initialData.companyId || initialData.companyId === "seseragi";

  const [activeMode, setActiveMode] = useState<"press_release" | "yawaraka_pr">("press_release");
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">("edit");
  const [modalOpen, setModalOpen] = useState(false);
  const [optionsMenuOpen, setOptionsMenuOpen] = useState(false);
  const [savedToast, setSavedToast] = useState<string | null>(null);
  const [lastSavedTime, setLastSavedTime] = useState<string>("保存済み");

  const [activeSidePanel, setActiveSidePanel] = useState<string | null>(null);
  const [blockMenuOpen, setBlockMenuOpen] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);

  const [title, setTitle] = useState(
    initialData.title ||
      (useDemoDefaults
        ? "共働き世帯の“もしも”を支える365日診療の小児科「あんどこどもクリニック 昭島モリパーク」が9月1日に開院"
        : "")
  );
  const [subtitle, setSubtitle] = useState(
    initialData.subtitle ||
      (useDemoDefaults
        ? "今年9月で200周年を迎えるクリニック！開院に先立ち先着100名へ「あんど探検隊」を開催。"
        : "")
  );
  const [company, setCompany] = useState(
    initialData.company || (useDemoDefaults ? "医療法人せせらぎ" : "")
  );
  const [companyId, setCompanyId] = useState(
    initialData.companyId || (useDemoDefaults ? "seseragi" : "")
  );
  const [category, setCategory] = useState(
    initialData.category || (useDemoDefaults ? "医療・ヘルスケア" : "")
  );
  const [subCategory, setSubCategory] = useState(
    initialData.subCategory || (useDemoDefaults ? "小児科・地域医療" : "")
  );
  const [publishedAt, setPublishedAt] = useState(
    initialData.publishedAt || new Date().toISOString().slice(0, 16)
  );
  const [isScheduled, setIsScheduled] = useState(false);

  const [imageUrl, setImageUrl] = useState(
    initialData.imageUrl || (useDemoDefaults ? SAMPLE_PRESET_IMAGES[1].url : "")
  );
  const [secondaryImages, setSecondaryImages] = useState<string[]>(
    initialData.secondaryImages || []
  );

  const [summaryHighlights, setSummaryHighlights] = useState<string[]>(
    initialData.summaryHighlights && initialData.summaryHighlights.length > 0
      ? initialData.summaryHighlights
      : useDemoDefaults
        ? [
            "2026年9月1日、東京都昭島市に年中無休（土・日・祝日も一般外来対応）の小児科が開院",
            "8月29日・30日、親子参加型イベント「あんど探検隊」と院長講演「子どもの誤嚥・窒息」を開催",
            "共働き世帯の急な受診ニーズに応える診療体制を、地域の保護者の声をもとに構築",
          ]
        : []
  );

  const [content, setContent] = useState(
    initialData.content || (useDemoDefaults ? SAMPLE_CONTENT : "")
  );
  const [softPrEnabled, setSoftPrEnabled] = useState(!!initialData.softPr || activeMode === "yawaraka_pr");
  const [softPrAuthorName, setSoftPrAuthorName] = useState(
    initialData.softPr?.author.name || (useDemoDefaults ? "野崎 彰" : "")
  );
  const [softPrAuthorRole, setSoftPrAuthorRole] = useState(
    initialData.softPr?.author.role || (useDemoDefaults ? "理事長・院長" : "")
  );

  const [softNotes, setSoftNotes] = useState<SoftPrNote[]>(
    initialData.softPr?.notes && initialData.softPr.notes.length > 0
      ? initialData.softPr.notes
      : useDemoDefaults
        ? [
            {
              anchor: "土・日・祝日も一般外来に対応する",
              comment:
                "この一文は何度も書き直しました。特別このように書くべきか迷いましたが、働くご家庭にとっては一番知りたい情報だと思い、最初に置いています。",
              imageUrl: SAMPLE_PRESET_IMAGES[1].url,
            },
            {
              anchor: "食品を誤嚥して窒息し死亡した14歳以下の子どもは80名にのぼり、そのうち5歳以下が73名と全体の9割を占めています。",
              comment:
                "当院の院長が長年警鐘を鳴らしてきたテーマです。少しでも多くの保護者の方に届くよう、本リリースに盛り込みました。",
            },
          ]
        : []
  );

  const [selectedText, setSelectedText] = useState("");
  const [selectionAnchor, setSelectionAnchor] = useState<{ top: number; left: number } | null>(
    null
  );
  const articleRef = useRef<HTMLDivElement>(null);
  const [clearSoftPrConfirmOpen, setClearSoftPrConfirmOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<SoftPrNote | null>(null);

  const [editingNoteIndex, setEditingNoteIndex] = useState<number | null>(null);
  const [editComment, setEditComment] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");

  const [softPrReflection, setSoftPrReflection] = useState<string>(
    initialData.softPr?.reflection?.join("\n\n") ||
      (useDemoDefaults
        ? "開業にあたり、地域の保護者の皆様から「休日に診てくれる小児科が少ない」という切実な声を多数いただきました。\n医療従事者として単に病気を治すだけでなく、忙しいご家族の不安に寄り添える存在を目指して準備を進めてまいりました。"
        : "")
  );

  const [keywords, setKeywords] = useState<string[]>(
    initialData.keywords ||
      (useDemoDefaults ? ["小児科", "昭島市", "年中無休", "地域医療"] : [])
  );
  const [tagInput, setTagInput] = useState("");

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

  const insertSnippet = (snippet: string) => {
    setContent((prev) => (prev ? prev + "\n" + snippet : snippet));
    setBlockMenuOpen(false);
  };

  /**
   * 選択された文章と、その位置（本文プレビュー枠の左上からの相対座標）を覚える。
   * 座標は「コメントを追加」の吹き出しを選択箇所の真上に出すために使う。
   */
  const handleDetectSelection = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim() ?? "";
    const container = articleRef.current;

    if (
      !selection ||
      selection.rangeCount === 0 ||
      text.length < 2 ||
      !container ||
      // 本文プレビューの外（入力欄など）の選択は拾わない
      !container.contains(selection.anchorNode)
    ) {
      setSelectedText("");
      setSelectionAnchor(null);
      return;
    }

    const rect = selection.getRangeAt(0).getBoundingClientRect();
    const box = container.getBoundingClientRect();

    // 吹き出しの幅ぶんは枠内に残す。端の文字を選んでも見切れないように
    const center = rect.left - box.left + rect.width / 2;
    const edge = Math.min(80, box.width / 2);

    setSelectedText(text);
    setSelectionAnchor({
      top: rect.top - box.top,
      left: Math.min(Math.max(center, edge), box.width - edge),
    });
  }, []);

  // モバイルの長押し選択やハンドル操作は mouseup が来ないので selectionchange で拾う
  useEffect(() => {
    if (activeMode !== "yawaraka_pr") return;
    document.addEventListener("selectionchange", handleDetectSelection);
    return () => document.removeEventListener("selectionchange", handleDetectSelection);
  }, [activeMode, handleDetectSelection]);

  const handleHighlightSelectedText = () => {
    if (!selectedText) return;
    const newNote: SoftPrNote = {
      anchor: selectedText,
      comment: "",
      imageUrl: "",
    };
    setSoftNotes((prev) => [...prev, newNote]);
    setSelectedText("");
    setSelectionAnchor(null);
    handleOpenEditNoteModal(newNote, softNotes.length);
  };

  const handleOpenEditNoteModal = (note: SoftPrNote, index?: number) => {
    const noteIdx = index !== undefined ? index : softNotes.findIndex((n) => n.anchor === note.anchor);
    setEditingNote(note);
    setEditingNoteIndex(noteIdx !== -1 ? noteIdx : null);
    setEditComment(note.comment || "");
    setEditImageUrl(note.imageUrl || "");
  };

  const handleSaveEditedNote = () => {
    if (!editingNote) return;
    const updatedNote: SoftPrNote = {
      anchor: editingNote.anchor,
      comment: editComment,
      imageUrl: editImageUrl ? editImageUrl : undefined,
    };

    if (editingNoteIndex !== null && editingNoteIndex >= 0) {
      const updated = [...softNotes];
      updated[editingNoteIndex] = updatedNote;
      setSoftNotes(updated);
    } else {
      setSoftNotes([...softNotes, updatedNote]);
    }

    setEditingNote(null);
    setEditingNoteIndex(null);
    setSavedToast("ポップアップカードの文章と画像を保存しました！");
    setTimeout(() => setSavedToast(null), 2500);
  };

  const handleDeleteEditedNote = () => {
    if (editingNoteIndex !== null && editingNoteIndex >= 0) {
      setSoftNotes(softNotes.filter((_, i) => i !== editingNoteIndex));
    }
    setEditingNote(null);
    setEditingNoteIndex(null);
  };

  const handleSaveDraft = () => {
    const now = new Date();
    setLastSavedTime(
      `${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")} 手動保存`
    );
    setSavedToast("下書きを保存しました");
    setTimeout(() => setSavedToast(null), 2500);
  };

  /**
   * やわらかPRの編集を白紙に戻す。実演で1から作って見せられるよう、
   * 元の内容に戻すのではなく空にする（プレスリリース本文には触らない）。
   */
  const handleClearSoftPr = () => {
    setSoftNotes([]);
    setSoftPrAuthorName("");
    setSoftPrAuthorRole("");
    setSoftPrReflection("");
    setEditingNote(null);
    setEditingNoteIndex(null);
    setSelectedText("");
    setClearSoftPrConfirmOpen(false);
    setSavedToast("やわらかPRの編集をすべて消しました");
    setTimeout(() => setSavedToast(null), 2500);
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
        router.push(returnHref);
      }, 1200);
    } catch (error) {
      console.error("Failed to save press release", error);
      setSavedToast("保存に失敗しました。DB接続または設定を確認してください。");
      setTimeout(() => setSavedToast(null), 2500);
    }
  };

  const tocHeadings = (title ? [`# ${title}`] : []).concat(
    content
      .split("\n")
      .filter((line) => line.startsWith("# ") || line.startsWith("## ") || line.startsWith("### "))
  );

  const totalCharCount = title.length + subtitle.length + content.length;

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
      {savedToast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-lg shadow-xl text-sm font-medium animate-in fade-in slide-in-from-top-3">
          <CheckCircle className="w-5 h-5 text-white" />
          {savedToast}
        </div>
      )}

      {/* 狭い画面ではモード切替だけ2段目に落として、他のボタンは潰さず並べる */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-200 px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-y-2 shadow-xs">
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href={returnHref}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-2 py-1 rounded-md hover:bg-gray-100 whitespace-nowrap"
          >
            <X className="w-4 h-4 text-gray-500 shrink-0" />
            <span className="hidden sm:inline">閉じる</span>
          </Link>
          <div className="hidden sm:block h-4 w-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-mono hidden sm:inline">
            {lastSavedTime}
          </span>
        </div>

        <div className="flex items-center gap-1 order-last lg:order-none bg-gray-100 p-1 rounded-xl border border-gray-200/80 shadow-inner w-full lg:w-auto">
          <button
            type="button"
            onClick={() => setActiveMode("press_release")}
            className={`flex flex-1 lg:flex-none items-center justify-center gap-2 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-bold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeMode === "press_release"
                ? "bg-sky-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-200/60"
            }`}
          >
            <Building className="w-4 h-4 shrink-0" />
            <span>プレスリリース</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveMode("yawaraka_pr");
              setSoftPrEnabled(true);
            }}
            className={`flex flex-1 lg:flex-none items-center justify-center gap-2 px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-bold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
              activeMode === "yawaraka_pr"
                ? "bg-amber-500 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-amber-100/50"
            }`}
          >
            <Heart className="w-4 h-4 fill-current text-white/90 shrink-0" />
            <span>やわらかPR</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <span className="text-xs font-medium text-gray-500 hidden xl:inline">
            {totalCharCount} 文字
          </span>
          {/* 狭い画面ではボタンを並べきれないので、⋯ の中にたたむ */}
          <div className="relative lg:hidden">
            <button
              type="button"
              onClick={() => setOptionsMenuOpen(!optionsMenuOpen)}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {optionsMenuOpen && (
              <>
                <div className="z-30 fixed inset-0" onClick={() => setOptionsMenuOpen(false)} />
                <div className="right-0 z-40 absolute bg-white shadow-lg mt-2 py-1 border border-gray-200 rounded-xl w-52 animate-in fade-in slide-in-from-top-1">
                  <button
                    type="button"
                    onClick={() => {
                      setOptionsMenuOpen(false);
                      handleSaveDraft();
                    }}
                    className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 w-full font-semibold text-gray-700 text-xs text-left transition-colors cursor-pointer"
                  >
                    <Clock className="w-4 h-4 text-gray-400" />
                    下書き保存
                  </button>
                  {!isNew && (
                    <button
                      type="button"
                      onClick={() => {
                        setOptionsMenuOpen(false);
                        setClearSoftPrConfirmOpen(true);
                      }}
                      className="flex items-center gap-2 hover:bg-red-50 px-3 py-2 w-full font-semibold text-red-600 text-xs text-left transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                      やわらかPRを全消去
                    </button>
                  )}
                </div>
              </>
            )}
          </div>

          {/* 編集時だけ。新規作成では消す対象がまだないので出さない */}
          {!isNew && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setClearSoftPrConfirmOpen(true)}
              className="hidden lg:inline-flex px-3 py-1.5 border-red-200 rounded-lg font-semibold text-red-600 text-xs whitespace-nowrap hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="mr-1 w-3.5 h-3.5" />
              やわらかPRを全消去
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSaveDraft}
            className="hidden lg:inline-flex text-xs font-semibold px-3 py-1.5 rounded-lg border-gray-300 whitespace-nowrap hover:bg-gray-100"
          >
            下書き保存
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            className={`text-xs sm:text-sm font-extrabold px-3 sm:px-4 py-1.5 rounded-lg text-white whitespace-nowrap transition-all shadow-sm ${
              activeMode === "yawaraka_pr"
                ? "bg-amber-500 hover:bg-amber-600 shadow-amber-200"
                : "bg-sky-600 hover:bg-sky-700 shadow-sky-200"
            }`}
          >
            <Send className="w-3.5 h-3.5 sm:mr-1" />
            <span className="hidden sm:inline">{isNew ? "公開に進む" : "更新を配信"}</span>
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* 目次やスコアは狭い画面では邪魔になるので、本文に幅を譲る */}
        <aside className="hidden md:flex w-14 bg-white border-r border-gray-200 flex-col items-center py-4 space-y-4 shrink-0 z-20">
          <button
            type="button"
            onClick={() => setActiveSidePanel(activeSidePanel === "toc" ? null : "toc")}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              activeSidePanel === "toc"
                ? "bg-sky-100 text-sky-700 ring-2 ring-sky-400"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <List className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setActiveSidePanel(activeSidePanel === "score" ? null : "score")}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              activeSidePanel === "score"
                ? "bg-amber-100 text-amber-700 ring-2 ring-amber-400"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <Sliders className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => setActiveSidePanel(activeSidePanel === "settings" ? null : "settings")}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
              activeSidePanel === "settings"
                ? "bg-purple-100 text-purple-700 ring-2 ring-purple-400"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <Tag className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <button
            type="button"
            onClick={() => setActiveSidePanel(activeSidePanel === "help" ? null : "help")}
            className="w-10 h-10 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </aside>

        {activeSidePanel && (
          <aside className="hidden md:block w-72 bg-white border-r border-gray-200 p-4 space-y-4 shrink-0 overflow-y-auto z-10 animate-in fade-in slide-in-from-left-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
                {activeSidePanel === "toc" && <List className="w-4 h-4 text-sky-600" />}
                {activeSidePanel === "score" && <Sliders className="w-4 h-4 text-amber-600" />}
                {activeSidePanel === "settings" && <Tag className="w-4 h-4 text-purple-600" />}
                {activeSidePanel === "help" && <HelpCircle className="w-4 h-4 text-gray-600" />}
                <span>
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
                  <p className="text-gray-400 text-center py-6">見出しを設定すると表示されます</p>
                )}
              </div>
            )}
            {activeSidePanel === "score" && <PRQualityScore formData={currentFormData} />}
            {activeSidePanel === "settings" && (
              <div className="space-y-4 text-xs">
                <div>
                  <Label className="mb-1">カテゴリ</Label>
                  <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </Select>
                </div>
              </div>
            )}
          </aside>
        )}

        <main className="flex-1 min-w-0 overflow-y-auto py-6 sm:py-8 px-3 sm:px-8 flex justify-center bg-[#f9fafb]">
          <div className="w-full max-w-3xl space-y-6">
            {activeMode === "yawaraka_pr" && (
              <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 font-bold shadow-xs">
                    <Heart className="w-5 h-5 fill-current" />
                  </div>
                  <div>
                    <span className="font-extrabold text-amber-950 text-sm">
                      やわらかPR モード
                    </span>
                    <p className="text-xs text-amber-800/80 mt-0.5">
                      本文を選択すると、その場でコメントを追加できます。
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-200/80 shadow-sm p-4 sm:p-10 space-y-6 min-h-[700px] relative">
              <div className="relative group rounded-xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 hover:border-sky-300 transition-all">
                {imageUrl ? (
                  <div className="relative">
                    <img src={imageUrl} alt="Header visual" className="w-full h-56 sm:h-72 object-cover rounded-xl" />
                  </div>
                ) : (
                  <button type="button" onClick={() => setShowImagePicker(true)} className="w-full py-12 flex flex-col items-center justify-center text-gray-400">
                    <Plus className="w-6 h-6" />
                  </button>
                )}
              </div>

              <Textarea value={title} onChange={(e) => setTitle(e.target.value)} className="w-full text-2xl sm:text-3xl font-extrabold text-gray-900 border-none focus:ring-0 focus:outline-none bg-transparent resize-none p-0 leading-tight" />
              <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full text-base font-medium text-gray-600 border-none focus:ring-0 focus:outline-none p-0 bg-transparent" />

              <Separator className="bg-gray-100" />

              {/* In Press Release Mode: Editable Textarea & Block Menu */}
              {activeMode === "press_release" ? (
                <div className="relative space-y-4">
                  <div className="relative flex items-center gap-2 py-1">
                    <button
                      type="button"
                      onClick={() => setBlockMenuOpen(!blockMenuOpen)}
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center bg-white cursor-pointer"
                    >
                      <Plus className={`w-4 h-4 transition-transform ${blockMenuOpen ? "rotate-45" : ""}`} />
                    </button>
                    <span className="text-xs text-gray-400 font-sans">
                      本文編集
                    </span>
                  </div>

                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={14}
                    placeholder="ここにプレスリリースの本文を記述します..."
                    className="w-full text-base text-gray-800 border border-gray-200 rounded-lg p-3 bg-white leading-relaxed focus:ring-1 focus:ring-sky-400"
                  />
                </div>
              ) : (
                /* In Yawaraka PR Mode: 本文は選択してコメントを足すだけ。書き換えはプレスリリース側で */
                <div className="space-y-4">
                  {/* 記事末尾のメッセージ。最初に書いてもらいたいので本文より上に置く */}
                  <div className="border border-amber-200 bg-[#fefbf6] rounded-xl p-4 space-y-2 shadow-xs">
                    <Label className="text-amber-950 text-xs font-extrabold">
                      このリリースについて
                    </Label>
                    <p className="text-[11px] text-amber-800/80">
                      記事の最後に、広報担当からのメッセージとして載ります。
                    </p>
                    <Textarea
                      value={softPrReflection}
                      onChange={(e) => setSoftPrReflection(e.target.value)}
                      rows={4}
                      placeholder="このリリースを出すまでに考えたこと、迷ったことを書いてみてください。"
                      className="bg-white border-amber-200 text-xs text-gray-900 leading-relaxed"
                    />
                  </div>

                  {/* 選択中の文字色。青いままだとやわらかPRの温度感と合わないので暖色にする */}
                  <style>{`
                    .yawaraka-article ::selection { background-color: #fcd9a8; color: #4a332b; }
                    .yawaraka-article::selection { background-color: #fcd9a8; color: #4a332b; }
                  `}</style>

                  <div
                    ref={articleRef}
                    className="relative mt-4 border-2 border-amber-200/90 rounded-2xl p-6 bg-white space-y-3 shadow-xs"
                  >
                    <div className="flex items-center justify-between border-b border-amber-100 pb-2">
                      <span className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5">
                        <Highlighter className="w-4 h-4 text-amber-600" />
                        本文プレビュー
                      </span>
                      <Badge variant="amber" className="text-[10px] font-bold">クリックでカード編集</Badge>
                    </div>

                    <div
                      className="yawaraka-article text-base text-gray-800 leading-relaxed whitespace-pre-line p-4 rounded-lg select-text"
                      onMouseUp={handleDetectSelection}
                    >
                      <AnnotatedContent
                        content={content}
                        softNotes={softNotes}
                        onSelectSoftNote={(note) => handleOpenEditNoteModal(note)}
                      />
                    </div>

                    {selectedText && selectionAnchor && (
                      <div
                        className="absolute z-30 -translate-x-1/2 -translate-y-full pb-2 animate-in fade-in zoom-in-95"
                        style={{ top: selectionAnchor.top, left: selectionAnchor.left }}
                      >
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={handleHighlightSelectedText}
                          className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 shadow-lg px-3 py-1.5 rounded-full font-bold text-white text-xs whitespace-nowrap transition-colors cursor-pointer"
                        >
                          <MessageSquarePlus className="w-3.5 h-3.5" />
                          コメントを追加
                        </button>
                        {/* 吹き出しのしっぽ */}
                        <span className="bottom-[3px] left-1/2 absolute bg-amber-600 w-2.5 h-2.5 rotate-45 -translate-x-1/2" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeMode === "yawaraka_pr" && (
                <div className="mt-8 border border-amber-200 bg-amber-50/60 rounded-2xl p-6 space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                    <span className="font-extrabold text-base text-amber-950 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-amber-600 fill-current" />
                      「広報担当より」のコメント（{softNotes.length}件）
                    </span>
                    <Badge variant="amber" className="text-xs font-bold px-2 py-0.5">
                      クリックして編集
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

                  {/* Active Soft PR Notes Cards List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-end">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const newNote = { anchor: "共働き世帯の“もしも”を支える", comment: "", imageUrl: "" };
                          handleOpenEditNoteModal(newNote, softNotes.length);
                        }}
                        className="text-xs text-amber-900 border-amber-300 bg-white font-bold hover:bg-amber-100"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1 text-amber-600" />
                        手動で追加
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      {softNotes.map((note, idx) => (
                        <div
                          key={idx}
                          onClick={() => handleOpenEditNoteModal(note, idx)}
                          className="bg-white border border-amber-200 hover:border-amber-400 rounded-xl p-3.5 space-y-2 text-xs shadow-2xs cursor-pointer transition-all hover:shadow-xs group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-amber-900 bg-amber-100/90 px-2 py-0.5 rounded border border-amber-300">
                              対象: 「{note.anchor}」
                            </span>
                            <span className="text-[11px] text-amber-700 font-bold group-hover:underline flex items-center gap-1">
                              <Edit3 className="w-3.5 h-3.5" />
                              編集する
                            </span>
                          </div>

                          {note.imageUrl && (
                            <img
                              src={note.imageUrl}
                              alt="補足画像"
                              className="h-20 w-full object-cover rounded border border-amber-100"
                            />
                          )}

                          <p className="text-gray-700 text-xs leading-relaxed bg-amber-50/40 p-2 rounded border border-amber-100">
                            <span className="font-bold text-amber-800 mr-1">広報担当より:</span>
                            {note.comment || "（クリックして文章を入力）"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Popover Card Editing Dialog (Article & Image Inputs) */}
      {editingNote && (
        <Dialog open={!!editingNote} onOpenChange={(open) => !open && setEditingNote(null)}>
          <DialogHeader>
            <div className="flex items-center justify-between border-b pb-3">
              <DialogTitle className="flex items-center gap-2 text-base text-amber-900 font-extrabold">
                <Heart className="w-4 h-4 text-amber-600 fill-current" />
                「広報担当より」のコメント
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Target Anchor Text */}
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 space-y-1">
              <Label className="text-amber-900 font-bold block text-[11px]">
                ハイライトする文章
              </Label>
              <Input
                value={editingNote.anchor}
                onChange={(e) => setEditingNote({ ...editingNote, anchor: e.target.value })}
                className="font-extrabold text-amber-950 text-xs bg-white border-amber-300"
              />
            </div>

            {/* Popover Comment Text (文章) */}
            <div>
              <Label className="text-gray-800 font-bold mb-1 block">コメント</Label>
              <Textarea
                value={editComment}
                onChange={(e) => setEditComment(e.target.value)}
                rows={3}
                placeholder="例: この一文は何度も書き直しました。特別なこのように書くべきか迷いましたが、働くご家庭にとっては一番知りたい情報だと思い、最初に置いています。"
                className="text-xs leading-relaxed border-gray-300 focus:ring-amber-500 font-sans"
              />
            </div>

            {/* Popover Image (画像) */}
            <div className="space-y-2">
              <Label className="text-gray-800 font-bold mb-1 block">画像（任意）</Label>
              <Input
                value={editImageUrl}
                onChange={(e) => setEditImageUrl(e.target.value)}
                placeholder="画像URLを入力（https://images.unsplash.com/...）"
                className="text-xs border-gray-300"
              />

              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-gray-500">サンプル画像から選択:</span>
                <div className="grid grid-cols-5 gap-1.5">
                  {SAMPLE_PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditImageUrl(preset.url)}
                      className={`rounded border overflow-hidden transition-all cursor-pointer ${
                        editImageUrl === preset.url ? "border-amber-600 ring-2 ring-amber-300" : "border-gray-200 hover:border-amber-400"
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="h-10 w-full object-cover" />
                      <span className="block text-[8px] text-center truncate bg-white py-0.5">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Live Popover Card Preview */}
            <div className="border border-amber-200 bg-[#fbf6ee] rounded-xl p-4 space-y-2 shadow-inner">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 block">
                プレビュー
              </span>
              <div className="bg-[#fbf6ee] border border-[#e2d2b6] p-4 rounded-md shadow-md space-y-2 relative">
                <span className="text-[11px] font-bold text-[#a8703a] block">
                  広報担当より
                </span>
                {editImageUrl && (
                  <img src={editImageUrl} alt="補足画像" className="h-28 w-full object-cover rounded-sm border border-[#e2d2b6]" />
                )}
                <p className="text-xs text-[#443b2e] leading-relaxed whitespace-pre-wrap">
                  {editComment || "（文章を入力してください）"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t">
            {editingNoteIndex !== null ? (
              <Button type="button" variant="destructive" size="sm" onClick={handleDeleteEditedNote}>
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                削除
              </Button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setEditingNote(null)}>
                キャンセル
              </Button>
              <Button type="button" size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-bold" onClick={handleSaveEditedNote}>
                保存する
              </Button>
            </div>
          </div>
        </Dialog>
      )}

      {/* Soft PR Clear-all Confirmation */}
      {clearSoftPrConfirmOpen && (
        <Dialog open={clearSoftPrConfirmOpen} onOpenChange={setClearSoftPrConfirmOpen}>
          <div className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-red-700 text-lg">
                <Trash2 className="w-5 h-5" />
                やわらかPRの編集をすべて消しますか？
              </DialogTitle>
              <DialogDescription>
                ハイライトのマーカー{softNotes.length}件・ポップアップカードの文章と画像・広報担当者名・記事末尾のメッセージを空にします。
                プレスリリース本文はそのままで、「更新を配信」するまで公開中の内容も変わりません。
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-end items-center gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setClearSoftPrConfirmOpen(false)}
              >
                やめる
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleClearSoftPr}
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                すべて消す
              </Button>
            </div>
          </div>
        </Dialog>
      )}

      {/* Preview Confirmation Modal */}
      <PRPreviewModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        prData={currentFormData}
      />
    </div>
  );
}



