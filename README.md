# Vault

この vault は、学習メモと daily seed を管理するためのものです。

## Root に置くもの

- `vault.base`
  学習メモの一覧。
- `seed.base`
  daily seed ノートの一覧。
- `seed-categories.md`
  daily seed のカテゴリ選択ファイル。
- `daily-seed-automation.md`
  Codex app Automation に貼る prompt。
- `memo.md`
  単発メモ。
- `vault/`
  学習メモ本体。
- `seeds/`
  daily seed で生成されたノート。
- `templates/`
  よく使うテンプレート。
- `improvements/`
  daily seed 改善案を残す場所。

## Daily Seed の考え方

daily seed はニュース要約ではなく、未知の概念を知るための入口ノートです。

- 1 回の実行で 3 ファイル生成する
- 各ファイルは 1 問 1 ノート
- 質問は固定リストから選ばず、その日のカテゴリから生成する
- 内容は日本語
- 3 分くらいで読める
- 初学者が「まずこう理解すればいい」と掴めることを優先する
- 重複回避は `.codex/daily-seed-history.json` で行う

## Daily Seed の流れ

1. `seed-categories.md` で使いたいカテゴリを有効にする。
2. Automation が有効カテゴリと履歴を見て、3 つの質問を生成する。
3. 内容が分かる日本語ファイル名で `seeds/` に 3 ファイル作る。
4. 使った質問を `.codex/daily-seed-history.json` に追加する。
5. `seed.base` で一覧する。
6. 必要なら Automation 改善 PR または改善メモ PR を別で作る。
