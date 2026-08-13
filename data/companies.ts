import { getAdminDashboardData } from "./adminDashboard";
import {
  PRESS_RELEASES,
  type CompanyProfile,
  type PressRelease,
} from "./pressReleases";

export type CompanyHistoryItem = {
  id: string;
  title: string;
  summary: string;
  category: string;
  keywords: string[];
  startedAt: string;
  formattedStartedAt: string;
  imageUrl: string;
  href?: string;
};

export type CompanyDirectoryEntry = {
  companyId: string;
  adminCompanyId?: number;
  name: string;
  description: string;
  industry: string;
  location: string;
  phone: string;
  representative: string;
  established: string;
  capital: string;
  website: string;
  logoUrl?: string;
  coverImageUrl: string;
  xHandle: string;
  lastUpdated: string;
  releases: PressRelease[];
  history: CompanyHistoryItem[];
};

const adminCompanySlugs: Record<number, string> = {
  1001: "brainsync",
  1002: "dataorbit",
  1003: "workshift-labs",
  1004: "neuraworks-japan",
  1005: "cloudharbor",
};

const historyDateFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Tokyo",
});

function publishedAtToIso(publishedAt: string) {
  const match = publishedAt.match(
    /(\d{4})年(\d{1,2})月(\d{1,2})日\s*(\d{1,2})時(\d{1,2})分/,
  );
  if (!match) return "2026-08-13T10:00:00+09:00";

  const [, year, month, day, hour, minute] = match;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${hour.padStart(2, "0")}:${minute.padStart(2, "0")}:00+09:00`;
}

function publicReleaseToHistory(release: PressRelease): CompanyHistoryItem {
  const startedAt = publishedAtToIso(release.publishedAt);
  return {
    id: release.id,
    title: release.title,
    summary: release.subtitle ?? release.content.split("\n")[0],
    category: release.category,
    keywords: release.keywords,
    startedAt,
    formattedStartedAt: historyDateFormatter.format(new Date(startedAt)),
    imageUrl: release.imageUrl,
    href: `/companies/${release.companyId}/releases/${release.id}`,
  };
}

function getProfile(releases: PressRelease[]): CompanyProfile | undefined {
  return releases.find((release) => release.companyProfile)?.companyProfile;
}

function buildPublicEntry(companyId: string, releases: PressRelease[]): CompanyDirectoryEntry {
  const latest = releases[0];
  const profile = getProfile(releases);
  const adminId = Number(
    Object.entries(adminCompanySlugs).find(([, slug]) => slug === companyId)?.[0],
  );
  const adminData = Number.isSafeInteger(adminId)
    ? getAdminDashboardData(adminId)
    : null;
  const adminHistory = adminData
    ? [adminData.latestRelease, ...adminData.history.flatMap((group) => group.releases)].map(
        (release) => ({
          id: release.id,
          title: release.title,
          summary: release.summary,
          category: release.category,
          keywords: release.keywords,
          startedAt: release.startedAt,
          formattedStartedAt: release.formattedStartedAt,
          imageUrl: release.imageUrl,
        }),
      )
    : [];

  return {
    companyId,
    adminCompanyId: Number.isSafeInteger(adminId) ? adminId : undefined,
    name: latest.company,
    description:
      adminData?.company.description ??
      `${profile?.business ?? latest.category}を通じて、新しい価値とニュースを届けている企業です。`,
    industry: latest.subCategory ?? latest.category,
    location: profile?.address ?? "所在地情報は企業ページで更新予定です",
    phone: latest.contactInfo?.tel ?? "—",
    representative: profile?.representative ?? "—",
    established: profile?.established ?? "—",
    capital: profile?.capital ?? "—",
    website: profile?.website ?? latest.contactInfo?.website ?? "#",
    logoUrl: profile?.logoUrl,
    coverImageUrl: latest.imageUrl,
    xHandle: `@${companyId.replaceAll("-", "_")}_PR`,
    lastUpdated: latest.publishedAt.split(" ")[0],
    releases,
    history: (adminHistory.length
      ? adminHistory
      : releases.map(publicReleaseToHistory)
    ).sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt)),
  };
}

function buildAdminOnlyEntry(adminCompanyId: number): CompanyDirectoryEntry {
  const data = getAdminDashboardData(adminCompanyId);
  const slug = adminCompanySlugs[adminCompanyId];
  const history = [
    data.latestRelease,
    ...data.history.flatMap((group) => group.releases),
  ].sort((a, b) => Date.parse(b.startedAt) - Date.parse(a.startedAt));
  const capitalLabel = {
    seed: "成長フェーズ",
    growth: "グロース企業",
    enterprise: "大企業",
  }[data.company.capitalTier];

  return {
    companyId: slug,
    adminCompanyId,
    name: data.company.name,
    description: data.company.description,
    industry: `${data.company.industry} / ${data.company.businessCategory}`,
    location: data.company.prefecture,
    phone: "—",
    representative: "—",
    established: "—",
    capital: capitalLabel,
    website: "#",
    coverImageUrl: history[0].imageUrl,
    xHandle: `@${slug.replaceAll("-", "_")}_PR`,
    lastUpdated: history[0].formattedStartedAt.split(" ")[0],
    releases: [],
    history: history.map((release) => ({
      id: release.id,
      title: release.title,
      summary: release.summary,
      category: release.category,
      keywords: release.keywords,
      startedAt: release.startedAt,
      formattedStartedAt: release.formattedStartedAt,
      imageUrl: release.imageUrl,
    })),
  };
}

const groupedPublicReleases = new Map<string, PressRelease[]>();
for (const release of PRESS_RELEASES) {
  const companyReleases = groupedPublicReleases.get(release.companyId) ?? [];
  companyReleases.push(release);
  groupedPublicReleases.set(release.companyId, companyReleases);
}

const publicEntries = [...groupedPublicReleases.entries()].map(([companyId, releases]) =>
  buildPublicEntry(companyId, releases),
);
const publicSlugs = new Set(publicEntries.map((entry) => entry.companyId));
const adminOnlyEntries = Object.keys(adminCompanySlugs)
  .map(Number)
  .filter((adminId) => !publicSlugs.has(adminCompanySlugs[adminId]))
  .map(buildAdminOnlyEntry);

export const COMPANY_DIRECTORY = [...publicEntries, ...adminOnlyEntries];

export function getCompany(companyId: string) {
  return COMPANY_DIRECTORY.find((company) => company.companyId === companyId);
}

export function getCompanySlugByAdminId(companyId: number) {
  return adminCompanySlugs[companyId] ?? "brainsync";
}
