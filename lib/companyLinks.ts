/**
 * 企業ページを用意している企業だけを、企業名からのリンク対象にする。
 * - "163727"（杉村精工）: RDS を正とするページ
 * - "seseragi"（医療法人せせらぎ）: data/pressReleases.ts のデモ用ページ
 * それ以外の企業はページの中身が揃っていないのでリンクにしない。
 */
const LINKABLE_COMPANY_IDS = new Set(["163727", "seseragi"]);

export const getCompanyHref = (companyId: string): string | null =>
  LINKABLE_COMPANY_IDS.has(companyId) ? `/companies/${companyId}` : null;
