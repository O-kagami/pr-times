export interface SurveyTable {
  title: string;
  headers: string[];
  rows: (string | number)[][];
  caption?: string;
}

export interface CompanyProfile {
  name: string;
  representative: string;
  address: string;
  established: string;
  capital: string;
  business: string;
  website: string;
  logoUrl?: string;
}

export interface InlineNote {
  anchor: string;
  text: string;
  imageUrl?: string;
}

export interface PressRelease {
  id: string;
  title: string;
  subtitle?: string;
  company: string;
  companyLogo?: string;
  category: string;
  subCategory?: string;
  timestamp: string;
  publishedAt: string;
  imageUrl: string;
  secondaryImages?: string[];
  pvCount?: number;
  likesCount?: number;
  keywords: string[];
  inlineNotes?: InlineNote[];
  summaryHighlights?: string[];
  content: string;
  surveyTables?: SurveyTable[];
  companyProfile?: CompanyProfile;
  contactInfo?: {
    department: string;
    person?: string;
    email: string;
    tel: string;
    website: string;
  };
  qrCodes?: {
    label: string;
    qrUrl: string;
    appStoreUrl?: string;
    googlePlayUrl?: string;
  }[];
}

export const CATEGORIES = [
  { id: "all", name: "総合" },
  { id: "tech", name: "テクノロジー" },
  { id: "mobile", name: "モバイル" },
  { id: "app", name: "アプリ" },
  { id: "entertainment", name: "エンタメ" },
  { id: "beauty", name: "ビューティー" },
  { id: "fashion", name: "ファッション" },
  { id: "lifestyle", name: "ライフスタイル" },
  { id: "business", name: "ビジネス" },
  { id: "gourmet", name: "グルメ" },
  { id: "sports", name: "スポーツ" },
];

export const RANKING_TABS = [
  { id: "general", name: "総合" },
  { id: "pv", name: "PVランキング" },
  { id: "likes", name: "いいね！ランキング" },
  { id: "weekly", name: "今週のランキング" },
];

export const TRENDING_KEYWORDS = [
  "限定",
  "イベント",
  "新発売",
  "AI",
  "夏休み",
  "コラボ",
  "スタートアップ",
  "新商品",
  "DX",
  "SDGs",
  "期間限定",
  "キャンペーン",
];

export const PRTIMES_ANNOUNCEMENTS = [
  {
    date: "2026年08月10日",
    title: "【重要】PR TIMES 規約一部改定のお知らせ（2026年9月1日施行）",
    link: "#",
  },
  {
    date: "2026年08月04日",
    title: "「PR TIMES STORY」新たな事例記事コンテスト開催決定！",
    link: "#",
  },
  {
    date: "2026年07月28日",
    title: "メディア関係者様向け「検索アルゴリズム強化」アップデートリリース",
    link: "#",
  },
  {
    date: "2026年07月15日",
    title: "【レポート】2026年上半期プレスリリース配信トレンド＆キーワード分析発表",
    link: "#",
  },
];

export const PRESS_RELEASES: PressRelease[] = [
  {
    id: "pr-1",
    title: "【2026年最新調査】生成AI時代の業務効率化に関する全国意識調査を発表。業務利用率は前年比240%増加、導入企業満足度は88.4%に達する結果に",
    subtitle: "全国の会社員・経営者1,200名を対象に「職場におけるAI導入実態と生産性変化」に関する実態調査を実施",
    company: "株式会社BrainSync",
    category: "ビジネス",
    subCategory: "AI・調査レポート",
    timestamp: "10分前",
    publishedAt: "2026年8月13日 10時00分",
    imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1000&auto=format&fit=crop&q=80",
    secondaryImages: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80",
    ],
    pvCount: 24850,
    likesCount: 1420,
    keywords: ["AI", "調査レポート", "DX", "業務効率化", "スタートアップ"],
    inlineNotes: [
      {
        anchor: "利用率は 54.2% に到達しました。",
        text: "54.2% は「毎日」と「週に数回」利用する人の合計。毎日利用は 28.5% です。",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=640&auto=format&fit=crop&q=80",
      },
      {
        anchor: "・調査方法：インターネットリサーチ（BrainSync総研調べ）",
        text: "数値を見るときは、対象者・期間・方法も一緒に確認すると安心です。",
        imageUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=640&auto=format&fit=crop&q=80",
      },
    ],
    summaryHighlights: [
      "全国の会社員1,200名中、職場での生成AI日常利用率は 54.2% に達し、前年同期比 2.4倍に拡大",
      "AI導入済み企業における「残業削減効果」を実感している割合は 88.4%",
      "最も活用されている用途第1位は「文章作成・校正（72.1%）」、第2位「情報検索・要約（65.4%）」",
    ],
    content: `生成AIテクノロジーの研究開発および法人向けDX支援を行う株式会社BrainSync（本社：東京都港区、代表取締役CEO：佐藤 健太郎）は、全国の20代〜60代の会社員および経営者・役員1,200名を対象に実施した「2026年 職場における生成AI活用実態調査」の結果を発表いたします。

■ 調査実施概要
・調査対象：全国の20代〜60代の会社員・役員・経営者（有効回答数 1,200名）
・調査期間：2026年7月25日〜2026年8月2日
・調査方法：インターネットリサーチ（BrainSync総研調べ）

■ 1. 職場における生成AIの利用状況
「業務において生成AI（LLMツールや自動化アシスタント）を日常的または定期的に利用しているか」という質問に対し、「毎日利用している（28.5%）」「週に数回利用している（25.7%）」を合わせ、利用率は 54.2% に到達しました。`,
    surveyTables: [
      {
        title: "【表1】業務における生成AIの利用頻度（n=1,200）",
        headers: ["回答選択肢", "回答人数", "構成比(%)"],
        rows: [
          ["毎日利用している", "342名", "28.5%"],
          ["週に2〜3回利用している", "308名", "25.7%"],
          ["月に数回程度利用している", "264名", "22.0%"],
          ["認知しているが利用したことはない", "180名", "15.0%"],
          ["生成AIを知らない・利用予定なし", "106名", "8.8%"],
          ["合計", "1,200名", "100.0%"],
        ],
      },
      {
        title: "【表2】生成AI導入による業務削減時間（月間平均／利用者ベース n=650）",
        headers: ["部署・職種", "導入前（平均残業）", "導入後（平均残業）", "削減時間", "満足度"],
        rows: [
          ["経営企画・広報部", "32.4時間", "18.2時間", "▲14.2時間", "92.1%"],
          ["営業・マーケティング", "28.6時間", "17.1時間", "▲11.5時間", "89.4%"],
          ["開発・エンジニアリング", "35.0時間", "22.3時間", "▲12.7時間", "87.0%"],
          ["人事・総務・法務", "24.1時間", "15.0時間", "▲9.1時間", "85.2%"],
          ["全体平均", "30.0時間", "18.15時間", "▲11.85時間", "88.4%"],
        ],
      },
    ],
    companyProfile: {
      name: "株式会社BrainSync",
      representative: "代表取締役CEO 佐藤 健太郎",
      address: "東京都港区六本木6-10-1 六本木ヒルズモリタワー 32階",
      established: "2021年4月15日",
      capital: "5億2,000万円（資本準備金含む）",
      business: "法人向け生成AIプラットフォーム開発・DXコンサルティング事業",
      website: "https://brainsync.ai",
      logoUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80",
    },
    contactInfo: {
      department: "広報・マーケティンググループ",
      person: "広報担当：高橋 里奈",
      email: "pr-media@brainsync.ai",
      tel: "03-6800-1122",
      website: "https://brainsync.ai",
    },
    qrCodes: [
      {
        label: "BrainSync AI Mobile App",
        qrUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://brainsync.ai/app",
        appStoreUrl: "#",
        googlePlayUrl: "#",
      },
    ],
  },
  {
    id: "pr-2",
    title: "『プロジェクトセカイ カラフルステージ！ feat. 初音ミク』大型アップデート記念イベント開催決定！限定ガチャや新楽曲を追加",
    subtitle: "全世界でユーザー数3000万人を突破したリズム＆アドベンチャーゲーム",
    company: "株式会社セガ / 株式会社Craft Egg",
    category: "エンタメ",
    subCategory: "ゲーム・アプリ",
    timestamp: "25分前",
    publishedAt: "2026年8月13日 09時45分",
    imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1000&auto=format&fit=crop&q=80",
    secondaryImages: [
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
    ],
    pvCount: 14230,
    likesCount: 890,
    keywords: ["コラボ", "イベント", "限定", "ゲーム"],
    inlineNotes: [
      {
        anchor: "期間中にログインすると、クリスタル最大3,000個や限定★4メンバー確定チケットをプレゼント！",
        text: "イベントごとに期間・対象楽曲・特典が異なるため、参加前にスケジュール表も確認しましょう。",
        imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=640&auto=format&fit=crop&q=80",
      },
    ],
    summaryHighlights: [
      "全世界3,000万人突破記念の豪華ログインボーナスで最大3,000クリスタルを配布",
      "新規書き下ろし楽曲「星空のメロディ」および人気VOCALOID楽曲「メランコリック」を追加",
      "8月15日(土)より限定★4メンバー登場のアニバーサリーガチャを開始",
    ],
    content: `株式会社セガおよび株式会社Craft Eggは、スマートフォン向けリズム＆アドベンチャーゲーム『プロジェクトセカイ カラフルステージ！ feat. 初音ミク』において、本日より大型アップデートを実施いたします。

■ 大型アップデート概要
1. 新曲追加
人気のボーカロイド楽曲「メランコリック」およびオリジナル書き下ろし楽曲「星空のメロディ」を追加いたしました。

2. 限定ログインボーナス
期間中にログインすると、クリスタル最大3,000個や限定★4メンバー確定チケットをプレゼント！`,
    surveyTables: [
      {
        title: "【イベントスケジュール一覧】",
        headers: ["日程", "イベント名称", "対象楽曲", "特典"],
        rows: [
          ["8月13日〜8月20日", "星空のメロディ前夜祭", "星空のメロディ", "クリスタル×1000"],
          ["8月21日〜8月31日", "アニバーサリーLIVE", "メランコリック", "限定アバター衣装"],
        ],
      },
    ],
    companyProfile: {
      name: "株式会社セガ",
      representative: "代表取締役社長COO 内海 州史",
      address: "東京都品川区西品川1-1-1 住友不動産大崎ガーデンタワー",
      established: "1960年6月3日",
      capital: "100億円",
      business: "コンシューマゲーム・モバイルゲーム・アーケードゲームの企画開発",
      website: "https://sega.jp",
    },
    contactInfo: {
      department: "プロモーション部 セカイ担当",
      person: "広報窓口",
      email: "pr-pjsekai@sega-example.jp",
      tel: "03-1234-5678",
      website: "https://pjsekai.sega.jp",
    },
  },
  {
    id: "pr-3",
    title: "昭和レトロなカセットデッキデザインのBluetoothオーディオシステムが新登場。エモーショナルな音質と可動ギミックを完全再現",
    subtitle: "懐かしのアナログ操作感と最新ハイレゾ音源テクノロジーの融合",
    company: "株式会社オリオン電機",
    category: "テクノロジー",
    subCategory: "家電・AV機器",
    timestamp: "45分前",
    publishedAt: "2026年8月13日 09時25分",
    imageUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=1000&auto=format&fit=crop&q=80",
    pvCount: 9800,
    likesCount: 654,
    keywords: ["新発売", "限定", "ガジェット"],
    inlineNotes: [
      {
        anchor: "発売いたします。",
        text: "LDAC で高音質再生するには、接続するスマートフォンやプレーヤー側も LDAC 対応である必要があります。",
        imageUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=640&auto=format&fit=crop&q=80",
      },
    ],
    summaryHighlights: [
      "80年代ラジカセのメカニカルなスイッチ感を精密金型で再現",
      "Bluetooth 5.3 + LDAC対応でワイヤレスハイレゾ音源を実現",
      "物理レベルメーターが音楽に合わせてアナログ可動",
    ],
    content: `株式会社オリオン電機は、80年代のラジカセ黄金期を彷彿とさせる懐かしいデザインと、現代の最新Bluetooth 5.3・ハイレゾオーディオ技術を兼ね備えたポータブルオーディオ「RETRO-SOUND 1985」を、2026年9月1日より全国の家電量販店およびオンラインショップにて発売いたします。`,
    companyProfile: {
      name: "株式会社オリオン電機",
      representative: "代表取締役 山田 太郎",
      address: "大阪府大阪市中央区城見1-2-27",
      established: "1975年8月10日",
      capital: "1億円",
      business: "音響機器・生活家電の開発・販売",
      website: "https://orion-audio.co.jp",
    },
    contactInfo: {
      department: "広報部",
      email: "press@orion-audio.co.jp",
      tel: "06-9876-5432",
      website: "https://orion-audio.co.jp",
    },
  },
];
