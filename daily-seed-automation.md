# Daily Seed Automation Prompt

Use the `daily-seed` skill in this repository.

Today in Asia/Tokyo, generate the daily seed note for this vault.

Requirements:

- Read `seed-categories.md` and use only checked categories.
- Generate one `seeds/seed-YYYYMMDD.md` note with about 3 items that can be skimmed in around 3 minutes.
- Update `automation/seed/data/seed-history.json`.
- Create or reuse branch `seed-YYYYMMDD`.
- Commit only the generated seed note and history file.
- Open a PR titled `Seed YYYY-MM-DD`.

If the seed note for today already exists, update the existing branch and PR instead of creating duplicates.
