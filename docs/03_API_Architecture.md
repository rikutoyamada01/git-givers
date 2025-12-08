# **3\. APIインターフェース設計 (API Architecture)**

## **3.1. 基本方針**

* **認証**: GitHub OAuth 2.0 (Session / JWT)  
* **プロトコル**: RESTful API over HTTPS  
* **Webhook**: GitHubからのイベント通知を受け取るエンドポイントを公開

## **3.2. エンドポイント一覧**

### **Auth & User**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /auth/github | GitHub OAuth開始 |
| GET | /auth/github/callback | コールバック処理 |
| GET | /api/me | 自身のユーザー情報（Karma残高含む）取得 |

### **Issues (Recommendation)**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/issues | おすすめIssue一覧取得 (Boost加味) |
| GET | /api/issues/:id | Issue詳細取得 |
| POST | /api/issues/:id/boost | IssueへのBoost実行 |

### **Repositories**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| GET | /api/repos | 自分の管理リポジトリ一覧 |
| POST | /api/repos | リポジトリ登録（Publicのみ） |
| PATCH | /api/repos/:id | 公開/非公開設定の変更 |

### **Webhook (GitHub Integration)**

| Method | Endpoint | Description |
| :---- | :---- | :---- |
| POST | /webhooks/github | GitHubからのイベント受信 |

## **3.3. API詳細仕様**

### **3.3.1. おすすめIssue一覧取得**

GET /api/issues  
**Query Parameters**

* limit: 取得件数 (default: 20\)  
* offset: ページネーション  
* sort: recommended (default), newest, boost\_high

**Logic (Recommendation)**

* 担当者(assigneeId)が設定されているIssueは除外する。  
* BoostされているIssueのスコアを重み付けして上位表示する。  
* ユーザーがオーナーのRepoのIssueは（自分には）表示優先度を下げる（他者貢献推奨のため）。

### **3.3.2. IssueへのBoost**

POST /api/issues/:issueId/boost  
**Request Body**  
`{`  
  `"amount": 100`  
`}`

**Logic**

1. ユーザーの保有Karmaを確認 (user.karma \>= amount)。  
2. 不足していれば 400 Error。  
3. BOOST テーブルにレコード作成。  
4. USER テーブルの karma を減算。  
5. レスポンスとして更新後のユーザーKarmaとIssueの総Boost数を返す。

### **3.3.3. GitHub Webhook**

POST /webhooks/github  
**主な処理イベント**

1. **issues (opened, edited)**:  
   * 本文/コメントに @gitkarma が含まれるかスキャン。  
   * 含まれる場合、DBへIssueを登録（または更新）。  
2. **issues (closed)**:  
   * DBからIssueデータを論理削除またはアーカイブ状態へ。  
   * Karma付与処理をトリガー（05\_Logic\_Details.md参照）。  
3. **issues (assigned)**:  
   * assigneeId を更新。一覧APIのレスポンスから除外されるようになる。  
4. **repository (publicized, privatized)**:  
   * isPublicOnGitHub フラグを更新。  
   * privatized の場合、GitKarma上でも即座に非公開化。

\<\!-- end list \--\>  
`sequenceDiagram`  
    `participant GH as GitHub`  
    `participant API as Webhook Endpoint`  
    `participant DB as Database`  
      
    `GH->>API: POST /webhooks/github (payload)`  
    `API->>API: Verify Signature (HMAC)`  
    `alt Event: issues (opened/edited)`  
        `API->>API: Check content for "@gitkarma"`  
        `opt Contains @gitkarma`  
            `API->>DB: Upsert Issue`  
        `end`  
    `else Event: repository (privatized)`  
        `API->>DB: Update Repo (isPublicOnGitHub=false)`  
        `API->>DB: Hide associated Issues`  
    `end`  
    `API-->>GH: 200 OK`  
