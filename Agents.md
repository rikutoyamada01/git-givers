# AI Agent Operational Protocol (Agents.md)

**Target Audience**: AI Agents (You).
**Purpose**: To ensure safe, consistent, and high-quality contributions to `git-givers`.

---

## 1. Mission Strategy
Your goal is not just to "write code". It is to **enhance the ecosystem**.
-   **Think First**: Before editing files, analyze the impact. Read related files.
-   **Step-by-Step**: Don't change 10 files at once. Break it down.
-   **Validation**: Every change must be verified. "I think it works" is not an acceptable state.

## 2. The Golden Rules (Do's and Don'ts)

### 🚫 Forbidden Actions
1.  **NO `npm run migrate` (Production)**:
    -   Never run `migrate` or `migrate:prod` in the local environment.
    -   **Correct**: Use `npm run migrate:local`.
2.  **NO Magic Numbers in CSS**:
    -   Avoid `w-[325px]`. Use Tailwind tokens (`w-80`).
3.  **NO Leaving Broken Builds**:
    -   Always run `tsc --noEmit` (type check) before finishing a task.
4.  **NO Hallucinated Imports**:
    -   Verify an import exists before adding it. `import { NonExistent } from '@/lib/utils'` causes crashes.

### ✅ Mandatory Actions
1.  **Check Database Status**:
    -   If a task involves DB, first run `npm run supa:status` or checks if Docker is up.
    -   If down, run `npm run supa:start`.
2.  **Use Conventional Commits**:
    -   Format: `type(scope): description`
    -   Example: `feat(payment): add stripe webhook handler`
3.  **Update Documentation**:
    -   If you change logic, update `docs/`. Code and docs must stay in sync.

## 3. The Toolbox (Project Scripts)

| Script | Purpose | When to use |
| :--- | :--- | :--- |
| `npm run dev` | Start Dev Server | Default mode. |
| `npm run supa:start` | Start Local DB | If DB connection fails. |
| `npm run migrate:local` | Apply Schema | After modifying `schema.prisma`. |
| `npm run db:reset` | **Nuclear Option** | If schema is hopelessly broken. Resets DB. |
| `npm test` | Run Tests | After any logic change. |
| `npm run type-check` | TS Validation | **Mandatory** before notifying user. |

## 4. Problem Solving Algorithm

When you encounter an error:

1.  **Stop**. Don't blindly retry.
2.  **Read the Error**. Full stack trace.
3.  **Locate Source**. Is it `src/` (Code), `prisma/` (DB), or `.env` (Config)?
4.  **Formulate Hypothesis**. "I think the DB container isn't running."
5.  **Verify Hypothesis**. `docker ps`.
6.  **Fix & Verify**. Run the fix, then run the test case that failed.

## 5. File Structure Awareness
-   `src/app/(dashboard)`: Protected UI pages.
-   `src/app/api`: Backend routes.
-   `src/lib`: Shared utilities (DB, Auth).
-   `docs/`: The source of truth for logic. **Read this if confused.**

## 6. Communication Style
-   Be concise.
-   Use Markdown.
-   When asking for review, link to the specific files changed.

---
*End of Protocol. Good luck, Agent.*
