# Daily Seed Automation Prompt

この repository では `daily-seed` skill を使ってください。

Asia/Tokyo の当日分として、この vault 用の daily seed ノートを 3 件生成してください。

## メインタスク

ファイルを読むときは UTF-8 を明示してください。特に PowerShell では `Get-Content <path> -Encoding UTF8` を使い、文字化けした表示をもとに判断しないでください。

1. `seed-categories.md` を読む。
2. `Enabled Categories` でチェックされているカテゴリだけを使う。
3. `.codex/daily-seed-history.json` を読む。
4. 有効カテゴリをもとに、初学者向けの質問を 3 つ生成する。
5. `.codex/daily-seed-history.json` に記録済みの質問と重複、または実質的に同じ質問は避ける。
6. 可能なら質問の切り口が偏らないようにする。
   - 定義
   - 比較
   - 使いどころ
   - 誤解整理
   - メンタルモデル
7. ノート本文はすべて日本語で書く。
8. 各ノートは 3 分程度で読めて、初学者が最初の理解の足場を作れる内容にする。

## ファイル名

生成する 3 つの Markdown ファイルは `seeds/` 配下に置き、内容がひと目で分かる日本語ファイル名にしてください。

形式:

- `内容を表す短い日本語_YYYY-MM-DD.md`

ルール:

- 内容がひと目で分かることを優先する。
- トピック名だけでなく、できれば「何を理解できるノートか」が伝わる名前にする。
- 日付は末尾に置く。
- Windows で使えない文字は避ける。
  - `?` `:` `*` `/` `\\` `<` `>` `|` は使わない
- 長すぎる場合は意味を保ったまま短くする。

例:

- `GCPの基本をつかむ_2026-04-19.md`
- `Cloud RunとCompute Engineの違い_2026-04-19.md`
- `TypeScriptのunknownとanyの違い_2026-04-19.md`

## Git フロー

worktree 実行を前提に、`main` へ切り替えないでください。別 worktree で `main` が checkout 済みの場合、`git switch main` や `git checkout main` は失敗することがあります。

seed 用ブランチを作る、または更新する前に、必ず次を行うこと:

1. `git fetch origin main` を実行して `origin/main` を最新化する。
2. `seed-YYYYMMDD` ブランチが local にある場合は、そのブランチへ切り替えて使う。
3. local にないが `origin/seed-YYYYMMDD` がある場合は、`origin/seed-YYYYMMDD` から local ブランチを作って使う。
4. local にも remote にもない場合は、最新の `origin/main` から `seed-YYYYMMDD` ブランチを作る。
5. 既存ブランチを更新する場合は、必要に応じて `origin/main` を取り込む。ただし未コミット変更や生成済みファイルを失わないこと。

その後の流れ:

1. 3 件のノートを生成する。
2. 採用した 3 つの質問を `.codex/daily-seed-history.json` に追記する。
3. commit 対象は次だけにする。
   - 生成した 3 件のノート
   - `.codex/daily-seed-history.json`
4. `Seed YYYY-MM-DD` というタイトルで PR を作る、または更新する。

当日分のノートや PR がすでに存在する場合は、新しく増やさず同じブランチと PR を更新してください。

## 実行後の振り返り

メインタスク完了後に、今回の実行を振り返ってください。

### A. Automation Prompt 自体の改善

`daily-seed-automation.md` にすぐ反映すべき具体的な改善がある場合:

1. `git fetch origin main` を実行する。
2. 最新の `origin/main` を基準に別ブランチを作る。
   - `improve-daily-seed-automation-YYYYMMDD`
3. `daily-seed-automation.md` だけを更新する。
4. そのファイルだけを commit する。
5. 次のタイトルで別 PR を作る。
   - `Improve daily seed automation YYYY-MM-DD`

改善が具体的で、今すぐ直す価値がある場合だけ実行してください。

### B. その他の改善案

すぐに適用しないが、残しておく価値のある改善案がある場合:

1. `improvements/daily-seed-YYYYMMDD.md` を作る。
2. 観察したこと、問題点、改善案を具体的に書く。
3. `git fetch origin main` を実行する。
4. 最新の `origin/main` を基準に別ブランチを作る。
   - `propose-daily-seed-improvements-YYYYMMDD`
5. 改善メモだけを commit する。
6. 次のタイトルで別 PR を作る。
   - `Propose daily seed improvements YYYY-MM-DD`

意味のある提案が 1 件以上ある場合だけ、この PR を作ってください。
