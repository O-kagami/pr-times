import { db } from "@/lib/db";
import type { PressRelease } from "@/data/pressReleases";

export interface DbCompany {
  companyId: number;
  name: string;
  president: string;
  address: string;
  phone: string;
  description: string;
  capital: number;
  foundationDate: string;
  url: string;
  industryId: number;
  industryName: string | null;
}

export interface DbRelease {
  releaseId: number;
  companyId: number;
  title: string;
  subtitle: string | null;
  mainImage: string | null;
  createdAt: Date;
  keywords: string[];
  pageView: number;
  likeCount: number;
}

/** release.body の画像は /api/file.php?... という prtimes.jp 上の相対パスで入っている */
const PRTIMES_ORIGIN = "https://prtimes.jp";

const decodeEntities = (value: string) =>
  value
    .replace(/&nbsp;/g, " ")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&amp;/g, "&");

/** company.foundation_date は "1949-07" のような文字列で入っている */
const formatFoundationDate = (value: string) => {
  const match = value?.match(/^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?$/);
  if (!match) {
    return value ?? "";
  }
  const [, year, month, day] = match;
  return day
    ? `${year}年${Number(month)}月${Number(day)}日`
    : `${year}年${Number(month)}月`;
};

const toAbsoluteImageUrl = (src: string) =>
  src.startsWith("http") ? src : `${PRTIMES_ORIGIN}${src.startsWith("/") ? "" : "/"}${src}`;

/** body(HTML)から画像URLを抜き出す。ギャラリー表示に使う */
const extractBodyImages = (body: string): string[] => {
  const urls = new Set<string>();
  for (const match of body.matchAll(/<img[^>]+src="([^"]+)"/g)) {
    urls.add(toAbsoluteImageUrl(decodeEntities(match[1])));
  }
  return [...urls];
};

/** body(HTML)を、記事本文コンポーネントが期待する改行区切りのプレーンテキストに変換する */
const htmlToPlainText = (body: string): string =>
  decodeEntities(
    body
      .replace(/<figure[\s\S]*?<\/figure>/g, "")
      .replace(/<script[\s\S]*?<\/script>/g, "")
      .replace(/<style[\s\S]*?<\/style>/g, "")
      .replace(/<br\s*\/?>/g, "\n")
      .replace(/<\/(p|div|h[1-6]|li|tr)>/g, "\n\n")
      .replace(/<[^>]+>/g, "")
  )
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

export const getCompany = async (companyId: number): Promise<DbCompany | null> => {
  const row = await db
    .selectFrom("company")
    .leftJoin("industry", "industry.industry_id", "company.industry_id")
    .select([
      "company.company_id",
      "company.company_name",
      "company.president_name",
      "company.address",
      "company.phone",
      "company.description",
      "company.capital",
      "company.foundation_date",
      "company.url",
      "company.industry_id",
      "industry.industry_name",
    ])
    .where("company.company_id", "=", companyId)
    .executeTakeFirst();

  if (!row) {
    return null;
  }

  return {
    companyId: row.company_id,
    name: row.company_name,
    president: row.president_name,
    address: row.address,
    phone: row.phone,
    description: row.description,
    capital: row.capital,
    foundationDate: formatFoundationDate(row.foundation_date),
    url: row.url,
    industryId: row.industry_id,
    industryName: row.industry_name,
  };
};

export const listCompanyReleases = async (companyId: number): Promise<DbRelease[]> => {
  const rows = await db
    .selectFrom("release")
    .leftJoin("release_statistic", (join) =>
      join
        .onRef("release_statistic.company_id", "=", "release.company_id")
        .onRef("release_statistic.release_id", "=", "release.release_id")
    )
    .select([
      "release.release_id",
      "release.company_id",
      "release.title",
      "release.subtitle",
      "release.main_image",
      "release.created_at",
      "release_statistic.page_view",
      "release_statistic.like_count",
    ])
    .where("release.company_id", "=", companyId)
    .orderBy("release.created_at", "desc")
    .execute();

  if (rows.length === 0) {
    return [];
  }

  const keywordRows = await db
    .selectFrom("release_keyword")
    .innerJoin("keyword", "keyword.keyword_id", "release_keyword.keyword_id")
    .select([
      "release_keyword.release_id",
      "keyword.keyword_name",
      "release_keyword.sort_priority",
    ])
    .where("release_keyword.company_id", "=", companyId)
    .orderBy("release_keyword.sort_priority", "asc")
    .execute();

  const keywordsByRelease = new Map<number, string[]>();
  keywordRows.forEach((row) => {
    const list = keywordsByRelease.get(row.release_id) ?? [];
    list.push(row.keyword_name);
    keywordsByRelease.set(row.release_id, list);
  });

  return rows.map((row) => ({
    releaseId: row.release_id,
    companyId: row.company_id,
    title: row.title,
    subtitle: row.subtitle,
    mainImage: row.main_image,
    createdAt: row.created_at,
    keywords: keywordsByRelease.get(row.release_id) ?? [],
    pageView: row.page_view ?? 0,
    likeCount: row.like_count ?? 0,
  }));
};

/** 記事詳細ページで使う id 表記。例: company_id=163727 / release_id=9 -> "pr-163727-9" */
export const toReleaseSlug = (companyId: number, releaseId: number) =>
  `pr-${companyId}-${releaseId}`;

/** "pr-163727-9" や "9" から release_id を取り出す。DBの記事でなければ null */
export const parseReleaseSlug = (companyId: number, slug: string): number | null => {
  const match =
    slug.match(new RegExp(`^pr-${companyId}-(\\d+)$`)) ?? slug.match(/^(\d+)$/);
  return match ? Number(match[1]) : null;
};

/**
 * RDS の release から1件取得し、記事表示コンポーネントが期待する PressRelease に変換する。
 * body(HTML) は本文テキストと画像ギャラリーに分解する。
 */
export const getCompanyReleaseAsPressRelease = async (
  companyId: number,
  releaseId: number
): Promise<PressRelease | null> => {
  const [company, row] = await Promise.all([
    getCompany(companyId),
    db
      .selectFrom("release")
      .leftJoin("release_statistic", (join) =>
        join
          .onRef("release_statistic.company_id", "=", "release.company_id")
          .onRef("release_statistic.release_id", "=", "release.release_id")
      )
      .select([
        "release.release_id",
        "release.company_id",
        "release.title",
        "release.subtitle",
        "release.lead_paragraph",
        "release.body",
        "release.main_image",
        "release.created_at",
        "release_statistic.page_view",
        "release_statistic.like_count",
      ])
      .where("release.company_id", "=", companyId)
      .where("release.release_id", "=", releaseId)
      .executeTakeFirst(),
  ]);

  if (!row) {
    return null;
  }

  const keywordRows = await db
    .selectFrom("release_keyword")
    .innerJoin("keyword", "keyword.keyword_id", "release_keyword.keyword_id")
    .select("keyword.keyword_name")
    .where("release_keyword.company_id", "=", companyId)
    .where("release_keyword.release_id", "=", releaseId)
    .orderBy("release_keyword.sort_priority", "asc")
    .execute();

  const body = row.body ?? "";
  const bodyImages = extractBodyImages(body);
  const lead = row.lead_paragraph ? htmlToPlainText(row.lead_paragraph) : "";
  const content = [lead, htmlToPlainText(body)].filter(Boolean).join("\n\n");

  return {
    id: toReleaseSlug(companyId, releaseId),
    title: row.title,
    subtitle: row.subtitle ?? undefined,
    companyId: String(companyId),
    company: company?.name ?? "",
    category: company?.industryName ?? "ビジネス",
    timestamp: row.created_at.toLocaleDateString("ja-JP"),
    publishedAt: new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(row.created_at),
    imageUrl: row.main_image ? toAbsoluteImageUrl(row.main_image) : (bodyImages[0] ?? ""),
    secondaryImages: bodyImages.slice(0, 6),
    pvCount: row.page_view ?? 0,
    likesCount: row.like_count ?? 0,
    keywords: keywordRows.map((k) => k.keyword_name),
    content,
    companyProfile: company
      ? {
          name: company.name,
          representative: company.president || "-",
          address: company.address || "-",
          established: company.foundationDate || "-",
          capital: company.capital > 0 ? `${company.capital.toLocaleString()}万円` : "-",
          business: company.description || "-",
          website: company.url || "",
        }
      : undefined,
  };
};
