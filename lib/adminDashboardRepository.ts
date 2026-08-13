import { db } from "@/lib/db";

/**
 * 管理画面ダッシュボード用の読み取りクエリ。
 * 「似た企業のサジェスト」と「近しい企業のリリースカレンダー」で使う。
 *
 * 似ている＝同じ業種（company.industry_id）かつ同じ都道府県。
 * company テーブルに都道府県のカラムは無いので address の前方一致で絞る。
 */

const PRTIMES_ORIGIN = "https://prtimes.jp";

/** company.address は "静岡県焼津市中新田1600" のような文字列。都道府県だけを取り出す */
export const extractPrefecture = (address: string | null | undefined): string | null => {
  const match = address?.match(/^(東京都|北海道|(?:京都|大阪)府|.{2,3}県)/);
  return match ? match[1] : null;
};

export const toAbsoluteImageUrl = (src: string | null | undefined): string | null => {
  if (!src) {
    return null;
  }
  return src.startsWith("http")
    ? src
    : `${PRTIMES_ORIGIN}${src.startsWith("/") ? "" : "/"}${src}`;
};

export interface PeerCompany {
  companyId: number;
  companyName: string;
  industryName: string | null;
  prefecture: string | null;
  latestReleaseId: number;
  latestTitle: string;
  latestImage: string | null;
  latestAt: Date;
}

export interface PeerRelease {
  companyId: number;
  releaseId: number;
  companyName: string;
  title: string;
  image: string | null;
  createdAt: Date;
}

interface PeerQuery {
  industryId: number;
  prefecture: string | null;
  excludeCompanyId: number | null;
  since: Date;
  limit: number;
}

/** 都道府県まで一致で絞れたのか、全国に広げたのか */
export type PeerScope = "prefecture" | "nationwide";

/**
 * 同業・同一都道府県の企業を、直近で発信のあった順に返す。
 * 都道府県まで絞ると候補が少なすぎる場合は、全国の同業に広げて引き直す。
 */
export const listPeerCompanies = async ({
  industryId,
  prefecture,
  excludeCompanyId,
  since,
  limit,
}: PeerQuery): Promise<{ scope: PeerScope; peers: PeerCompany[] }> => {
  const fetchPeers = async (withPrefecture: boolean) => {
    let query = db
      .selectFrom("release")
      .innerJoin("company", "company.company_id", "release.company_id")
      .leftJoin("industry", "industry.industry_id", "company.industry_id")
      .select([
        "release.company_id",
        "release.release_id",
        "release.title",
        "release.main_image",
        "release.created_at",
        "company.company_name",
        "company.address",
        "industry.industry_name",
      ])
      .distinctOn("release.company_id")
      .where("release.created_at", ">=", since)
      .where("company.industry_id", "=", industryId)
      .orderBy("release.company_id")
      .orderBy("release.created_at", "desc");

    if (withPrefecture && prefecture) {
      query = query.where("company.address", "like", `${prefecture}%`);
    }

    if (excludeCompanyId !== null) {
      query = query.where("company.company_id", "!=", excludeCompanyId);
    }

    return query.execute();
  };

  let scope: PeerScope = prefecture ? "prefecture" : "nationwide";
  let rows = await fetchPeers(scope === "prefecture");

  // 同じ都道府県だけだとカードが埋まらないことがあるので、その時は全国に広げる
  if (rows.length < 4 && scope === "prefecture") {
    scope = "nationwide";
    rows = await fetchPeers(false);
  }

  return {
    scope,
    peers: rows
      .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
      .slice(0, limit)
      .map((row) => ({
        companyId: row.company_id,
        companyName: row.company_name,
        industryName: row.industry_name,
        prefecture: extractPrefecture(row.address),
        latestReleaseId: row.release_id,
        latestTitle: row.title,
        latestImage: toAbsoluteImageUrl(row.main_image),
        latestAt: row.created_at,
      })),
  };
};

/** カレンダーに並べる、近しい企業の直近リリース */
export const listPeerReleases = async ({
  industryId,
  prefecture,
  excludeCompanyId,
  since,
  limit,
}: PeerQuery): Promise<PeerRelease[]> => {
  let query = db
    .selectFrom("release")
    .innerJoin("company", "company.company_id", "release.company_id")
    .select([
      "release.company_id",
      "release.release_id",
      "release.title",
      "release.main_image",
      "release.created_at",
      "company.company_name",
    ])
    .where("release.created_at", ">=", since)
    .where("company.industry_id", "=", industryId)
    .orderBy("release.created_at", "desc")
    .limit(limit);

  if (prefecture) {
    query = query.where("company.address", "like", `${prefecture}%`);
  }

  if (excludeCompanyId !== null) {
    query = query.where("company.company_id", "!=", excludeCompanyId);
  }

  const rows = await query.execute();

  return rows.map((row) => ({
    companyId: row.company_id,
    releaseId: row.release_id,
    companyName: row.company_name,
    title: row.title,
    image: toAbsoluteImageUrl(row.main_image),
    createdAt: row.created_at,
  }));
};
