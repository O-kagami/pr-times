import { sql } from "kysely";
import { db, logDbConnectionStatus } from "@/lib/db";

export interface CompanyNameRow {
  company_id: number;
  company_name: string;
}

export const listCompanyNames = async (limit = 200) => {
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
    LIMIT ${limit}
  `.execute(db);

  return {
    dbConnected: true,
    companies: result.rows,
  };
};
