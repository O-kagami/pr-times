import { db } from "@/lib/db";

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
    foundationDate: row.foundation_date,
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
