# Chapter 5: The Grand Roadmap (Future Plans)

> "A goal without a plan is just a wish." — Antoine de Saint-Exupéry

This document tracks the evolution of GitGivers from a simple MVP to a thriving ecosystem.

## 5.1 Phase 1: Genesis (The MVP)
**Theme**: "First Believer"
**Goal**: Prove the economy works. Can a user earn 100 Karma and spend it?

-   ✅ **Project Identity**: Rebranding to "GitGivers".
-   ✅ **Auth System (v5)**: Stable GitHub OAuth login.
-   🔲 **Repo Sync Engine**:
    -   *Detail*: We need to fetch user repos via Octokit on login.
    -   *Why*: Users can't boost repos if we don't know they have them.
-   🔲 **Membership Logic**: The "Unlock" fee (500 Karma) to prevent abuse.
-   🔲 **GitHub App Bot**: The core. Webhook handler for `pull_request.closed`.

## 5.2 Phase 2: Engagement (Gamification)
**Theme**: "Addiction" (The good kind)
**Goal**: Retention. Make users check their Karma daily.

-   🔲 **Profile 2.0 (Heatmap)**:
    -   *Detail*: A visual grid of contribution similar to GitHub's, but for Karma.
-   🔲 **Kudos System**:
    -   *Detail*: Allow Maintainers to attach a "Thank You" note to the Karma transfer.
    -   *Why*: Karma is money; Kudos is soul.
-   🔲 **Leaderboard**: "Hero of the Week".

## 5.3 Phase 3: Ecosystem (Expansion)
**Theme**: "Ubiquity"
**Goal**: Be where the developers are.

-   🔲 **GitGivers CLI**:
    -   `gg status`: Check your balance.
    -   `gg find`: Find a "0-star" issue to work on from your terminal.
-   🔲 **VS Code Extension**: A sidebar radar for help-wanted issues.

## 5.4 Phase 4: Decentralization (Moonshot)
**Theme**: "Community Ownership"

-   🔲 **DAO Governance**: High-Karma users vote on platform fees/features.
-   🔲 **Blockchain Integration?**: Maybe. Or maybe just stick to Postgres. Let's not over-engineer yet.
