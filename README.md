# Vault

この vault は、普段開くノート類を root に近い場所へ置き、生成や自動化の裏方は `automation/` に寄せる構成にしています。

## Root に置くもの

- `vault.base`
  学習メモの一覧。
- `seed.base`
  daily seed の一覧。
- `seed-categories.md`
  daily seed で使うカテゴリ選択ファイル。
- `daily-seed-automation.md`
  Codex app Automation に貼る prompt。
- `memo.md`
  単発メモ。
- `vault/`
  学習メモ本体。
- `seeds/`
  生成された daily seed ノート。
- `templates/`
  よく使うテンプレート。

## 裏方

- `automation/seed/`
  daily seed の script、依存、履歴、詳細ドキュメント。
- `.codex/skills/daily-seed/`
  Codex app Automation から使う skill。

## Daily Seed の流れ

1. `seed-categories.md` で使いたいカテゴリにチェックを入れる。
2. Codex app Automation が prompt と skill を使って seed を生成する。
3. `seeds/seed-YYYYMMDD.md` が作られる。
4. `seed.base` で一覧する。
