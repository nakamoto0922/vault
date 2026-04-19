# Daily Seed Internals

このディレクトリは daily seed の裏方だけをまとめる場所です。
普段触るのは root 側の `seed-categories.md`、`seed.base`、`daily-seed-automation.md`、`seeds/` です。

## 構成

- `package.json`
  seed generator の依存定義。
- `scripts/generate-seed.mjs`
  feed を取得して `seeds/seed-YYYYMMDD.md` を生成する。
- `data/seed-history.json`
  既に使った feed entry の ID を保持する。

## ローカル実行

```bash
npm --prefix automation/seed ci
node automation/seed/scripts/generate-seed.mjs --categories seed-categories.md --output-dir seeds --history-file automation/seed/data/seed-history.json --count 3 --seed-date 2026-04-19 --branch-name seed-20260419
```

`--dry-run` を付けるとファイルを書かずに標準出力へ表示します。

## Codex app Automation

1. Codex app でこの repository を開く。
2. 新しい Automation を作る。
3. スケジュールは毎日、タイムゾーンは `Asia/Tokyo` にする。
4. prompt には root の `daily-seed-automation.md` を使う。
5. skill に `daily-seed` を追加する。
