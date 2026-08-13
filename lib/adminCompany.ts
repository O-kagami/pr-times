import { PRESS_RELEASES, type PressRelease } from "@/data/pressReleases";
import { getCompany, listCompanyReleases, toReleaseSlug } from "@/lib/companiesRepository";
import { listPressReleases } from "@/lib/pressReleasesRepository";
import { extractPrefecture, toAbsoluteImageUrl } from "@/lib/adminDashboardRepository";

/**
 * 管理画面（/admin/companies/[companyId]）が扱う企業の共通形。
 *
 * companyId が数値（例: 163727 杉村精工）なら RDS の company / release を、
 * slug（例: seseragi 医療法人せせらぎ）なら data/pressReleases.ts と
 * press_releases テーブルのデモデータを正とする。
 * 公開側の /companies/[companyId] と同じ出し分けを、管理画面でも踏襲している。
 */

export interface AdminRelease {
  key: string;
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
  publishedAt: Date;
  pageView: number;
  likeCount: number;
  keywords: string[];
  href: string;
}

export interface AdminCompany {
  companyId: string;
  name: string;
  description: string;
  industryId: number;
  industryName: string;
  prefecture: string | null;
  foundationLabel: string | null;
  source: "db" | "demo";
  releases: AdminRelease[];
}

export interface Milestones {
  totalPageView: number;
  totalLikes: number;
  releaseCount: number;
  firstReleaseAt: Date | null;
  latestReleaseAt: Date | null;
  daysSinceFirst: number;
  activeMonths: number;
}

/**
 * デモ用（slug）企業の業種・地域。
 * RDS の company に行が無いので、似た企業のサジェストに使う値をここで補う。
 */
const DEMO_COMPANY_PROFILES: Record<
  string,
  { industryId: number; industryName: string; prefecture: string }
> = {
  seseragi: { industryId: 14, industryName: "医療・福祉", prefecture: "埼玉県" },
};

/** "2026年8月13日 10時33分" のような日本語表記を Date にする */
const parseJapaneseDateTime = (value: string | undefined): Date => {
  const match = value?.match(
    /(\d{4})年\s*(\d{1,2})月\s*(\d{1,2})日(?:\s*(\d{1,2})時\s*(\d{1,2})分)?/
  );

  if (match) {
    const [, year, month, day, hour, minute] = match;
    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour ?? 0),
      Number(minute ?? 0)
    );
  }

  const parsed = value ? new Date(value) : new Date(NaN);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
};

const toAdminReleaseFromPressRelease = (
  release: PressRelease,
  companyId: string
): AdminRelease => ({
  key: release.id,
  title: release.title,
  subtitle: release.subtitle ?? null,
  imageUrl: release.imageUrl || null,
  publishedAt: parseJapaneseDateTime(release.publishedAt),
  pageView: release.pvCount ?? 0,
  likeCount: release.likesCount ?? 0,
  keywords: release.keywords ?? [],
  href: `/companies/${companyId}/releases/${release.id}`,
});

/** デモ企業のリリース。静的データに、管理画面から保存した press_releases を上書きで重ねる */
const listDemoReleases = async (companyId: string): Promise<AdminRelease[]> => {
  let saved: PressRelease[] = [];

  try {
    saved = await listPressReleases();
  } catch (error) {
    console.error("[admin] Failed to load saved press releases", error);
  }

  const byId = new Map<string, PressRelease>();
  [...PRESS_RELEASES, ...saved].forEach((release) => {
    byId.set(release.id, release);
  });

  return [...byId.values()]
    .filter((release) => release.companyId === companyId)
    .map((release) => toAdminReleaseFromPressRelease(release, companyId))
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
};

const getDemoCompany = async (companyId: string): Promise<AdminCompany | null> => {
  const profile = DEMO_COMPANY_PROFILES[companyId];
  if (!profile) {
    return null;
  }

  const releases = await listDemoReleases(companyId);
  const companyProfile = PRESS_RELEASES.find(
    (release) => release.companyId === companyId
  )?.companyProfile;

  return {
    companyId,
    name: companyProfile?.name ?? companyId,
    description: companyProfile?.business ?? "",
    industryId: profile.industryId,
    industryName: profile.industryName,
    prefecture: extractPrefecture(companyProfile?.address) ?? profile.prefecture,
    foundationLabel: companyProfile?.established ?? null,
    source: "demo",
    releases,
  };
};

const getDbCompany = async (companyId: string): Promise<AdminCompany | null> => {
  const numericId = Number(companyId);
  const company = await getCompany(numericId);

  if (!company) {
    return null;
  }

  const releases = await listCompanyReleases(numericId);

  return {
    companyId,
    name: company.name,
    description: company.description,
    industryId: company.industryId,
    industryName: company.industryName ?? "その他",
    prefecture: extractPrefecture(company.address),
    foundationLabel: company.foundationDate || null,
    source: "db",
    releases: releases.map((release) => ({
      key: toReleaseSlug(release.companyId, release.releaseId),
      title: release.title,
      subtitle: release.subtitle,
      imageUrl: toAbsoluteImageUrl(release.mainImage),
      publishedAt: release.createdAt,
      pageView: release.pageView,
      likeCount: release.likeCount,
      keywords: release.keywords,
      href: `/companies/${companyId}/releases/${toReleaseSlug(
        release.companyId,
        release.releaseId
      )}`,
    })),
  };
};

export const getAdminCompany = async (companyId: string): Promise<AdminCompany | null> =>
  /^\d+$/.test(companyId) ? getDbCompany(companyId) : getDemoCompany(companyId);

/** レイアウト（サイドバー）だけが必要とする、リリースを引かない軽い問い合わせ */
export const getAdminCompanyHeader = async (
  companyId: string
): Promise<{ name: string; industryName: string } | null> => {
  if (!/^\d+$/.test(companyId)) {
    const profile = DEMO_COMPANY_PROFILES[companyId];
    if (!profile) {
      return null;
    }

    const companyProfile = PRESS_RELEASES.find(
      (release) => release.companyId === companyId
    )?.companyProfile;

    return {
      name: companyProfile?.name ?? companyId,
      industryName: profile.industryName,
    };
  }

  const company = await getCompany(Number(companyId));
  return company
    ? { name: company.name, industryName: company.industryName ?? "その他" }
    : null;
};

/** 日数を「2年3か月」のような、振り返りに使える表記にする */
export const formatSpan = (days: number): string | null => {
  if (days <= 0) {
    return null;
  }

  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);

  if (years > 0) {
    return months > 0 ? `${years}年${months}か月` : `${years}年`;
  }

  return months > 0 ? `${months}か月` : `${days}日`;
};

const DAY_MS = 24 * 60 * 60 * 1000;

/** ダッシュボードの「減らない数字」。これまでの発信を足し上げたもの */
export const computeMilestones = (releases: AdminRelease[], now = new Date()): Milestones => {
  const sorted = [...releases].sort(
    (a, b) => a.publishedAt.getTime() - b.publishedAt.getTime()
  );
  const firstReleaseAt = sorted[0]?.publishedAt ?? null;
  const latestReleaseAt = sorted[sorted.length - 1]?.publishedAt ?? null;

  const activeMonths = new Set(
    releases.map(
      (release) => `${release.publishedAt.getFullYear()}-${release.publishedAt.getMonth()}`
    )
  ).size;

  return {
    totalPageView: releases.reduce((sum, release) => sum + release.pageView, 0),
    totalLikes: releases.reduce((sum, release) => sum + release.likeCount, 0),
    releaseCount: releases.length,
    firstReleaseAt,
    latestReleaseAt,
    daysSinceFirst: firstReleaseAt
      ? Math.max(1, Math.floor((now.getTime() - firstReleaseAt.getTime()) / DAY_MS))
      : 0,
    activeMonths,
  };
};

/** 累計PVを、想像しやすい大きさに言い換える */
export const describeReach = (pageView: number): string => {
  if (pageView <= 0) {
    return "最初の1本を出すところから、数字は積み上がっていきます。";
  }
  if (pageView < 100) {
    return `教室いっぱいの人（約35人）${Math.max(1, Math.round(pageView / 35))}クラス分に届いた計算です。`;
  }
  if (pageView < 3000) {
    return `満員のバス（約60人）${Math.round(pageView / 60)}台分の人が読んだ計算です。`;
  }
  if (pageView < 50000) {
    return `小さな町のホール（約1,000人）${Math.round(pageView / 1000)}回分の満席に相当します。`;
  }
  return `東京ドーム（約46,000人）${(pageView / 46000).toFixed(1)}杯分の人に届きました。`;
};
