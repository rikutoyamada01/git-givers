# **2\. データベース設計 (Database Design)**

## **2.1. ER図 (Entity Relationship Diagram)**

GitKarmaのデータモデルは、GitHubの構造（User, Repo, Issue）をベースに、独自要素（Karma, Boost）を付加したものです。  
`erDiagram`  
    `USER {`  
        `string id PK "System ID"`  
        `string username "Display Name"`  
        `string githubId UK "GitHub User ID"`  
        `string avatarUrl`  
        `int karma "Total Points"`  
    `}`  
    `REPOSITORY {`  
        `string id PK`  
        `string githubRepoId UK "GitHub Repo ID"`  
        `string ownerId FK`  
        `boolean isPublicOnGitHub "GitHub側の公開状態"`  
        `boolean isPublicOnGitKarma "GitKarma側の公開設定"`  
    `}`  
    `ISSUE {`  
        `string id PK`  
        `string githubIssueId UK`  
        `string repositoryId FK`  
        `string assigneeId FK "Nullable"`  
        `boolean isOpen`  
    `}`  
    `ISSUE_EVENT {`  
        `string id PK`  
        `string issueId FK`  
        `string userId FK`  
        `string type "COMMENT, PR, REVIEW, etc"`  
        `int karmaEarned`  
    `}`  
    `BOOST {`  
        `string id PK`  
        `string issueId FK`  
        `string userId FK`  
        `int amount "Boosted Karma Amount"`  
    `}`

    `USER ||--o{ REPOSITORY : owns`  
    `REPOSITORY ||--o{ ISSUE : has`  
    `ISSUE ||--o{ ISSUE_EVENT : logs`  
    `USER ||--o{ ISSUE_EVENT : contributes`  
    `USER ||--o{ BOOST : boosts`  
    `ISSUE ||--o{ BOOST : boosted`

## **2.2. テーブル定義詳細**

### **2.2.1. Users**

アプリケーションのユーザー。GitHubアカウントと1対1で紐づく。

| カラム名 | 型 | 制約 | 説明 |
| :---- | :---- | :---- | :---- |
| id | String | PK, UUID | 内部識別子 |
| githubId | String | Unique | GitHubのユーザーID |
| username | String | Not Null | GitHubユーザー名 |
| avatarUrl | String |  | アバター画像URL |
| karma | Int | Default 0 | 所持カルマ総量 |

### **2.2.2. Repositories**

GitKarmaで管理対象となったリポジトリ。

| カラム名 | 型 | 制約 | 説明 |
| :---- | :---- | :---- | :---- |
| id | String | PK, UUID |  |
| githubRepoId | String | Unique | GitHubのリポジトリID |
| ownerId | String | FK(Users) | 所有者（登録者） |
| isPublicOnGitHub | Boolean | Default True | GitHub側でPublicか |
| isPublicOnGitKarma | Boolean | Default True | ユーザー設定による公開状態 |

**制約**: isPublicOnGitHub が False になった場合、システムロジックにより isPublicOnGitKarma も強制的に無効化（または検索除外）として扱う。

### **2.2.3. Issues**

@gitkarma で登録されたIssue。

| カラム名 | 型 | 制約 | 説明 |
| :---- | :---- | :---- | :---- |
| id | String | PK, UUID |  |
| githubIssueId | String | Unique | GitHubのIssue ID |
| repositoryId | String | FK(Repos) |  |
| assigneeId | String | FK(Users), Nullable | 現在のアサイン担当者 |
| isOpen | Boolean | Default True |  |

### **2.2.4. Boosts**

ユーザーがIssueに対してKarmaを投資した記録。

| カラム名 | 型 | 制約 | 説明 |
| :---- | :---- | :---- | :---- |
| id | String | PK, UUID |  |
| issueId | String | FK(Issues) | 対象Issue |
| userId | String | FK(Users) | ブーストしたユーザー |
| amount | Int | Min 1 | 投資したKarma量 |

## **2.3. クラス図 (Domain Model)**

アプリケーションコード上のデータ構造イメージ。  
`classDiagram`  
    `class User {`  
        `+id: string`  
        `+githubId: string`  
        `+username: string`  
        `+avatarUrl: string`  
        `+karma: int`  
        `+addKarma(amount: int)`  
        `+consumeKarma(amount: int)`  
    `}`  
    `class Repository {`  
        `+id: string`  
        `+githubRepoId: string`  
        `+ownerId: string`  
        `+isPublicOnGitHub: bool`  
        `+isPublicOnGitKarma: bool`  
        `+syncVisibility(ghStatus: bool)`  
    `}`  
    `class Issue {`  
        `+id: string`  
        `+githubIssueId: string`  
        `+repositoryId: string`  
        `+assigneeId: string`  
        `+isOpen: bool`  
        `+totalBoostAmount: int`  
    `}`  
    `class Boost {`  
        `+id: string`  
        `+issueId: string`  
        `+userId: string`  
        `+amount: int`  
    `}`  
      
    `User "1" --> "*" Repository`  
    `Repository "1" --> "*" Issue`  
    `User "1" --> "*" Boost`  
    `Issue "1" --> "*" Boost`  
