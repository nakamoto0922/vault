---
name: daily-seed
description: Generate 3 Japanese seed notes from enabled categories with history-based deduplication, then open or update a PR.
---

# Daily Seed Skill

Use this skill when you need to produce the daily learning-seed notes for this vault.

## Goal

Create 3 separate files under `seeds/` from dynamically generated questions, then prepare or update a PR on branch `seed-YYYYMMDD`.

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

Create these 3 files:

- `seeds/seed-YYYYMMDD-01.md`
- `seeds/seed-YYYYMMDD-02.md`
- `seeds/seed-YYYYMMDD-03.md`

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

1. Create or reuse branch `seed-YYYYMMDD`.
2. Commit only:
   - `seeds/seed-YYYYMMDD-01.md`
   - `seeds/seed-YYYYMMDD-02.md`
   - `seeds/seed-YYYYMMDD-03.md`
   - `.codex/daily-seed-history.json`
3. Open or update a PR titled `Seed YYYY-MM-DD`.
