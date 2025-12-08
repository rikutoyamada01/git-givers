# 🛡 Devtool 仕様書（安全版 / Local Environment Only）

## 1. 概要
**ローカル環境（開発者の PC 上）でのみ動作する開発支援ツールバー（Devtool）を提供する。**
これにより、開発者はユーザー属性変更・Karma 編集・セッション確認・DB リセットなどを迅速に操作できる。

Devtool は以下の要件を満たす：
*   **本番 / Preview / Staging では完全に非存在**（UI も API もビルドされない）
*   **ローカルネットワーク外からのアクセスは完全拒否**
*   **誤クリック事故が起きない仕組みを内包**

## 2. 目的
### 2.1 開発効率
*   Karma の変更、ユーザー情報の変更を UI からワンクリックで実行可能にする。
*   テストデータの投入を自動化する。

### 2.2 デバッグ
*   現在のセッションを可視化。
*   強制ログアウト機能を提供。

### 2.3 安全性
*   **APP_ENV=local の場合のみコードをバンドル**
*   **Dev API は localhost / 127.0.0.1 / ::1 のみ許可**
*   **本番環境・Preview・CI/CD では Devtool の影響ゼロ**

## 3. 環境判定（最重要）
### 3.1 専用フラグを使用する（NODE_ENV は使わない）
```bash
APP_ENV=local
```
本番/Preview では以下を設定（または未設定）：
```bash
APP_ENV=production
```

### 3.2 クライアント側
Next.js の `layout.tsx` で動的インポートと条件分岐を行い、**production バンドルから DevTools を除外する**：
```tsx
let DevTools = null
if (process.env.NEXT_PUBLIC_APP_ENV === "local") {
  DevTools = dynamic(() => import("~/components/devtools"))
}
```

## 4. UI仕様（DevTool 本体）
### 4.1 基本構造
*   画面右下に「🛠 Debug」フローティングボタンを表示。
*   クリックでパネル展開。
### 4.2 表示条件
**`NEXT_PUBLIC_APP_ENV === 'local'` のときのみ描画。**

## 5. 提供機能
### 5.1 User Manipulation（ユーザー操作）
*   **Karma 編集**: +100 / –100 / Set 0
*   **User Info**: User ID / Email / GitHub username
*   **確認フロー**: 実行前は **1クリックで実行されず、確認ダイアログを表示**

### 5.2 Session Inspector
*   session オブジェクトを JSON で可視化
*   Force Logout ボタン（確認あり）

### 5.3 Database Utils（DB 操作）
強力な操作のため、**2段階保護 + 確認ダイアログ** を必須にする：
#### Reset DB
*   Step1: 「RESET_DB」と入力させる
*   Step2: 「最終確認」ダイアログ
*   Step3: 実行

#### Seed Data
*   テスト用ユーザー / リポジトリを投入
*   リバーシブルなデータ追加のみ行う（Truncate + Insert は不可変のため注意）

## 6. Dev API（Local-only API）
### 6.1 ルート
`src/app/api/dev/[action]/route.ts`

### 6.2 保護ロジック（最強の3重ガード）
#### ① APP_ENV チェック
```ts
if (process.env.APP_ENV !== "local") return new Response("Not Found", { status: 404 })
```
#### ② IP チェック（localhost のみ許可）
```ts
const addr = req.socket.remoteAddress
const localIps = ["127.0.0.1", "::1"]
if (!localIps.includes(addr)) return new Response("Forbidden", { status: 403 })
```
#### ③ X-Forwarded-For チェック（プロキシ経由禁止）
```ts
if (req.headers.get("x-forwarded-for")) return new Response("Forbidden", { status: 403 })
```

この 3 重ガードにより、社内 LAN、Preview、Cloudflare 等からのアクセスを遮断する。

## 7. 通信方式
すべての Dev 操作は POST のみ：
*   `POST /api/dev/update-karma`
*   `POST /api/dev/reset-db`
*   `POST /api/dev/seed-data`
*   `POST /api/dev/logout`

## 8. アーキテクチャ
### 8.1 バンドル戦略
**DevTool の UI・ロジック・API は 非-local build では完全にバンドルしない。**

### 8.2 All-or-Nothing
Devtool の import は **layout.tsx の 1 箇所に限定**。個別コンポーネントに条件分岐を持ち込まない。

## 9. 実装フェーズ
### Phase 1（最重要）
*   Dev API の `/api/dev` 実装
*   3重ガードの実装（APP_ENV / local IP / X-Forwarded-For）

### Phase 2
*   Karma 操作ロジック（Prisma 直接操作）

### Phase 3
*   UI コンポーネント実装
*   layout.tsx に Devtool を注入（条件 import）
