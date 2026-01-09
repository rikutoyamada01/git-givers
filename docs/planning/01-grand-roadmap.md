# Chapter 5: The Grand Roadmap (Future Plans)

> "A goal without a plan is just a wish." — Antoine de Saint-Exupéry

This document tracks the evolution of GitGivers from a simple MVP to a thriving ecosystem.

## 5.1 Phase 1: Genesis (The MVP)

**Theme**: "First Believer"  
**Goal**: Prove the economy works. Can a user earn 100 Karma and spend it?

-   ✅ **Project Identity**: Rebranding to "GitGivers"
-   ✅ **Auth System (v5)**: Stable GitHub OAuth login with session management
-   ✅ **Repository Registration**:
    -   *Detail*: Users can register their own repositories with a 500 Karma fee
    -   *Why*: Registration fee prevents spam and validates commitment
    -   *Features*: Ownership verification, GitHub API integration, automatic issue sync
-   🔲 **Issue Boost System**: 
    -   *Detail*: Allow users to boost registered issues to attract contributors
    -   *Why*: Create the core Karma circulation mechanism
-   🔲 **GitHub App Bot**: 
    -   *Detail*: Webhook handler for `pull_request.closed` events
    -   *Why*: Automatically distribute Karma rewards when PRs are merged
    -   *Anti-Gaming*: Prevent issue authors and repo owners from claiming their own bounties

## 5.2 Phase 2: Engagement (Gamification)

**Theme**: "Addiction" (The good kind)  
**Goal**: Retention. Make users check their Karma daily.

-   🔲 **Profile 2.0 (Heatmap)**:
    -   *Detail*: A visual grid of contributions similar to GitHub's, but for Karma activity
    -   *Why*: Gamification through visual progress tracking
-   🔲 **Kudos System**:
    -   *Detail*: Allow maintainers to attach a "Thank You" note to Karma transfers
    -   *Why*: Karma is money; Kudos is soul
-   🔲 **Leaderboard**: 
    -   *Detail*: "Hero of the Week" rankings
    -   *Why*: Recognition drives engagement

## 5.3 Phase 3: Ecosystem (Expansion)

**Theme**: "Ubiquity"  
**Goal**: Be where the developers are.

-   🔲 **GitGivers CLI**:
    -   `gg status`: Check your Karma balance
    -   `gg find`: Find boosted issues to work on from your terminal
    -   `gg boost`: Boost an issue directly from CLI
-   🔲 **VS Code Extension**: 
    -   *Detail*: A sidebar showing nearby boosted issues
    -   *Why*: Meet developers in their workflow

## 5.4 Phase 4: Decentralization (Moonshot)

**Theme**: "Community Ownership"  
**Goal**: Let the community govern itself.

-   🔲 **DAO Governance**: 
    -   *Detail*: High-Karma users vote on platform fees and features
    -   *Why*: True community ownership
-   🔲 **Blockchain Integration?**: 
    -   *Detail*: Maybe. Or maybe just stick to Postgres.
    -   *Why*: Let's not over-engineer yet. Prove value first.

---

## Progress Notes

-   **2026-01**: Completed repository registration system with full GitHub integration
-   See [Archive](../archive/) for historical implementation details
