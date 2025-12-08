- **🔄 Pay It Forward (恩送り)**: 新しいユーザーは、自分のリポジトリを登録する前に、既存のIssueに貢献しなければならない「デポジット制」を採用しています。
- **🏆 ゲーミフィケーション**: 継続的な活動に対してバッジを獲得したり、ストリーク（連続記録）を維持したりできます。

## 始め方

1. **GitHubでサインアップ**: GitHubアカウントを使用してGitGiversプラットフォームにログインします。
2. **Pay it Forward (デポジット)**: 助けを求める前に、まず他者を助ける必要があります。厳選された「Good First Issue」リストから1つ解決して、アカウントを有効化してください。
3. **カルマを獲得**: 貢献が検証されると、最初のカルマポイントを獲得できます。
4. **プロジェクトを登録**: 獲得したカルマを使用して、自分のリポジトリをリストアップし、貢献者を募集します。



## コンセプト

GitGiversは、開発者のための「時間銀行」として機能します。貢献の循環型経済を作り出すことで、放置されたOSSプロジェクトの問題を解決します。従来の「Issue発見」サービスとは異なり、GitGiversは**相互的な交換**に焦点を当てています。

## 特徴

- **🤝 相互貢献マッチング**: あなたのスキル（例: Python, React）と、それを必要としているプロジェクトを自動的にマッチングさせます。
- **💎 カルマシステム**: 貢献（コード、ドキュメント、レビュー）によってポイントを獲得し、それを使って自分のリポジトリへの貢献者を募集できるクレジット制システムです。
- **🛡️ 品質の担保**: 相互評価システムにより、質の高い貢献を保証します。スパムを防ぐため、マージされたPRを通じて貢献が検証されます。
- **🔄 Pay It Forward (恩送り)**: 新しいユーザーは、自分のリポジトリを登録する前に、既存のIssueに貢献しなければならない「デポジット制」を採用しています。
- **🏆 ゲーミフィケーション**: 継続的な活動に対してバッジを獲得したり、ストリーク（連続記録）を維持したりできます。

## 始め方

1. **GitHubでサインアップ**: GitHubアカウントを使用してGitGiversプラットフォームにログインします。
2. **Pay it Forward (デポジット)**: 助けを求める前に、まず他者を助ける必要があります。厳選された「Good First Issue」リストから1つ解決して、アカウントを有効化してください。
3. **カルマを獲得**: 貢献が検証されると、最初のカルマポイントを獲得できます。
4. **プロジェクトを登録**: 獲得したカルマを使用して、自分のリポジトリをリストアップし、貢献者を募集します。

> *注: 当初はWebプラットフォームとして構築されますが、将来的にはターミナルで操作できるCLIツールの提供も計画しています。*

## ディレクトリ構成


- **`src/`**: Next.js App Router アプリケーション (フロントエンド & API)。
- **`prisma/`**: データベーススキーマとマイグレーション。
- **`public/`**: 静的アセット。

## 前提条件

- Node.js 18以上
- Docker (Supabase Local用)
- Supabase CLI (npmで自動インストールされます)

## 開発 (ローカルでの実行)

1. リポジトリをクローンし、依存関係をインストールします:

   ```bash
   git clone https://github.com/yamadarikuto/git-karma.git
   cd git-karma
   npm install
   ```


2. 環境変数をセットアップします:
   ```bash
   cp .env.example .env.local
   # 1. .env.local を編集:
   #    - AUTH_SECRET を設定 (自動生成またはスクリプト使用)
   #    - AUTH_GITHUB_ID と AUTH_GITHUB_SECRET を設定 (GitHub Appから取得)
   ```


3. データベースを起動します:
   ```bash
   # 注: 'npm run dev' でSupabaseも自動起動します
   # 初回やスキーマ適用が必要な場合:
   npm run supa:start
   npm run migrate:local
   ```

5. 開発サーバーを起動します:
   ```bash
   npm run dev
   ```

   ブラウザで [http://localhost:3000](http://localhost:3000) を開いて結果を確認してください。

### バックエンド開発環境

- **Database**: Prisma ORM (v7) を使用。
  - クライアント生成: `npx prisma generate` (出力先: `src/generated/client`)
- **Testing**: Vitest を使用。
  - テスト実行: `npm test`
- **Code Quality**: Husky と lint-staged により、コミット時に以下を自動チェックします。
  - Lint (ESLint)
  - Type Check (TypeScript)
  - Tests (Vitest)

## ドキュメント

### プロジェクトドキュメント
- **[システムアーキテクチャ](docs/architecture/02-system-architecture.md)**: 技術スタックと構造の概要。
- **[データベーススキーマ](docs/architecture/03-database-design.md)**: ER図とモデルの詳細。
- **[コアロジック](docs/architecture/04-core-logic.md)**: Karma計算の裏側。
- **[ロードマップ](docs/planning/01-grand-roadmap.md)**: 今後の計画。
- **[コーディング規約](docs/guidelines/01-coding-standards.md)**: 開発スタイルと原則。
- **[ワークフロー](docs/guidelines/02-workflow-protocols.md)**: GitとPRのルール。
- **[AIガイドライン](docs/guidelines/03-ai-collaboration.md)**: AIツール使用ポリシー。
- **[変更履歴](CHANGELOG.md)**: バージョン履歴。

### コミュニティヘルス
- **[セキュリティポリシー](.github/SECURITY.md)**: 脆弱性の報告について。
- **[サポート](.github/SUPPORT.md)**: ヘルプの求め方。
- **[行動規範](.github/CODE_OF_CONDUCT.md)**: コミュニティの基準。

## コントリビューション

コントリビューションを歓迎します！プルリクエストの送信方法、問題の報告、改善の提案については、[貢献ガイドライン](CONTRIBUTING.ja.md)をご覧ください。

## ライセンス

このプロジェクトは MIT ライセンスの下でライセンスされています。詳細は [LICENSE](LICENSE) ファイルをご覧ください。
