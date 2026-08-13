<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# 開発ルール

- 新機能や修正に着手する際は、必ず `master` ブランチから新しいブランチを作成すること。`master` へ直接コミットしないこと。
- 作業が完了したら、`master` へマージするためのプルリクエストを作成すること。
- 動作確認用のUI（DBの中身を覗くリンクなど、本番で見せる必要がないもの）は `process.env.NODE_ENV !== "production"` で囲み、本番ビルドでは表示されないようにすること。
- DBへの手動テスト投入で作ったデータは、`master` にマージする前に削除すること（詳細は [docs/db-guide.md](docs/db-guide.md) 参照）。
