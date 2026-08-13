export type AdminCompany = {
  companyId: number;
  name: string;
  industry: string;
  businessCategory: string;
  prefecture: string;
  capitalTier: "seed" | "growth" | "enterprise";
  description: string;
};

export type AdminRelease = {
  id: string;
  companyId: number;
  title: string;
  summary: string;
  category: string;
  keywords: string[];
  startedAt: string;
  pv: number;
  imageUrl: string;
};

export type ReleaseHistoryGroup = {
  year: number;
  label: string;
  releases: Array<AdminRelease & { formattedStartedAt: string }>;
};

export type SimilarCompanyInsight = {
  company: AdminCompany;
  score: number;
  reasons: string[];
  latestRelease: AdminRelease & { formattedStartedAt: string };
  commonKeywords: string[];
};

export type SuggestedTopic = {
  title: string;
  description: string;
  evidence: string;
  confidence: number;
  keywords: string[];
};

export type AdminDashboardData = {
  company: AdminCompany;
  latestRelease: AdminRelease & { formattedStartedAt: string };
  history: ReleaseHistoryGroup[];
  similarCompanies: SimilarCompanyInsight[];
  suggestedTopics: SuggestedTopic[];
  summary: {
    releaseCount: number;
    totalPv: number;
    averagePv: number;
    peerReleaseCount: number;
  };
  generatedAt: string;
};

const companies: AdminCompany[] = [
  {
    companyId: 1001,
    name: "株式会社BrainSync",
    industry: "情報通信",
    businessCategory: "生成AI・業務DX",
    prefecture: "東京都",
    capitalTier: "growth",
    description: "法人向け生成AIプラットフォームとDX支援を提供",
  },
  {
    companyId: 1002,
    name: "株式会社DataOrbit",
    industry: "情報通信",
    businessCategory: "生成AI・業務DX",
    prefecture: "東京都",
    capitalTier: "growth",
    description: "データ分析と業務自動化プロダクトを提供",
  },
  {
    companyId: 1003,
    name: "株式会社WorkShift Labs",
    industry: "情報通信",
    businessCategory: "SaaS・業務効率化",
    prefecture: "東京都",
    capitalTier: "growth",
    description: "バックオフィス向けワークフローSaaSを開発",
  },
  {
    companyId: 1004,
    name: "株式会社NeuraWorks Japan",
    industry: "情報通信",
    businessCategory: "生成AI・業務DX",
    prefecture: "大阪府",
    capitalTier: "enterprise",
    description: "企業向けAI基盤とセキュリティ支援を展開",
  },
  {
    companyId: 1005,
    name: "株式会社CloudHarbor",
    industry: "情報通信",
    businessCategory: "クラウド・データ基盤",
    prefecture: "東京都",
    capitalTier: "growth",
    description: "クラウド移行とデータ活用基盤を提供",
  },
];

const releases: AdminRelease[] = [
  {
    id: "admin-pr-2026-01",
    companyId: 1001,
    title: "生成AI時代の業務効率化に関する全国意識調査を発表",
    summary: "全国1,200名を対象に、生成AIの利用率と生産性への効果を調査しました。",
    category: "調査・レポート",
    keywords: ["生成AI", "業務効率化", "調査", "生産性"],
    startedAt: "2026-08-13T10:00:00+09:00",
    pv: 18540,
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1400&auto=format&fit=crop&q=85",
  },
  {
    id: "admin-pr-2025-03",
    companyId: 1001,
    title: "生成AIアシスタント『BrainSync Copilot』大規模アップデート",
    summary: "社内ナレッジ検索と議事録作成を統合し、管理機能を強化しました。",
    category: "商品・サービス",
    keywords: ["生成AI", "新機能", "SaaS", "ナレッジ検索"],
    startedAt: "2025-08-07T11:00:00+09:00",
    pv: 12780,
    imageUrl: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=1400&auto=format&fit=crop&q=85",
  },
  {
    id: "admin-pr-2025-02",
    companyId: 1001,
    title: "製造業向け生成AI導入支援パッケージの提供を開始",
    summary: "製造現場の文書検索と技能継承を支援する業界別パッケージです。",
    category: "商品・サービス",
    keywords: ["生成AI", "製造業", "導入支援", "DX"],
    startedAt: "2025-02-12T09:30:00+09:00",
    pv: 9460,
    imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1400&auto=format&fit=crop&q=85",
  },
  {
    id: "admin-pr-2024-02",
    companyId: 1001,
    title: "株式会社東都システムと生成AI領域で業務提携",
    summary: "両社の顧客基盤と技術を活用し、企業のAI導入を共同で支援します。",
    category: "経営・提携",
    keywords: ["業務提携", "生成AI", "導入支援"],
    startedAt: "2024-11-05T15:00:00+09:00",
    pv: 8120,
    imageUrl: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1400&auto=format&fit=crop&q=85",
  },
  {
    id: "admin-pr-2024-01",
    companyId: 1001,
    title: "法人向け生成AIプラットフォーム正式版を提供開始",
    summary: "権限管理と監査ログを備えた法人向け正式版を公開しました。",
    category: "商品・サービス",
    keywords: ["生成AI", "新サービス", "セキュリティ", "法人向け"],
    startedAt: "2024-08-20T10:00:00+09:00",
    pv: 11320,
    imageUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&auto=format&fit=crop&q=85",
  },
  {
    id: "peer-1002-01",
    companyId: 1002,
    title: "生成AI導入企業の月間業務時間を平均31%削減、利用実績を公開",
    summary: "導入企業42社の利用ログから業務削減効果と定着の要因を分析しました。",
    category: "導入事例",
    keywords: ["生成AI", "業務効率化", "導入事例", "生産性"],
    startedAt: "2026-08-08T10:00:00+09:00",
    pv: 16420,
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1400&auto=format&fit=crop&q=85",
  },
  {
    id: "peer-1002-02",
    companyId: 1002,
    title: "金融機関向けAIデータ分析テンプレートを提供開始",
    summary: "説明可能性と監査対応を重視した業界別テンプレートを提供します。",
    category: "商品・サービス",
    keywords: ["生成AI", "金融", "業界特化", "セキュリティ"],
    startedAt: "2026-07-21T11:00:00+09:00",
    pv: 13110,
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1400&auto=format&fit=crop&q=85",
  },
  {
    id: "peer-1003-01",
    companyId: 1003,
    title: "人事・総務部門の定型業務を自動化する新機能を発表",
    summary: "申請処理と社内問い合わせ対応を一つのワークフローに統合しました。",
    category: "商品・サービス",
    keywords: ["業務効率化", "新機能", "バックオフィス", "自動化"],
    startedAt: "2026-08-05T09:00:00+09:00",
    pv: 12840,
    imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1400&auto=format&fit=crop&q=85",
  },
  {
    id: "peer-1003-02",
    companyId: 1003,
    title: "大手物流企業への導入で申請リードタイムを56%短縮",
    summary: "現場を巻き込んだ導入プロセスと定着施策を事例として公開しました。",
    category: "導入事例",
    keywords: ["導入事例", "業務効率化", "物流", "DX"],
    startedAt: "2026-07-14T13:00:00+09:00",
    pv: 14980,
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1400&auto=format&fit=crop&q=85",
  },
  {
    id: "peer-1004-01",
    companyId: 1004,
    title: "企業向けAIガバナンス診断サービスを提供開始",
    summary: "生成AI利用時のリスクを可視化し、運用ルール策定まで支援します。",
    category: "商品・サービス",
    keywords: ["生成AI", "ガバナンス", "セキュリティ", "新サービス"],
    startedAt: "2026-08-01T10:30:00+09:00",
    pv: 17360,
    imageUrl: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1400&auto=format&fit=crop&q=85",
  },
  {
    id: "peer-1004-02",
    companyId: 1004,
    title: "西日本のDX支援強化に向け地域金融機関3社と連携",
    summary: "地域企業向けセミナーと個別導入支援を共同展開します。",
    category: "経営・提携",
    keywords: ["業務提携", "DX", "地域企業", "導入支援"],
    startedAt: "2026-07-09T15:00:00+09:00",
    pv: 10250,
    imageUrl: "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1400&auto=format&fit=crop&q=85",
  },
  {
    id: "peer-1005-01",
    companyId: 1005,
    title: "生成AI活用を支えるセキュアデータ基盤の提供を開始",
    summary: "機密データを保護しながらAIに接続できるクラウド基盤を提供します。",
    category: "商品・サービス",
    keywords: ["生成AI", "クラウド", "セキュリティ", "データ基盤"],
    startedAt: "2026-07-30T09:30:00+09:00",
    pv: 11890,
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1400&auto=format&fit=crop&q=85",
  },
];

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Tokyo",
});

function formatRelease(release: AdminRelease) {
  return {
    ...release,
    formattedStartedAt: dateFormatter.format(new Date(release.startedAt)),
  };
}

function keywordSet(companyId: number) {
  return new Set(
    releases
      .filter((release) => release.companyId === companyId)
      .flatMap((release) => release.keywords),
  );
}

function buildSimilarity(target: AdminCompany, candidate: AdminCompany) {
  const targetKeywords = keywordSet(target.companyId);
  const candidateKeywords = keywordSet(candidate.companyId);
  const commonKeywords = [...candidateKeywords].filter((keyword) => targetKeywords.has(keyword));
  const reasons: string[] = [];
  let score = 0;

  if (candidate.industry === target.industry) {
    score += 35;
    reasons.push("同一業種");
  }
  if (candidate.businessCategory === target.businessCategory) {
    score += 20;
    reasons.push("事業分類が近い");
  }
  if (candidate.prefecture === target.prefecture) {
    score += 10;
    reasons.push("同一エリア");
  }
  if (candidate.capitalTier === target.capitalTier) {
    score += 10;
    reasons.push("企業規模が近い");
  }

  const keywordScore = Math.min(25, commonKeywords.length * 5);
  score += keywordScore;
  if (commonKeywords.length) reasons.push(`共通テーマ ${commonKeywords.length}件`);

  return { score, reasons, commonKeywords };
}

function buildSuggestedTopics(similarCompanies: SimilarCompanyInsight[]): SuggestedTopic[] {
  const sourceNames = similarCompanies.slice(0, 3).map((item) => item.company.name);
  const peerKeywords = new Set(
    similarCompanies.flatMap((item) => item.latestRelease.keywords),
  );

  const candidates: Array<SuggestedTopic & { matches: string[] }> = [
    {
      title: "導入効果を数値で示す顧客事例",
      description: "利用前後の工数・利用率・定着率を具体的な数字で見せる発信が注目されています。",
      evidence: `${sourceNames[0]}などが、導入成果を定量化した発信を継続しています。`,
      confidence: 92,
      keywords: ["導入事例", "業務効率化", "生産性"],
      matches: ["導入事例", "業務効率化", "生産性"],
    },
    {
      title: "業界別ユースケースと安全な運用設計",
      description: "金融・製造など対象業界を絞り、セキュリティやガバナンスまで示す企画です。",
      evidence: `${sourceNames[1]}を含む類似企業で、業界特化型の発表が増えています。`,
      confidence: 86,
      keywords: ["業界特化", "セキュリティ", "生成AI"],
      matches: ["業界特化", "セキュリティ", "ガバナンス"],
    },
    {
      title: "パートナー連携による提供領域の拡大",
      description: "顧客基盤や地域ネットワークを持つ企業との連携を、具体的な提供価値とともに発信します。",
      evidence: `${sourceNames[2]}などの提携発表から、導入支援まで踏み込む傾向が見られます。`,
      confidence: 78,
      keywords: ["業務提携", "DX", "導入支援"],
      matches: ["業務提携", "DX", "導入支援"],
    },
  ];

  return candidates
    .map(({ matches, ...topic }) => ({
      ...topic,
      confidence: Math.min(96, topic.confidence + matches.filter((keyword) => peerKeywords.has(keyword)).length),
    }))
    .sort((a, b) => b.confidence - a.confidence);
}

export function getAdminDashboardData(companyId = 1001): AdminDashboardData {
  const company = companies.find((item) => item.companyId === companyId) ?? companies[0];
  const companyReleases = releases
    .filter((release) => release.companyId === company.companyId)
    .sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt));
  const latestRelease = companyReleases[0];
  const referenceYear = new Date(latestRelease.startedAt).getFullYear();
  const historyMap = new Map<number, AdminRelease[]>();

  for (const release of companyReleases.slice(1)) {
    const year = new Date(release.startedAt).getFullYear();
    const group = historyMap.get(year) ?? [];
    group.push(release);
    historyMap.set(year, group);
  }

  const history = [...historyMap.entries()]
    .sort(([yearA], [yearB]) => yearB - yearA)
    .map(([year, groupedReleases]) => {
      const yearsAgo = referenceYear - year;
      return {
        year,
        label: yearsAgo === 0 ? "今年" : `${yearsAgo}年前`,
        releases: groupedReleases.map(formatRelease),
      };
    });

  const similarCompanies = companies
    .filter((candidate) => candidate.companyId !== company.companyId)
    .map((candidate) => {
      const similarity = buildSimilarity(company, candidate);
      const latestCandidateRelease = releases
        .filter((release) => release.companyId === candidate.companyId)
        .sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt))[0];
      return {
        company: candidate,
        ...similarity,
        latestRelease: formatRelease(latestCandidateRelease),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const totalPv = companyReleases.reduce((sum, release) => sum + release.pv, 0);

  return {
    company,
    latestRelease: formatRelease(latestRelease),
    history,
    similarCompanies,
    suggestedTopics: buildSuggestedTopics(similarCompanies),
    summary: {
      releaseCount: companyReleases.length,
      totalPv,
      averagePv: Math.round(totalPv / companyReleases.length),
      peerReleaseCount: similarCompanies.reduce(
        (sum, item) => sum + releases.filter((release) => release.companyId === item.company.companyId).length,
        0,
      ),
    },
    generatedAt: dateFormatter.format(new Date()),
  };
}
