# Daily Seed Improvements 2026-04-25

## 観察したこと

`daily-seed` skill の Git 手順には `main` へ切り替えてから更新する流れが残っている。一方で、現在の `daily-seed-automation.md` は worktree 実行を前提にしており、`git switch main` や `git checkout main` を避けるよう明示している。

## 問題点

この不一致があると、skill の指示どおりに動いた実装は別 worktree で `main` が checkout 済みの環境で失敗しうる。自動化ごとに prompt だけ読んで回避できても、skill と prompt のどちらを優先するかが曖昧になり、再利用時の事故要因になる。

## 改善案

`daily-seed` skill の Git Rules と Reflection Rules を、`daily-seed-automation.md` と同じ worktree-safe な分岐手順に合わせる。

- `git fetch origin main` を先に実行する
- `seed-YYYYMMDD` は local / remote の存在を見て再利用する
- 新規作成時は `origin/main` から作る
- 改善用ブランチも `origin/main` 基準で作り、`main` への switch を要求しない

## なぜ今残す価値があるか

今回は prompt の指示で安全に実行できたが、skill 自体は今後も参照される。ここを揃えておくと、次回以降の daily seed 実行で Git フローの解釈ぶれを減らせる。
