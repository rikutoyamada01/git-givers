# Appendix A-1: Setting Up Your Forge (Local Development)

This guide is for the blacksmiths building the platform itself.

## 1. Prerequisites
-   **Node.js 18+**
-   **Docker Desktop** (Must be running for the database)
-   **Supabase CLI** (`npm install` handles this, but `npm install -g supabase` is fine too).

## 2. GitHub OAuth Setup (Local)
You need a "Local" version of the GitHub App.

1.  Go to **GitHub Developer Settings > OAuth Apps**.
2.  Create New App:
    -   Name: `GitGivers (Local)`
    -   Homepage: `http://localhost:3000`
    -   **Callback URL**: `http://localhost:3000/api/auth/callback/github`
3.  Generate a **Client Secret**.

## 3. The `.env.local` File
Copy `.env.example` to `.env.local`.

```env
# Database (Defaults for Supabase Local)
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"
DIRECT_URL="postgresql://postgres:postgres@127.0.0.1:54322/postgres"

# Auth
AUTH_SECRET="<run: openssl rand -base64 32>"
AUTH_GITHUB_ID="<Your Local App Client ID>"
AUTH_GITHUB_SECRET="<Your Local App Secret>"
```

## 4. Boot Sequence
1.  **Light the fire**: `npm run supa:start` (Starts Docker DB).
2.  **Forge the schema**: `npm run migrate:local` (Applies Prisma schema).
3.  **Hammer time**: `npm run dev`.

## troubleshooting
-   **Port 54322 already in use?**
    -   You might have another Supabase project running. Run `npx supabase stops` to kill others.
-   **Schema drift?**
    -   If standard commands fail, `npm run db:reset` is the nuclear option. It wipes data but fixes schema.
