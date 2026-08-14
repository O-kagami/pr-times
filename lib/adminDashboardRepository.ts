import { db } from "@/lib/db";
import { clampDbReadLimit, MAX_DB_READ_ROWS } from "@/lib/dbLimits";

/**
 * 管理画面ダッシュボード用の読み取りクエリ。
 * 「似た企業のサジェスト」と「近しい企業のリリースカレンダー」で使う。
 *
 * 同じ業種（company.industry_id）を候補とし、都道府県・発信キーワード・
 * 資本金・上場区分・設立時期・新しさを使って近さを比べる。
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
  similarityReasons: string[];
  topics: string[];
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
  targetKeywords?: string[];
  companyIds?: number[];
}

/** 都道府県まで一致で絞れたのか、全国に広げたのか */
export type PeerScope = "prefecture" | "nationwide";

const parseFoundationYear = (value: string | null | undefined): number | null => {
  const year = Number(value?.match(/^(\d{4})/)?.[1]);
  return Number.isFinite(year) && year > 0 ? year : null;
};

/** 資本金は桁の近さを見る。100倍以上離れていれば類似度を0にする。 */
const capitalSimilarity = (left: number, right: number) => {
  if (left <= 0 || right <= 0) {
    return 0;
  }
  return Math.max(0, 1 - Math.abs(Math.log10(left) - Math.log10(right)) / 2);
};

/**
 * 同業・同一都道府県の企業を、RDS内の企業属性と発信内容が近い順に返す。
 * 都道府県まで絞ると候補が少なすぎる場合は、全国の同業に広げて引き直す。
 */
export const listPeerCompanies = async ({
  industryId,
  prefecture,
  excludeCompanyId,
  since,
  limit,
  targetKeywords = [],
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
        "company.capital",
        "company.ipo_type_id",
        "company.foundation_date",
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

    return query.limit(MAX_DB_READ_ROWS).execute();
  };

  let scope: PeerScope = prefecture ? "prefecture" : "nationwide";
  let rows = await fetchPeers(scope === "prefecture");

  // 同じ都道府県だけだとカードが埋まらないことがあるので、その時は全国に広げる
  if (rows.length < 4 && scope === "prefecture") {
    scope = "nationwide";
    rows = await fetchPeers(false);
  }

  // まず発信の新しい企業に候補を絞り、その中で企業属性と発信内容を比較する。
  // 各社の最新リリースだけを読むため、表示件数に応じて候補数にも上限を設ける。
  const candidates = rows
    .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
    .slice(0, Math.max(24, limit * 4));

  if (candidates.length === 0) {
    return { scope, peers: [] };
  }

  const targetCompanyPromise =
    excludeCompanyId === null
      ? Promise.resolve(null)
      : db
          .selectFrom("company")
          .select(["capital", "ipo_type_id", "foundation_date"])
          .where("company_id", "=", excludeCompanyId)
          .executeTakeFirst();

  const [targetCompany, keywordRows] = await Promise.all([
    targetCompanyPromise,
    db
      .selectFrom("release_keyword")
      .innerJoin("keyword", "keyword.keyword_id", "release_keyword.keyword_id")
      .select(["release_keyword.company_id", "keyword.keyword_name"])
      .where((eb) =>
        eb.or(
          candidates.map((candidate) =>
            eb.and([
              eb("release_keyword.company_id", "=", candidate.company_id),
              eb("release_keyword.release_id", "=", candidate.release_id),
            ])
          )
        )
      )
      .limit(MAX_DB_READ_ROWS)
      .execute(),
  ]);

  const keywordCounts = new Map<number, Map<string, number>>();
  keywordRows.forEach((row) => {
    const keyword = row.keyword_name.trim();
    if (!keyword) {
      return;
    }
    const companyKeywords = keywordCounts.get(row.company_id) ?? new Map<string, number>();
    companyKeywords.set(keyword, (companyKeywords.get(keyword) ?? 0) + 1);
    keywordCounts.set(row.company_id, companyKeywords);
  });

  const normalizedTargetKeywords = new Set(
    targetKeywords.map((keyword) => keyword.trim()).filter(Boolean)
  );
  const targetFoundationYear = parseFoundationYear(targetCompany?.foundation_date);
  const rankingAt = new Date();
  const windowMs = Math.max(1, rankingAt.getTime() - since.getTime());

  const scoredPeers = candidates.map((row) => {
    const peerPrefecture = extractPrefecture(row.address);
    const peerKeywordCounts = keywordCounts.get(row.company_id) ?? new Map<string, number>();
    const peerKeywords = new Set(peerKeywordCounts.keys());
    const commonKeywords = [...normalizedTargetKeywords]
      .filter((keyword) => peerKeywords.has(keyword))
      .sort(
        (left, right) =>
          (peerKeywordCounts.get(right) ?? 0) - (peerKeywordCounts.get(left) ?? 0)
      );
    const topics = [...peerKeywordCounts.entries()]
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0], "ja"))
      .slice(0, 3)
      .map(([keyword]) => keyword);

    let weightedScore = 0;
    let availableWeight = 0;
    const addSignal = (weight: number, similarity: number) => {
      weightedScore += weight * Math.max(0, Math.min(1, similarity));
      availableWeight += weight;
    };

    const reasons: string[] = [
      `同じ${row.industry_name ?? "業種"}`,
    ];

    if (normalizedTargetKeywords.size > 0) {
      const unionSize = new Set([...normalizedTargetKeywords, ...peerKeywords]).size;
      addSignal(50, unionSize > 0 ? commonKeywords.length / unionSize : 0);
      if (commonKeywords.length > 0) {
        reasons.push(`「${commonKeywords.slice(0, 2).join("・")}」の発信が共通`);
      }
    }

    if (prefecture) {
      const samePrefecture = peerPrefecture === prefecture;
      addSignal(15, samePrefecture ? 1 : 0);
      if (samePrefecture) {
        reasons.push(`同じ${prefecture}`);
      }
    }

    if (targetCompany && targetCompany.capital > 0 && row.capital > 0) {
      const similarity = capitalSimilarity(targetCompany.capital, row.capital);
      addSignal(15, similarity);
      if (similarity >= 0.65) {
        reasons.push("企業規模が近い");
      }
    }

    if (targetCompany) {
      const sameIpoType = targetCompany.ipo_type_id === row.ipo_type_id;
      addSignal(10, sameIpoType ? 1 : 0);
      if (sameIpoType) {
        reasons.push("上場区分が同じ");
      }
    }

    const peerFoundationYear = parseFoundationYear(row.foundation_date);
    if (targetFoundationYear !== null && peerFoundationYear !== null) {
      const similarity = Math.max(
        0,
        1 - Math.abs(targetFoundationYear - peerFoundationYear) / 30
      );
      addSignal(5, similarity);
    }

    const releaseAgeMs = Math.max(0, rankingAt.getTime() - row.created_at.getTime());
    addSignal(5, 1 - releaseAgeMs / windowMs);

    return {
      score: availableWeight > 0 ? weightedScore / availableWeight : 0,
      peer: {
        companyId: row.company_id,
        companyName: row.company_name,
        industryName: row.industry_name,
        prefecture: peerPrefecture,
        latestReleaseId: row.release_id,
        latestTitle: row.title,
        latestImage: toAbsoluteImageUrl(row.main_image),
        latestAt: row.created_at,
        similarityReasons: reasons.slice(0, 3),
        topics,
      } satisfies PeerCompany,
    };
  });

  return {
    scope,
    peers: scoredPeers
      .sort(
        (left, right) =>
          right.score - left.score ||
          right.peer.latestAt.getTime() - left.peer.latestAt.getTime()
      )
      .slice(0, limit)
      .map(({ peer }) => peer),
  };
};

/** カレンダーに並べる、近しい企業の直近リリース */
export const listPeerReleases = async ({
  industryId,
  prefecture,
  excludeCompanyId,
  since,
  limit,
  companyIds,
}: PeerQuery): Promise<PeerRelease[]> => {
  if (companyIds?.length === 0) {
    return [];
  }

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
    .limit(clampDbReadLimit(limit));

  if (companyIds) {
    query = query.where("release.company_id", "in", companyIds);
  }

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
