# Daily Seed Automation Prompt

Use the `daily-seed` skill in this repository.

Today in Asia/Tokyo, generate 3 daily seed notes for this vault.

Requirements:

- Read `seed-categories.md`.
- Use only categories checked in `Enabled Categories`.
- Read `.codex/daily-seed-history.json`.
- Generate 3 beginner-friendly questions from the enabled categories.
- The questions should help concept understanding, not summarize news.
- Avoid duplicates and near-duplicates of questions already recorded in `.codex/daily-seed-history.json`.
- Prefer a mix of question angles when possible:
  - definition
  - comparison
  - use-case
  - misconception
  - mental-model
- Generate 3 Markdown files under `seeds/` named:
  - `seed-YYYYMMDD-01.md`
  - `seed-YYYYMMDD-02.md`
  - `seed-YYYYMMDD-03.md`
- Write all note content in Japanese.
- Each note should be readable in about 3 minutes and help a beginner build an initial mental model.
- After generating the notes, append the 3 chosen questions to `.codex/daily-seed-history.json`.
- Create or reuse branch `seed-YYYYMMDD`.
- Commit only:
  - the 3 generated notes
  - `.codex/daily-seed-history.json`
- Open or update a PR titled `Seed YYYY-MM-DD`.

If notes for today already exist, update the same branch and PR instead of creating duplicates.
