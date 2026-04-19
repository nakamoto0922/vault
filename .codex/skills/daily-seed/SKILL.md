---
name: daily-seed
description: Generate a daily seed note from checked categories, create a seed-YYYYMMDD branch, and open a PR.
---

# Daily Seed Skill

Use this skill when you need to produce the daily learning-seed note for this vault.

## Goal

Generate `seeds/seed-YYYYMMDD.md` from `seed-categories.md`, update `automation/seed/data/seed-history.json`, then prepare a pull request on branch `seed-YYYYMMDD`.

## Steps

1. Read `seed-categories.md` and make sure at least one category is checked.
2. Install dependencies if they are missing:

```bash
npm --prefix automation/seed ci
```

3. Run:

```bash
node automation/seed/scripts/generate-seed.mjs --categories seed-categories.md --output-dir seeds --history-file automation/seed/data/seed-history.json --count 3 --seed-date YYYY-MM-DD --branch-name seed-YYYYMMDD
```

4. Review the generated file in `seeds/`.
5. Create or switch to branch `seed-YYYYMMDD`.
6. Commit only:
   - `seeds/seed-YYYYMMDD.md`
   - `automation/seed/data/seed-history.json`
7. Open a PR with title `Seed YYYY-MM-DD`.

## Notes

- The checked categories in `seed-categories.md` are the only eligible sources.
- The script tries to avoid repeating previous entries using `automation/seed/data/seed-history.json`.
- If the current branch already matches `seed-YYYYMMDD`, reuse it.
- Do not modify `seed.base` unless the schema needs to change.
