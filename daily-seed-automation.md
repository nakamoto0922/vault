# Daily Seed Automation Prompt

このリポジトリの `daily-seed` skill を使ってください。

Asia/Tokyo の今日の日付を基準に、この vault 用の daily seed ノートを 3 件生成してください。

要件:

- `seed-categories.md` を読む。
- `Enabled Categories` でチェックされているカテゴリだけを使う。
- `.codex/daily-seed-history.json` を読む。
- 有効カテゴリから、初学者向けの質問を 3 つ生成する。
- 質問はニュース要約ではなく、概念理解の入口になるものにする。
- `.codex/daily-seed-history.json` に記録済みの質問と重複・類似しないようにする。
- 可能なら質問の切り口を分散させる。
  - definition
  - comparison
  - use-case
  - misconception
  - mental-model
- `seeds/` 配下に次の 3 ファイルを生成する。
  - `seed-YYYYMMDD-01.md`
  - `seed-YYYYMMDD-02.md`
  - `seed-YYYYMMDD-03.md`
- ノート本文はすべて日本語で書く。
- 各ノートは 3 分前後で読めて、初学者が最初のメンタルモデルを作れる内容にする。
- 生成後、選んだ 3 問を `.codex/daily-seed-history.json` に追記する。
- ブランチ `seed-YYYYMMDD` を作成または再利用する。
- コミット対象は次の 4 ファイルだけに限定する。
  - 3 件の生成ノート
  - `.codex/daily-seed-history.json`
- PR タイトルは `Seed YYYY-MM-DD` にする。
- 同日の PR がすでにある場合は新規作成せず、同じブランチと PR を更新する。
- 関係ないファイルは変更しない。
- 必要ファイルの更新に失敗した場合は、別パスや別ファイルで代替せず、失敗内容をそのまま報告する。

今日のノートがすでに存在する場合は、重複作成せず同じファイル・同じブランチ・同じ PR を更新してください。