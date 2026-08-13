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

export interface SoftPrNote {
  anchor: string;
  comment: string;
}

export interface SoftPr {
  author: {
    name: string;
    role: string;
  };
  notes: SoftPrNote[];
  reflection: string[];
}

export interface PressRelease {
  id: string;
  title: string;
  subtitle?: string;
  companyId: string;
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
  softPr?: SoftPr;
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
    companyId: "brainsync",
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
    companyId: "sega-craftegg",
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
    companyId: "orion-denki",
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
  {
    id: "pr-4",
    title:
      "共働き世帯の“もしも”を支える365日診療の小児科「あんどこどもクリニック 昭島モリパーク」が9月1日に開院",
    subtitle:
      "年中無休で診療を行う小児科クリニック｜開院に先立ち8/29・30、親子で参加できる特別講演会「子どもの誤飲・窒息」と院内探検イベントを開催",
    companyId: "seseragi",
    company: "医療法人せせらぎ",
    category: "ライフスタイル",
    subCategory: "医療・子育て",
    timestamp: "3分前",
    publishedAt: "2026年8月13日 10時33分",
    imageUrl:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1000&auto=format&fit=crop&q=80",
    secondaryImages: [
      "https://images.unsplash.com/photo-1584515933487-779824d29309?w=800&auto=format&fit=crop&q=80",
    ],
    pvCount: 3120,
    likesCount: 210,
    keywords: ["開院", "小児科", "イベント", "子育て", "地域"],
    summaryHighlights: [
      "2026年9月1日、東京都昭島市に年中無休（土・日・祝日も一般外来対応）の小児科「あんどこどもクリニック 昭島モリパーク」が開院",
      "8月29日・30日、親子参加型イベント「あんど探検隊」と院長による特別講演会「子どもの誤飲・窒息」を開催（参加無料・予約制）",
      "共働き世帯の急な受診ニーズに応える診療体制を、地域の保護者の声をもとに構築",
    ],
    content: `小児科クリニックを運営する医療法人せせらぎ（埼玉県さいたま市大宮区桜木町2-902 大宮サクラスクエアモール302、理事長：野﨑 彰）は、2026年9月1日（火）、東京都昭島市に、土・日・祝日も一般外来に対応する「あんどこどもクリニック 昭島モリパーク」を開院いたします。

開院に先立ち、8月29日（土）・30日（日）の2日間、地域の皆様向けに「あんど探検隊」と院長による特別講演会「子どもの誤飲・窒息」を開催します。親子で楽しみながら院内の雰囲気に触れ、もしもの時に役立つ応急知識を身につけていただける参加型のイベントです。

■開院の背景
消費者庁が厚生労働省「人口動態調査」を分析した結果によると、平成26年から令和元年までの6年間で、食品を誤嚥して窒息し死亡した14歳以下の子どもは80名にのぼり、そのうち5歳以下が73名と全体の9割を占めています。誤飲・窒息は、家庭内で誰にでも起こり得る身近な事故です。

また、共働き世帯の増加に伴い、平日の受診が難しく、休日や夜間に子どもの急な体調変化に直面する家庭も少なくありません。当院はこうした背景を踏まえ、土・日・祝日も含む年中無休の診療体制を整え、地域のご家族が“もしも”の時に迷わず相談できる場所を目指します。

■イベントの概要
昭島駅北口から徒歩4分の「プレミスト昭島モリパークレジデンス」1階にて、子どもたちがキッズドクターになりきって院内を楽しく体験できる「あんど探検隊」と、現役小児科医の院長による「子どもの誤飲・窒息」に関する講演会を開催いたします。

「子育てを一緒に」をコンセプトに掲げる当院が主催するイベントで、親子で楽しみながらクリニックの雰囲気や工夫、非常時の安心知識を身につけていただける参加型イベントです。

★あんど探検隊！（キッズドクター＆院内探検）★
白衣と探検隊の帽子を身につけて「キッズドクター」に変身！「探検隊カルテ」を持って、お子さまがドクター役、親御さんが患者役になって診察室での体温測定や聴診器体験などに挑みます。ミッションを全てクリアしたらプレゼントの授与があります。
※プレゼントは数に限りがございます

★院長特別講演会「子どもの誤飲・窒息」★
自身も子育て真っ最中である小児科専門医の院長 伊藤花菜が、家庭で突然起こる「誤飲・窒息」の危険サインや、正しい応急処置（背部叩打法等）をわかりやすく解説する実践型の講演会です。`,
    surveyTables: [
      {
        title: "【イベント概要】あんど探検隊／院長特別講演会「子どもの誤飲・窒息」",
        headers: ["項目", "内容"],
        rows: [
          ["開催日時", "8月29日（土）・8月30日（日）　10:00〜16:00（予約制／事前受付実施中）"],
          ["対象者", "地域のファミリー世帯"],
          ["会場", "あんどこどもクリニック 昭島モリパーク（東京都昭島市／プレミスト昭島モリパークレジデンス1階）"],
          ["参加費", "無料"],
        ],
      },
    ],
    companyProfile: {
      name: "医療法人せせらぎ",
      representative: "理事長 野﨑 彰",
      address: "埼玉県さいたま市大宮区桜木町2-902 大宮サクラスクエアモール302",
      established: "2014年4月1日",
      capital: "非公開（医療法人）",
      business: "小児科クリニックの運営",
      website: "https://ando-kodomo-clinic.jp",
    },
    contactInfo: {
      department: "医療法人せせらぎ 事務局",
      person: "広報担当：佐倉 なつめ",
      email: "press@ando-kodomo-clinic.jp",
      tel: "042-000-0000",
      website: "https://ando-kodomo-clinic.jp",
    },
    softPr: {
      author: {
        name: "佐倉 なつめ",
        role: "医療法人せせらぎ 事務局／広報担当",
      },
      notes: [
        {
          anchor: "土・日・祝日も一般外来に対応する",
          comment:
            "この一文は何度も書き直しました。特別なことのように書くべきか迷いましたが、働くご家庭にとっては一番知りたい情報だと思い、最初に置いています。",
        },
        {
          anchor:
            "食品を誤嚥して窒息し死亡した14歳以下の子どもは80名にのぼり、そのうち5歳以下が73名と全体の9割を占めています。",
          comment:
            "この数字を載せるかは議論がありました。不安をあおりたいわけではないからです。ただ院長が「知っていれば防げる事故が多い」と話していたことが、そのまま講演会の企画につながっています。",
        },
        {
          anchor: "土・日・祝日も含む年中無休の診療体制",
          comment:
            "保護者アンケートでも、受診をためらった理由の多くは「仕事を抜けられない」という現実的なものでした。年中無休は、その回答から決まった体制です。",
        },
        {
          anchor: "白衣と探検隊の帽子を身につけて「キッズドクター」に変身！",
          comment:
            "スタッフの間で一番盛り上がったのがこの企画でした。白衣のサイズを何度も試着して決めています。子どもが親を診察する時間になるはずです。",
        },
        {
          anchor: "正しい応急処置（背部叩打法等）をわかりやすく解説する実践型の講演会",
          comment:
            "院長は「困ってから来る場所ではなく、困る前に一度来ておける場所にしたい」と繰り返し言っています。この2日間は、その最初の機会です。",
        },
      ],
      reflection: [
        "「あんど」は、安堵から取った名前です。子どもが安心できる場所であることはもちろんですが、準備を進めるなかで、まず大人のほうが安心できる場所にしたい、と考えるようになりました。",
        "地域の保護者の方に話を聞く機会が何度もありました。印象に残っているのは、「子どもが熱を出した日の朝、まず考えるのは病院のことではなく、仕事をどう調整するかだ」という言葉です。医療の話をしに行ったつもりが、暮らしの話を聞かせていただいた時間でした。年中無休という体制は、そこから決まっています。365日という数字を掲げたいわけではありません。土曜の午後でも日曜の朝でも、「今日は開いているだろうか」と調べなくていい。そのくらいの当たり前を、この地域につくれたらと考えています。",
        "開院前にイベントを行うのも同じ理由からです。8月29日・30日は、診察のない2日間です。どうぞ気軽にのぞきにいらしてください。まだ始まってもいないクリニックですので、できないこともあります。それでも、9月1日からは毎日ここにいます。それだけは、はっきりとお伝えしておきたいと思います。",
      ],
    },
  },
];
