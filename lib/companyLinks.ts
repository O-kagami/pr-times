/**
 * 企業ページ・管理画面を用意している企業の一覧。
 * - "163727"（杉村精工）: RDS を正とするページ
 * - "seseragi"（医療法人せせらぎ）: data/pressReleases.ts のデモ用ページ
 * それ以外の企業はページの中身が揃っていないのでリンクにしない。
 *
 * ヘッダーの「管理画面」メニューもここを参照する。企業が増えたらここに足す。
 */
export const ADMIN_COMPANIES = [
  { id: "seseragi", name: "医療法人せせらぎ" },
  { id: "163727", name: "杉村精工株式会社" },
] as const;

const LINKABLE_COMPANY_IDS = new Set<string>(
  ADMIN_COMPANIES.map((company) => company.id)
);

export const getCompanyHref = (companyId: string): string | null =>
  LINKABLE_COMPANY_IDS.has(companyId) ? `/companies/${companyId}` : null;

export const getCompanyAdminHref = (companyId: string): string =>
  `/admin/companies/${companyId}`;
