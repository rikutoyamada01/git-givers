# Chapter 2: The Engine Room - System Architecture

## 2.1 The Tech Stack
We built GitGivers to be modern, fast, and type-safe. Here is our weapon of choice:

-   **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
    -   *Why?* Because server-side rendering (RSC) gives us the best performance for content-heavy dashboards.
-   **Language**: TypeScript
    -   *Why?* No more `undefined is not a function`.
-   **Database**: PostgreSQL
    -   *Why?* The gold standard for relational data.
-   **ORM**: Prisma (v7)
    -   *Why?* Type-safe database access that feels like writing native code.
-   **Auth**: NextAuth.js (v5)
    -   *Why?* Seamless integration with GitHub OAuth.

## 2.2 The Blueprint (Context Diagram)
Everything revolves around GitHub. We process events, we don't start them.

```mermaid
graph TD
    User[Contributor / Owner]
    GH[GitHub Platform]
    GK[GitGivers System]
      
    User --> |OAuth Login| GK
    User --> |1. Create Issue / PR| GH
    
    GH --> |2. Webhook (Issue Closed)| GK
    GK --> |3. Calculate Karma| GK
    GK --> |4. Update Dashboard| GK
      
    subgraph GitGivers
        Frontend[Next.js App Router]
        Backend[API Routes]
        DB[(PostgreSQL)]
    end
      
    Frontend --> Backend
    Backend --> DB
```

## 2.3 The Logic Flow
How does an Issue get into our system?

1.  **Trigger**: Repository Owner comments `@gitkarma` on a GitHub Issue.
2.  **Webhook**: GitHub notifies GitGivers.
3.  **Analysis**: We verify the repo is public.
4.  **Registration**: The Issue is saved to our DB with status `Open`.

## Column: Why Next.js App Router?
> "Why not Remix? Why not plain React?"
>
> We chose the **App Router** for its **Server Components**.
> GitGivers is dashboard-heavy. We fetch a lot of data (Karma history, Issue lists, Metadata).
> Doing this on the server means smaller bundles for the client and faster First Contentful Paint (FCP).
> Plus, Vercel deployment is zero-config. We like simple.

---
*Next Chapter: Where do we keep the Karma? The Database Design.*
