import { Kysely, PostgresDialect, sql } from "kysely";
import { Pool } from "pg";

export type JsonValue = null | boolean | number | string | JsonValue[] | { [key: string]: JsonValue };

export interface PressReleasesTable {
  id: string;
  title: string;
  company: string;
  category: string;
  published_at: string;
  payload: JsonValue;
  created_at: Date;
  updated_at: Date;
}

/**
 * 以下は RDS に元々入っている PR TIMES のデータセット。
 * アプリ側で CREATE することはないので ensure*Table は用意しない（読み取り専用）。
 */
export interface CompanyTable {
  company_id: number;
  company_name: string;
  president_name: string;
  address: string;
  phone: string;
  description: string;
  industry_id: number;
  ipo_type_id: number;
  capital: number;
  foundation_date: string;
  url: string;
  twitter_screen_name: string;
}

export interface ReleaseTable {
  company_id: number;
  release_id: number;
  title: string;
  subtitle: string | null;
  lead_paragraph: string | null;
  body: string | null;
  main_image: string | null;
  main_image_fastly: string | null;
  youtube_url: string | null;
  release_type_id: number;
  created_at: Date;
}

export interface ReleaseKeywordTable {
  company_id: number;
  release_id: number;
  keyword_id: number;
  sort_priority: number;
}

export interface KeywordTable {
  keyword_id: number;
  keyword_name: string;
}

export interface ReleaseStatisticTable {
  company_id: number;
  release_id: number;
  page_view: number;
  unique_user: number;
  like_count: number;
}

export interface IndustryTable {
  industry_id: number;
  industry_name: string;
}

export interface Database {
  press_releases: PressReleasesTable;
  company: CompanyTable;
  release: ReleaseTable;
  release_keyword: ReleaseKeywordTable;
  keyword: KeywordTable;
  release_statistic: ReleaseStatisticTable;
  industry: IndustryTable;
}

const buildConnectionString = () => {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  const host = process.env.DB_HOST;
  const port = process.env.DB_PORT ?? "5432";
  const name = process.env.DB_NAME;
  const user = process.env.DB_USER;
  const password = process.env.DB_PASSWORD;

  if (!host || !name || !user || !password) {
    throw new Error("DB connection env is missing. Set DATABASE_URL or DB_HOST/DB_NAME/DB_USER/DB_PASSWORD.");
  }

  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${name}`;
};

const globalForDb = globalThis as unknown as {
  db?: Kysely<Database>;
};

export const db =
  globalForDb.db ??
  new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: buildConnectionString(),
        connectionTimeoutMillis: 3000,
        query_timeout: 5000,
        idleTimeoutMillis: 10000,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}

let schemaEnsured = false;
let schemaEnsurePromise: Promise<void> | null = null;

type PgErrorLike = {
  code?: string;
  constraint?: string;
};

const isConcurrentCreateTypeRace = (error: unknown) => {
  const pgError = error as PgErrorLike;
  return (
    pgError?.code === "23505" &&
    pgError?.constraint === "pg_type_typname_nsp_index"
  );
};

const hasPressReleasesTable = async () => {
  const result = await sql<{ regclass_name: string | null }>`
    SELECT to_regclass('public.press_releases') AS regclass_name
  `.execute(db);

  return Boolean(result.rows[0]?.regclass_name);
};

export const logDbConnectionStatus = async (context: string) => {
  try {
    await sql`SELECT 1`.execute(db);
    console.info(
      `[DB] Connected (${context}) host=${process.env.DB_HOST ?? "from DATABASE_URL"} db=${process.env.DB_NAME ?? "from DATABASE_URL"}`
    );
    return true;
  } catch (error) {
    console.error(
      `[DB] Connection failed (${context}) host=${process.env.DB_HOST ?? "from DATABASE_URL"} db=${process.env.DB_NAME ?? "from DATABASE_URL"}`,
      error
    );
    return false;
  }
};

export const ensurePressReleasesTable = async () => {
  if (schemaEnsured) {
    return;
  }

  if (!schemaEnsurePromise) {
    schemaEnsurePromise = (async () => {
      try {
        await sql`
          CREATE TABLE IF NOT EXISTS press_releases (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            company TEXT NOT NULL,
            category TEXT NOT NULL,
            published_at TEXT NOT NULL,
            payload JSONB NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `.execute(db);

        schemaEnsured = true;
      } catch (error) {
        if (isConcurrentCreateTypeRace(error) && (await hasPressReleasesTable())) {
          console.warn(
            "[DB] Ignored concurrent table creation race for press_releases"
          );
          schemaEnsured = true;
          return;
        }

        throw error;
      } finally {
        schemaEnsurePromise = null;
      }
    })();
  }

  await schemaEnsurePromise;
};
