# 🗺️ GitKarma グランドロードマップ

このドキュメントは、GitKarmaの誕生から開発者エコシステムとしての最終形態に至るまでの、長期的な進化を追跡する**マスタープロジェクト計画書**です。

**凡例:**
*   **Status:** ✅ 完了 | 🔄 進行中 | ⬜ 未着手
*   **Priority:** **P0** (最重要/ブロッカー) > **P1** (コア機能) > **P2** (重要) > **P3** (あると良い)
*   **Weight:** **S** (小/数時間) < **M** (中/数日) < **L** (大/1週間) < **XL** (特大/数週間)

---

## 🟢 Phase 1: Genesis (創世記 - MVP)
**Goal:** 経済圏のコア（会員権、SOS、自動Karma）と「最初の信者」体験を確立する。

| Status | Priority | Weight | Task Name | Detailed Description |
| :---: | :---: | :---: | :--- | :--- |
| ✅ | **P0** | **M** | **Project Identity** | "Don't Code Alone" コンセプトの定義、LPデザイン、Next.js初期セットアップ。 |
| 🔄 | **P0** | **XL** | **Auth System (v5)** | Auth.js (NextAuth) と GitHub Provider の統合。セキュアなセッション管理。 |
| ⬜ | **P1** | **L** | **Repo Sync Engine** | Octokit経由でユーザーのリポジトリを取得・同期。効率的なDBスキーマ設計。 |
| ⬜ | **P1** | **L** | **Membership Logic** | 「500 Karmaでロック解除」のトランザクションモデル実装。Takerの排除。 |
| ⬜ | **P1** | **M** | **SOS Beacon UI** | ダッシュボードのシンプルなスイッチ (`[ON 📡]`)。複雑なIssue管理UIは作らない。 |
| ⬜ | **P2** | **L** | **Gem Radar (Top)** | 発見エンジン。アクティブなSOSビーコンをGiverに表示するアルゴリズム。 |
| ⬜ | **P2** | **XL** | **GitHub App Bot** | 自動化の核。`pull_request.closed` Webhookを受信し、Karma支払いを実行する。 |

## 🟡 Phase 2: Engagement (熱狂 - Gamification)
**Goal:** 貢献を「やみつき」にする。社会的証明と視覚的フィードバックによるリテンション。

| Status | Priority | Weight | Task Name | Detailed Description |
| :---: | :---: | :---: | :--- | :--- |
| ⬜ | **P2** | **M** | **Profile 2.0** | 「Karmaヒートマップ」（GitHub風）。貢献のストリーク（連続記録）を可視化。 |
| ⬜ | **P3** | **S** | **Kudos System** | Karma送金時に、メンテナが短い「ありがとう」メッセージを添えられるようにする。 |
| ⬜ | **P3** | **M** | **Leaderboard** | 週間/月間トップGiverランキング。「今週のヒーロー」を選出。 |
| ⬜ | **P3** | **L** | **Notification Center** | Karma受信、ビーコン点灯、システム更新のリアルタイム通知。 |
| ⬜ | **P3** | **M** | **Badges System** | "First Merge", "Bug Hunter", "Sponsor" などのバッジ。NFT的なコレクション要素。 |

## 🔴 Phase 3: Ecosystem (拡大 - Expansion)
**Goal:** 開発者の生活空間（ターミナル、IDE、モバイル）のすべてに存在する。

| Status | Priority | Weight | Task Name | Detailed Description |
| :---: | :---: | :---: | :--- | :--- |
| ⬜ | **P3** | **XL** | **GitKarma CLI** | ターミナルからIssueを探す `gk find`、Karmaを確認する `gk status`。 |
| ⬜ | **P4** | **L** | **VS Code Extension** | サイドバーレーダー。エディタを離れずに「助けが必要なリポジトリ」を発見。 |
| ⬜ | **P4** | **XXL** | **Mobile App** | 「OSS版Tinder」。右スワイプで貢献するリポジトリを探す。プッシュ通知でKarmaを確認。 |
| ⬜ | **P4** | **XL** | **Enterprise Mode** | 社内専用のKarma経済圏を作るためのプライベートリポジトリ対応。 |

## 🟣 Phase 4: Decentralization (未来 - DAO)
**Goal:** コミュニティによる所有と持続可能性。

| Status | Priority | Weight | Task Name | Detailed Description |
| :---: | :---: | :---: | :--- | :--- |
| ⬜ | **P5** | **?** | **DAO Governance** | 高Karmaユーザーがプラットフォームの機能追加や方針に投票できる仕組み。 |
