---
name: daily-seed
description: Generate 3 Japanese seed notes from enabled categories with history-based deduplication, then open or update a PR.
---

# Daily Seed Skill

Use this skill when you need to produce the daily learning-seed notes for this vault.

## Goal

Create 3 separate seed notes under `seeds/`, update question history, and open or update a PR on branch `seed-YYYYMMDD`.

## Inputs

- `seed-categories.md`
  Controls which categories are eligible.
- `.codex/daily-seed-history.json`
  Records past generated questions to avoid duplicates.

## Selection Rules

1. Read `seed-categories.md`.
2. Only categories checked in `Enabled Categories` are eligible.
3. Read `.codex/daily-seed-history.json`.
4. Generate 3 questions that are not duplicates or near-duplicates of previously used questions.
5. Prefer variety across categories when possible.
6. Prefer variety across question angles when possible.

## Preferred Question Angles

- definition
- comparison
- use-case
- misconception
- mental-model

The purpose is not to surface recent news. The purpose is to create a useful entry point into unfamiliar concepts.

## Output Rules

Create 3 files under `seeds/`.

Filename format:

- `内容を表す短い日本語_YYYY-MM-DD.md`

Rules:

- Use Japanese filenames.
- Put the date at the end.
- Prefer filenames that communicate what the note helps the reader understand.
- Avoid Windows-invalid characters such as `?` `:` `*` `/` `\` `<` `>` `|`.
- Shorten long questions into concise but meaningful filenames.

Each file must be written in Japanese and include frontmatter like:

```yaml
---
tags:
  - seed
seed_date: YYYY-MM-DD
category: GCP
question: GCPって何ですか？
question_type: definition
branch: seed-YYYYMMDD
generated_at: YYYY-MM-DDTHH:mm:ss+09:00
---
```

## Writing Style

Each note should help a beginner gain an initial mental model in about 3 minutes.

Recommended structure:

1. `# 質問`
2. `## 一言でいうと`
3. `## 何がうれしいのか`
4. `## どう考えると理解しやすいか`
5. `## 具体例`
6. `## 関連用語`
7. `## 次に知るとよいこと`

Rules:

- Keep everything in Japanese.
- Explain simply, but do not collapse into buzzwords.
- Prefer conceptual clarity over completeness.
- Avoid news summaries and link digests.
- Make each note standalone.

## History Update Rules

After generating the notes, append entries like this to `.codex/daily-seed-history.json`:

```json
{
  "date": "YYYY-MM-DD",
  "category": "GCP",
  "question": "GCPって何ですか？",
  "question_type": "definition"
}
```

## Git Rules

Before creating or updating the seed branch:

1. Switch to `main`.
2. Pull latest `main` with a fast-forward only strategy.
3. Then create or reuse branch `seed-YYYYMMDD`.

For the main seed PR:

1. Commit only:
   - the 3 generated seed notes
   - `.codex/daily-seed-history.json`
2. Open or update a PR titled `Seed YYYY-MM-DD`.

## Reflection Rules

After finishing the main seed PR, reflect on the run.

### Prompt Improvement PR

If `daily-seed-automation.md` should be improved immediately:

1. Switch to latest `main`.
2. Create branch `improve-daily-seed-automation-YYYYMMDD`.
3. Update only `daily-seed-automation.md`.
4. Commit only that file.
5. Open a PR titled `Improve daily seed automation YYYY-MM-DD`.

### Improvement Note PR

If there are other worthwhile improvements that should be recorded but not applied immediately:

1. Switch to latest `main`.
2. Create branch `propose-daily-seed-improvements-YYYYMMDD`.
3. Create `improvements/daily-seed-YYYYMMDD.md`.
4. Write concrete observations, problems, and proposals.
5. Commit only that file.
6. Open a PR titled `Propose daily seed improvements YYYY-MM-DD`.
