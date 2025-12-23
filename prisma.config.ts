import "dotenv/config";
import { defineConfig, env } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node prisma/seed.js", // シードデータの作成
  },
  datasource: {
    // マイグレーション時は直接接続(DIRECT_URL)、それ以外(アプリ実行時)はプーリング接続(DATABASE_URL)を使用
    url: process.env.PRISMA_MIGRATION === "true" ? env("DIRECT_URL") : env("DATABASE_URL"),
  },
});
