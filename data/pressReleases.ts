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
  pvCount?: number;
  likesCount?: number;
  keywords: string[];
  content: string;
  contactInfo?: {
    department: string;
    email: string;
    tel: string;
    website: string;
  };
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
    title: "『プロジェクトセカイ カラフルステージ！ feat. 初音ミク』大型アップデート記念イベント開催決定！限定ガチャや新楽曲を追加",
    subtitle: "全世界でユーザー数3000万人を突破したリズム＆アドベンチャーゲーム",
    company: "株式会社セガ / 株式会社Craft Egg",
    category: "エンタメ",
    subCategory: "ゲーム・アプリ",
    timestamp: "10分前",
    publishedAt: "2026年8月13日 10時00分",
    imageUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80",
    pvCount: 14230,
    likesCount: 890,
    keywords: ["コラボ", "イベント", "限定", "ゲーム"],
    content: `株式会社セガおよび株式会社Craft Eggは、スマートフォン向けリズム＆アドベンチャーゲーム『プロジェクトセカイ カラフルステージ！ feat. 初音ミク』において、本日より大型アップデートを実施いたします。

■ 大型アップデート概要
1. 新曲追加
人気のボーカロイド楽曲「メランコリック」およびオリジナル書き下ろし楽曲「星空のメロディ」を追加いたしました。

2. 限定ログインボーナス
期間中にログインすると、クリスタル最大3,000個や限定★4メンバー確定チケットをプレゼント！

3. 新アナザーボーカルver.実装
人気ユニット「Leo/need」「MORE MORE JUMP！」などのアナザーボーカル楽曲が全20曲追加されました。`,
    contactInfo: {
      department: "広報部 プロジェクトセカイ担当",
      email: "pr-pjsekai@sega-example.jp",
      tel: "03-1234-5678",
      website: "https://pjsekai.sega.jp",
    },
  },
  {
    id: "pr-2",
    title: "昭和レトロなカセットデッキデザインのBluetoothオーディオシステムが新登場。エモーショナルな音質と可動ギミックを完全再現",
    subtitle: "懐かしのアナログ操作感と最新ハイレゾ音源テクノロジーの融合",
    company: "株式会社オリオン電機",
    category: "テクノロジー",
    subCategory: "家電・AV機器",
    timestamp: "25分前",
    publishedAt: "2026年8月13日 09時45分",
    imageUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&auto=format&fit=crop&q=80",
    pvCount: 9800,
    likesCount: 654,
    keywords: ["新発売", "限定", "ガジェット"],
    content: `株式会社オリオン電機は、80年代のラジカセ黄金期を彷彿とさせる懐かしいデザインと、現代の最新Bluetooth 5.3・ハイレゾオーディオ技術を兼ね備えたポータブルオーディオ「RETRO-SOUND 1985」を、2026年9月1日より全国の家電量販店およびオンラインショップにて発売いたします。

本製品は、本物のカセットテープメカニズムをリメイクしたインジケーターを搭載。物理ボタンによる「ガチャリ」という押し心地まで忠実に再現しました。`,
    contactInfo: {
      department: "マーケティングコミュニケーション部",
      email: "press@orion-audio.co.jp",
      tel: "06-9876-5432",
      website: "https://orion-audio.co.jp",
    },
  },
  {
    id: "pr-3",
    title: "『崩壊：スターレイル』Ver.2.5「碧空を穿つ天の競」アップデートを実施！新★5キャラクター「飛霄」が登場",
    subtitle: "銀河開拓RPGの最高峰。新たな星系「仙舟・羅浮」演武式典の幕が開く",
    company: "COGNOSPHERE PT. LTD.",
    category: "エンタメ",
    subCategory: "オンラインゲーム",
    timestamp: "45分前",
    publishedAt: "2026年8月13日 09時25分",
    imageUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=80",
    pvCount: 18900,
    likesCount: 1250,
    keywords: ["ゲーム", "イベント", "新発売"],
    content: `グローバルエンターテインメントブランドHoYoverseは、スペースファンタジーRPG『崩壊：スターレイル』において、Ver.2.5「碧空を穿つ天の競」のアップデートを実施したことをお知らせいたします。

今回のバージョンアップでは、仙舟「曜青」の大将軍である★5キャラクター「飛霄（風・巡狩）」が新たにプレイアブルキャラクターとして登場します。`,
    contactInfo: {
      department: "HoYoverse PRチーム",
      email: "pr_jp@hoyoverse.com",
      tel: "03-5555-0199",
      website: "https://hsr.hoyoverse.com",
    },
  },
  {
    id: "pr-4",
    title: "女優・モデルの山田優さんがプロデュースするオーガニックスキンケアブランド「Lumina」より待望の秋限定ナイトセラムが初登場",
    subtitle: "植物由来の美容エキスを限界まで濃縮した贅沢なひとしずく",
    company: "株式会社Lumina Beauty Japan",
    category: "ビューティー",
    subCategory: "スキンケア",
    timestamp: "1時間前",
    publishedAt: "2026年8月13日 09時00分",
    imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80",
    pvCount: 7600,
    likesCount: 420,
    keywords: ["限定", "新商品", "ビューティー"],
    content: `株式会社Lumina Beauty Japanは、モデル・女優として多方面で活躍する山田優さんが全面クリエイティブディレクションを手がけるスキンケアブランド「Lumina」から、秋の乾燥から肌を守るナイトトリートメントセラム「Lumina Botanical Golden Drop」を数量限定で発売いたします。`,
    contactInfo: {
      department: "広報室",
      email: "info@lumina-beauty.jp",
      tel: "03-3456-7890",
      website: "https://lumina-beauty.jp",
    },
  },
  {
    id: "pr-5",
    title: "次世代マルチプレイアクション『CONCORD』正式サービス開始。仲間と共に宇宙を旅するハイテンポなシューティング体験",
    subtitle: "個性豊かな「フリーガン」たちが織りなす新感覚のチームバトル",
    company: "ソニー・インタラクティブエンタテインメント",
    category: "エンタメ",
    subCategory: "PlayStation",
    timestamp: "1時間半前",
    publishedAt: "2026年8月13日 08時30分",
    imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&auto=format&fit=crop&q=80",
    pvCount: 11200,
    likesCount: 510,
    keywords: ["新発売", "ゲーム", "イベント"],
    content: `ソニー・インタラクティブエンタテインメント（SIE）は、PlayStation®5およびPC向けキャラクタードリブン型5v5FPS『CONCORD』のサービスを開始いたしました。

プレイヤーは宇宙の無法者「フリーガン」のクルーとしてチームを組み、銀河系の様々な惑星を舞台に白熱のチームバトルに挑みます。`,
    contactInfo: {
      department: "SIE プレスデスク",
      email: "sie-pr@sony.com",
      tel: "03-6748-6000",
      website: "https://www.playstation.com",
    },
  },
  {
    id: "pr-6",
    title: "米TIME誌「2026年 世界で最も影響力のある企業100社」に日本の生成AIスタートアップ「BrainSync」が選出！",
    subtitle: "独自開発の超高速マルチモーダル大規模言語モデル（LLM）が世界で高く評価",
    company: "株式会社BrainSync",
    category: "ビジネス",
    subCategory: "AI・スタートアップ",
    timestamp: "2時間前",
    publishedAt: "2026年8月13日 08時00分",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop&q=80",
    pvCount: 23100,
    likesCount: 1840,
    keywords: ["AI", "スタートアップ", "DX"],
    content: `生成AIテクノロジーの研究開発を行う株式会社BrainSync（本社：東京都港区、代表取締役CEO：佐藤 健太郎）は、米TIME誌が発表した「TIME100 Most Influential Companies 2026（世界で最も影響力のある企業100社）」の「Pioneers」部門において、日本発のAI企業として唯一選出されたことをお知らせいたします。`,
    contactInfo: {
      department: "広報グループ",
      email: "media@brainsync.ai",
      tel: "03-6800-1122",
      website: "https://brainsync.ai",
    },
  },
  {
    id: "pr-7",
    title: "【新開発】生成AIを活用した営業自動化クラウドサービス「SalesCopilot AI」を発表。商談獲得率を3.5倍に向上",
    subtitle: "AIが顧客インサイトをリアルタイム分析し、最適な提案資料を自動生成",
    company: "株式会社クラウドテクノロジー",
    category: "テクノロジー",
    subCategory: "SaaS・クラウド",
    timestamp: "2時間前",
    publishedAt: "2026年8月13日 08時00分",
    imageUrl: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80",
    pvCount: 6500,
    likesCount: 340,
    keywords: ["AI", "DX", "新発売"],
    content: `クラウドシステムの企画・開発を行う株式会社クラウドテクノロジーは、インサイドセールスおよびフィールドセールスの業務をAIで全面的に支援する次世代営業プラットフォーム「SalesCopilot AI」のサービス提供を本日より開始いたしました。`,
    contactInfo: {
      department: "営業広報課",
      email: "pr@cloud-tech.co.jp",
      tel: "03-4400-5566",
      website: "https://cloud-tech.co.jp",
    },
  },
  {
    id: "pr-8",
    title: "ニューヨーク発のアパレルブランド「Urban Edge」が日本初上陸！表参道にフラッグシップストアをオープン",
    subtitle: "サステナブル素材100%で作るスタイリッシュなストリートウェア",
    company: "Urban Edge Japan株式会社",
    category: "ファッション",
    subCategory: "アパレル・店舗",
    timestamp: "2時間半前",
    publishedAt: "2026年8月13日 07時30分",
    imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&auto=format&fit=crop&q=80",
    pvCount: 4200,
    likesCount: 210,
    keywords: ["イベント", "限定", "SDGs"],
    content: `ニューヨークで若者を中心に絶大な人気を誇るサステナブルストリートウェアブランド「Urban Edge」は、2026年9月15日（金）、東京・表参道に日本第1号店となる旗艦店をグランドオープンいたします。オープン記念限定パーカーも限定200着で販売いたします。`,
    contactInfo: {
      department: "プレスオフィス",
      email: "press@urbanedge.jp",
      tel: "03-5700-8899",
      website: "https://urbanedge.jp",
    },
  },
  {
    id: "pr-9",
    title: "京都老舗茶舗との共同開発！極上の宇治抹茶を惜しみなく使用したプレミアム「生抹茶タルト」が期間限定登場",
    subtitle: "口の中でとろける濃厚な抹茶ガナッシュと香ばしいタルト生地のハーモニー",
    company: "株式会社Patisserie Jardin",
    category: "グルメ",
    subCategory: "スイーツ",
    timestamp: "3時間前",
    publishedAt: "2026年8月13日 07時00分",
    imageUrl: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80",
    pvCount: 8900,
    likesCount: 780,
    keywords: ["限定", "新商品", "期間限定"],
    content: `高級洋菓子ブランドを運営する株式会社Patisserie Jardinは、創業200年の京都・宇治茶舗とのコラボレーションスイーツ「極・宇治生抹茶タルト」を全国の直営店舗および公式オンラインショップにて期間限定で販売開始いたします。`,
    contactInfo: {
      department: "PR・スイーツ事業部",
      email: "sweets@patisserie-jardin.jp",
      tel: "075-222-3344",
      website: "https://patisserie-jardin.jp",
    },
  },
  {
    id: "pr-10",
    title: "【EV最新技術】1回のフル充電で走行距離1,000kmを実現する次世代全固体電池モジュールの実証実験に成功",
    subtitle: "2028年の量産化に向け、超急速充電（10分で80%充電）も確立",
    company: "NextDrive Mobility株式会社",
    category: "テクノロジー",
    subCategory: "自動車・EV",
    timestamp: "3時間半前",
    publishedAt: "2026年8月13日 06時30分",
    imageUrl: "https://images.unsplash.com/photo-1563720223185-11003d516935?w=600&auto=format&fit=crop&q=80",
    pvCount: 15400,
    likesCount: 920,
    keywords: ["DX", "SDGs", "新発売"],
    content: `次世代モビリティエネルギーの開発を手掛けるNextDrive Mobility株式会社は、次世代EV向け全固体バッテリーセルモジュール「SolidPower-X」の実車搭載走行テストにおいて、航続距離1,024kmを達成したことを発表いたします。`,
    contactInfo: {
      department: "広報 IR室",
      email: "ir@nextdrive-mobility.com",
      tel: "03-6200-7788",
      website: "https://nextdrive-mobility.com",
    },
  },
  {
    id: "pr-11",
    title: "完全防音のプライベート個室ジム「SILENT FIT」が渋谷にグランドオープン。24時間いつでも完全予約制で利用可能",
    subtitle: "人目を気にせず自分のペースでトレーニングに集中できる新しいフィットネススタイル",
    company: "株式会社フィットネス革命",
    category: "ライフスタイル",
    subCategory: "ヘルスケア・スポーツ",
    timestamp: "4時間前",
    publishedAt: "2026年8月13日 06時00分",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    pvCount: 5100,
    likesCount: 310,
    keywords: ["イベント", "新発売", "キャンペーン"],
    content: `個室フィットネス事業を展開する株式会社フィットネス革命は、防音性とプライバシーを追求した個室ジム「SILENT FIT 渋谷店」を2026年8月20日（木）にオープンいたします。入会金無料のオープニングキャンペーンも実施いたします。`,
    contactInfo: {
      department: "店舗運営事業部",
      email: "info@silent-fit.jp",
      tel: "03-5411-9900",
      website: "https://silent-fit.jp",
    },
  },
  {
    id: "pr-12",
    title: "【プロ野球】2026シーズン後半戦開幕応援！球場限定コラボグルメ「豪快！肉盛りメガ盛り丼」が限定復刻",
    subtitle: "ファンの熱狂を味味で届ける！今季一番のボリューム満点メニュー",
    company: "株式会社スタジアムフードシステム",
    category: "スポーツ",
    subCategory: "プロスポーツ・フード",
    timestamp: "4時間半前",
    publishedAt: "2026年8月13日 05時30分",
    imageUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&auto=format&fit=crop&q=80",
    pvCount: 6800,
    likesCount: 470,
    keywords: ["限定", "コラボ", "スポーツ"],
    content: `スタジアム飲食プロデュースの株式会社スタジアムフードシステムは、今シーズンのプロ野球後半戦開幕を記念し、過去最高売上を記録した伝説のスタジアムグルメ「肉盛りメガ盛り丼」を、期間限定・数量限定で復活販売することを発表いたします。`,
    contactInfo: {
      department: "企画広報部",
      email: "food@stadium-food.co.jp",
      tel: "03-3800-4455",
      website: "https://stadium-food.co.jp",
    },
  },
  {
    id: "pr-13",
    title: "高校生向け探究学習プラットフォーム「QuestLearn」導入校数が全国1,200校を突破！探究型キャリア教育のデファクトへ",
    subtitle: "実社会の課題をAIと一緒に解決する実践型カリキュラム",
    company: "株式会社EduFuture",
    category: "ビジネス",
    subCategory: "EdTech・教育",
    timestamp: "5時間前",
    publishedAt: "2026年8月13日 05時00分",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format&fit=crop&q=80",
    pvCount: 3900,
    likesCount: 280,
    keywords: ["AI", "DX", "スタートアップ"],
    content: `EdTechスタートアップの株式会社EduFutureは、全国の高校向けに提供している探究学習デジタルプラットフォーム「QuestLearn」の導入校数が1,200校を超えたことをお知らせいたします。生徒1人ひとりの学びの関心に応じたアドバイスをAIがリアルタイムに提示します。`,
    contactInfo: {
      department: "教育ソリューション室",
      email: "contact@edufuture.jp",
      tel: "03-6700-1122",
      website: "https://edufuture.jp",
    },
  },
  {
    id: "pr-14",
    title: "折りたたみ可能な超軽量スマートソーラーパネル「SolarFold Ultra」クラウドファンディングで目標達成率3000%突破",
    subtitle: "重量わずか850g。キャンプや災害時の緊急電源として圧倒的支持",
    company: "株式会社SunTech Innovation",
    category: "モバイル",
    subCategory: "モバイルバッテリー・ソーラー",
    timestamp: "6時間前",
    publishedAt: "2026年8月13日 04時00分",
    imageUrl: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80",
    pvCount: 7100,
    likesCount: 590,
    keywords: ["新発売", "ガジェット", "SDGs"],
    content: `ポータブルエネルギー機器の開発・販売を手掛ける株式会社SunTech Innovationは、クラウドファンディングサイトにて先行予約を受け付けている「SolarFold Ultra」の支援総額が3,000万円を超え、目標金額の3000%を達成したことを発表いたします。`,
    contactInfo: {
      department: "クラファン事業部",
      email: "support@suntech-inno.com",
      tel: "03-5200-9988",
      website: "https://suntech-inno.com",
    },
  },
  {
    id: "pr-15",
    title: "話題のメンタルヘルスケアアプリ「MindCalm」、ストレスレベルを声のトーンから可視化するAI音響解析機能を新搭載",
    subtitle: "毎朝15秒話すだけで感情状態をグラフ化し最適なセルフケア法をアソート",
    company: "株式会社HealthTech Lab",
    category: "アプリ",
    subCategory: "ヘルスケア・AIアプリ",
    timestamp: "7時間前",
    publishedAt: "2026年8月13日 03時00分",
    imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80",
    pvCount: 8400,
    likesCount: 620,
    keywords: ["AI", "アプリ", "新機能"],
    content: `ヘルスケア領域のアプリ開発を行う株式会社HealthTech Labは、メンタルセルフケアアプリ「MindCalm」の最新アップデートにおいて、音声解析技術を活用したストレス状態測定機能の提供を開始いたしました。`,
    contactInfo: {
      department: "アプリPR担当",
      email: "mindcalm@healthtech-lab.co.jp",
      tel: "03-6910-3344",
      website: "https://healthtech-lab.co.jp",
    },
  },
];
