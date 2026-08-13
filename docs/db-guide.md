# DBの読み書き・テーブル追加ガイド

RDS(PostgreSQL)へのアクセス方法をチームで揃えるためのガイド。`press_releases`の実装を「型」として、新しいテーブルもこの構成に合わせる。

## 全体の流れ

```
ブラウザ / フロント
   ↓ fetch
app/api/<resource>/route.ts   … HTTPの入り口（Route Handler）
   ↓ 関数呼び出し
lib/<resource>Repository.ts   … SQLを組み立てて実行する層
   ↓
lib/db.ts                     … DB接続そのもの（Kysely + pg）
   ↓
RDS (PostgreSQL)
```

- **`pg`**: Node.jsから PostgreSQL に接続するための低レベルなドライバ。生SQLの文字列を投げて結果を受け取るだけの、いわば「土台」。
- **`kysely`**: `pg`の上に乗る、型安全なSQLビルダー。`db.selectFrom("press_releases").select(["title"])`のように書くと、テーブル名やカラム名をTypeScriptの型でチェックしてくれる。ORMほど重くなく、書いたコードがほぼそのままSQLになるので生SQLに近い感覚で使える。
- 接続情報は環境変数`DATABASE_URL`から読む（[lib/db.ts](../lib/db.ts)の`buildConnectionString`）。実体は`.env.local`（git管理外）、雛形は[.env.example.local](../.env.example.local)。

## 新しいテーブルを追加する手順

`hoge`テーブルを例にする。

### 1. テーブルの型を `lib/db.ts` に追加する

```ts
// lib/db.ts
export interface HogeTable {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface Database {
  press_releases: PressReleasesTable;
  hoge: HogeTable; // 追加
}
```

### 2. テーブル作成処理を追加する

今のところ専用のマイグレーションツールは導入していないので、`press_releases`と同様に「アプリ起動時に`CREATE TABLE IF NOT EXISTS`を実行する」簡易的なやり方で揃える（[lib/db.ts](../lib/db.ts)の`ensurePressReleasesTable`が実例）。

```ts
// lib/db.ts
export const ensureHogeTable = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS hoge (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `.execute(db);
};
```

> テーブルが増えてきたら、この場当たり的なやり方から `node-pg-migrate` などのマイグレーションツールへの移行を検討する。

### 3. リポジトリ層を作る（`lib/hogeRepository.ts`）

読み書きのSQLをここに集約する。ルート（API）側はSQLを直接書かない。

```ts
// lib/hogeRepository.ts
import { db, ensureHogeTable } from "@/lib/db";

export const listHoge = async () => {
  await ensureHogeTable();
  return db.selectFrom("hoge").selectAll().orderBy("updated_at", "desc").execute();
};

export const createHoge = async (input: { id: string; name: string }) => {
  await ensureHogeTable();
  await db
    .insertInto("hoge")
    .values({ ...input, created_at: new Date(), updated_at: new Date() })
    .execute();
};
```

### 4. Route Handlerを作る（`app/api/hoge/route.ts`）

Next.jsの慣習どおり、`app/api/<resource>/route.ts`にHTTPメソッド名(`GET`/`POST`など)をexportする。DBアクセス系のRoute Handlerには`export const runtime = "nodejs"`と`export const dynamic = "force-dynamic"`を付ける（`press-releases`の実装と同様。DBアクセスはEdge runtimeでは動かせないため、また常に最新データを取りたいためキャッシュを無効化する）。

```ts
// app/api/hoge/route.ts
import { NextResponse } from "next/server";
import { listHoge, createHoge } from "@/lib/hogeRepository";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const data = await listHoge();
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const body = await request.json();
  await createHoge(body);
  return NextResponse.json({ ok: true }, { status: 201 });
}
```

フロント側からは通常のfetchで叩く。

```ts
const res = await fetch("/api/hoge");
const { data } = await res.json();
```

## テスト投入したデータの後始末

管理画面の新規作成フォームなどをテストすると、そのままRDSの`press_releases`テーブルに本番データとして残る（テスト用のstaging環境やDBリセットの仕組みはまだ無いため）。

- ローカルやEC2上での動作確認で作った記事（例: タイトルが`aaaa`のような明らかなテストデータ）は、**masterにマージする前に本人が削除する**こと。
- 削除は`psql`または[lib/db.ts](../lib/db.ts)の接続情報を使ったスクリプトで、対象の`id`を指定して行う。
- `psql`は`DATABASE_URL`（`.env.local`参照）をそのまま渡すだけで接続できる。

```
psql "$DATABASE_URL"
```

```sql
DELETE FROM press_releases WHERE id IN ('pr-xxxx', 'pr-yyyy');
```

- どの`id`を消せばいいか分からない場合は、`created_at`の新しい順に見て判断する。

```sql
SELECT id, title, company, created_at FROM press_releases ORDER BY created_at DESC LIMIT 20;
```

## 参考実装

- 接続設定: [lib/db.ts](../lib/db.ts)
- リポジトリ層: [lib/pressReleasesRepository.ts](../lib/pressReleasesRepository.ts)
- Route Handler: [app/api/press-releases/route.ts](../app/api/press-releases/route.ts)
