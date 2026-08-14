import { sql } from "kysely";
import { db, logDbConnectionStatus } from "@/lib/db";
import { clampDbReadLimit, MAX_DB_READ_ROWS } from "@/lib/dbLimits";

export interface CompanyNameRow {
  company_id: number;
  company_name: string;
}

export const listCompanyNames = async (limit = MAX_DB_READ_ROWS) => {
  const connected = await logDbConnectionStatus("GET /company-names");
  if (!connected) {
    return {
      dbConnected: false,
      companies: [] as CompanyNameRow[],
    };
  }

  const result = await sql<CompanyNameRow>`
    SELECT company_id, company_name
    FROM public.company
    ORDER BY company_id ASC
    LIMIT ${clampDbReadLimit(limit)}
  `.execute(db);

  return {
    dbConnected: true,
    companies: result.rows,
  };
};
