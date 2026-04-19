# Seed Categories

daily seed では、このファイルで有効にしたカテゴリをもとに質問を生成します。

- このファイルではカテゴリだけ管理する
- 質問文は管理しない
- 実際の質問は Codex Automation が生成する
- 重複回避は `.codex/daily-seed-history.json` を使う

## Enabled Categories

- [x] AI
- [ ] Machine Learning
- [ ] LLM
- [ ] Computer Vision
- [ ] Security
- [ ] Networking
- [x] GCP
- [ ] AWS
- [ ] Azure
- [ ] Linux
- [ ] Git
- [x] TypeScript
- [ ] JavaScript
- [ ] React
- [ ] Node.js
- [ ] Web Development
- [ ] CSS
- [ ] Accessibility
- [ ] Testing
- [ ] DevOps
- [ ] Docker
- [ ] Kubernetes
- [ ] Databases
- [ ] PostgreSQL
- [ ] SQL
- [ ] Data Engineering
- [ ] Analytics
- [ ] Rust
- [ ] Go
- [ ] Java
- [ ] Swift
- [ ] iOS
- [ ] Android
- [ ] Product Management
- [ ] Design
- [ ] HCI
- [ ] Startups
- [ ] Career
- [ ] Writing
- [ ] Productivity
- [ ] Obsidian
- [ ] Software Engineering

## Question Intent

生成する質問は、知らない概念に対して最初の理解の足場を作るものにします。

優先したい切り口:

- 定義: `GCPって何ですか？`
- 比較: `Cloud Run と Compute Engine は何が違いますか？`
- 使いどころ: `BigQuery はどういう場面で便利ですか？`
- 誤解整理: `TypeScript の型は実行時にも存在するのですか？`
- 全体像: `React はフロントエンド開発の中でどの位置にありますか？`

避けたいもの:

- ニュース要約
- 外部記事リンクのまとめ
- 一度読んでも理解の軸が残らない雑学
