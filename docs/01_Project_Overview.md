# **1\. システム概要 (Project Overview)**

## **1.1. プロジェクト基本情報**

* **システム名**: GitKarma  
* **コンセプト**: 「OSS貢献をもっと手軽に楽しくする」マッチングプラットフォーム  
* **目的**:  
  * GitHub Issueをベースに、コントリビューターとOSSオーナーをマッチングする。  
  * ゲーミフィケーション（Karma）と露出強化（Boost）により、OSS開発の活性化を促す。  
  * 「開発支援のための場」として機能し、長期管理を強制しない（Issueが解決すればデータは消える）。

## **1.2. システム範囲 (Scope)**

### **対象機能**

1. **Repository管理**: GitHub Public Repoの登録、公開/非公開設定の同期。  
2. **Issue管理**: @gitkarma コマンドによるIssue登録、Assign制御、Close時の自動削除。  
3. **Karmaシステム**: 貢献に応じたポイント（Karma）の付与・管理。  
4. **Boost機能**: Karmaを消費してIssueの露出度（レコメンド順位）と報酬を引き上げる。

### **対象外**

* Private Repositoryの取り扱い。  
* Issue本文やコメントのGitKarma上での編集機能（GitHub側で行う）。  
* ソースコードのホスティング。

## **1.3. システムアーキテクチャ**

### **1.3.1. コンテキスト図**

本システムはGitHubプラットフォームと密に連携して動作します。  
`graph TD`  
    `User[Contributor / Owner]`  
    `GH[GitHub Platform]`  
    `GK[GitKarma System]`  
      
    `User --> |OAuth Login| GK`  
    `User --> |Create Issue / Comment| GH`  
    `User --> |Work & Commit| GH`  
      
    `GH --> |Webhook (Issue/Repo events)| GK`  
    `GK --> |API (Check status)| GH`  
      
    `subgraph GitKarma`  
        `Frontend[Web Frontend]`  
        `Backend[API Server]`  
        `DB[(Database)]`  
    `end`  
      
    `Frontend --> Backend`  
    `Backend --> DB`

### **1.3.2. 全体シーケンス (Issue登録フロー)**

OwnerがGitHub上でアクションを起こすことでGitKarmaに登録されます。  
`sequenceDiagram`  
    `participant O as Repo Owner`  
    `participant GH as GitHub`  
    `participant GK as GitKarma`

    `Note over O, GH: GitHub上での操作`  
    `O->>GH: Issue 作成/コメント ("@gitkarma" を含む)`  
      
    `Note over GH, GK: システム連携`  
    `GH->>GK: Webhook (issues event)`  
    `GK->>GK: テキスト解析 (@gitkarma検知)`  
    `GK->>GK: Repository公開状態チェック`  
    `GK->>GK: Issue を DB に登録 (Status: Open)`  
      
    `GK-->>O: (Optional) 登録完了通知`

## **1.4. ユースケース**

提供された要件に基づく主要なユースケースモデルです。  
`flowchart TB`  
    `A[User / Contributor]`  
    `O[Repository Owner]`  
      
    `subgraph GitKarma System`  
        `UC1((GitHubでログイン))`  
        `UC2((Repo登録・連携))`  
        `UC3((Repo公開設定変更))`  
        `UC5((Issue登録 @gitkarma))`  
        `UC6((Issue Assign確認))`  
        `UC9((Karma獲得))`  
        `UC10((Issue Boost))`  
        `UC11((おすすめIssue閲覧))`  
        `UC12((統計確認))`  
    `end`

    `A --> UC1`  
    `A --> UC6`  
    `A --> UC9`  
    `A --> UC10`  
    `A --> UC11`  
    `A --> UC12`

    `O --> UC2`  
    `O --> UC3`  
    `O --> UC5`  
      
    `note[GitHub側でClosedになると<br/>GitKarmaから削除される] -.-> UC9`  
