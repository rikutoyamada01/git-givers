# **4\. 画面・UI設計 (Frontend & UI Design)**

## **4.1. 画面遷移図**

`graph LR`  
    `LP[LP / Top Page] -->|Login with GitHub| Dashboard`  
    `Dashboard -->|Search/Filter| IssueList[Issue一覧 (Marketplace)]`  
    `IssueList -->|Select| IssueDetail[Issue詳細]`  
    `IssueDetail -->|Action| BoostModal[Boost Modal]`  
    `Dashboard -->|Manage| MyRepos[登録リポジトリ管理]`  
    `Dashboard -->|Profile| UserProfile[ユーザープロフィール]`

## **4.2. 主要画面定義**

### **4.2.1. ダッシュボード / Issue一覧 (Marketplace)**

GitKarmaのメイン画面。コントリビューターが取り組むべきIssueを探す場所。  
**UIコンポーネント**

* **Issueカード**:  
  * タイトル、リポジトリ名、言語  
  * **Boostバッジ**: 🔥 アイコンと共に、Boostされた総量や報酬を表示し目立たせる。  
  * **簡易スコア**: 難易度や推奨度を視覚化（要件の「読みやすいUI」）。  
* **フィルター**: 言語、Karma報酬順、新着順。  
* **表示ロジック**:  
  * assignee が存在するIssueは表示しない（または「対応中」としてグレーアウト）。  
  * 自分がMaintainerのリポジトリのIssueよりも、他人のIssueを優先レコメンド。

### **4.2.2. Issue詳細 & Boostモーダル**

**Issue詳細**

* GitHubへのリンクボタン（「GitHubで見る」）。  
* 現在のBoost状況の表示。  
* 「このIssueをBoostする」ボタン。

**Boostモーダル**

* **Input**: 投入するKarma量を入力（スライダー または 数値入力）。  
* **Display**:  
  * 現在の所持Karma  
  * 消費後の予想Karma  
  * 「ブーストすると一覧での表示順位が上がり、解決時の報酬が増えます」という説明。  
* **Action**: 実行ボタン。

### **4.2.3. リポジトリ管理 (Owner向け)**

自分のリポジトリをGitKarmaに登録・管理する画面。  
**機能**

* **リポジトリ一覧表示**: 自分のGitHubリポジトリを取得して一覧表示。  
* **登録スイッチ**: GitKarmaでの取り扱いOn/Off。  
  * ※ GitHub側でPrivateのリポジトリは「登録不可」と表示。  
* **公開設定**: Public on GitKarma のトグルスイッチ。  
  * GitHub側がPrivateになった場合、ここはDisabled（強制Off）となる。

## **4.3. UI非機能要件**

* **レスポンシブ**: PCでの作業がメインだが、スマホでの閲覧（Issue探し）も考慮。  
* **UXの軽量化**: 過度な装飾を避け、OSS貢献者の開発体験を阻害しないシンプルなデザイン。  
* **Github Like**: GitHubユーザーが違和感なく使えるデザインテイスト（Primer CSS等の活用も検討）。