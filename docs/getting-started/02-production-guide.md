# Appendix A-2: Deploying to the Cloud (Production)

So you want to ship? Here is how we handle the beast of production.

## 1. The Stack
-   **Hosting**: Vercel.
-   **Database**: Supabase (Hosted).

## 2. Dynamic Connection Strategy (Vital!)
Serverless functions hate persistent connections. They open too many and crash the DB.
We use a two-port strategy.

### The config (`prisma/schema.prisma`)
We don't hardcode the string. We rely on env vars.

| Env Var | Value (Example) | Purpose |
| :--- | :--- | :--- |
| `DATABASE_URL` | `...:6543/postgres?pgbouncer=true` | **Runtime**. Connects to Supabase Transaction Pooler. Scaling! |
| `DIRECT_URL` | `...:5432/postgres` | **Migration**. Connects directly. Required for table alterations. |

## 3. Environment Variables (Vercel)
In Vercel Project Settings, add:

-   `AUTH_SECRET`: Generate a long random string.
-   `AUTH_GITHUB_ID`: Your **Production** GitHub App ID (not the localhost one).
-   `AUTH_GITHUB_SECRET`: Your **Production** Secret.
-   `DATABASE_URL`: The Supabase Connection String (Pooler, port 6543).
-   `DIRECT_URL`: The Supabase Connection String (Direct, port 5432).

## 4. GitHub OAuth for Production
You need a separate GitHub App for production.
-   **Callback URL**: `https://git-karma.com/api/auth/callback/github` (or your Vercel domain).
-   **Warning**: Do not mix Local and Prod secrets.

## 5. Preview Environments
Vercel creates a unique URL for every PR.
-   **Problem**: GitHub OAuth requires a fixed URL.
-   **Solution**: Since we can't register infinite URLs in GitHub, we recommend sticking to a consistent **Branch URL** workflow (e.g., `git-givers-git-develop.vercel.app`) for testing auth.
