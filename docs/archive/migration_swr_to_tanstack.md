# Migration Record: SWR to TanStack Query

**Date:** 2025-12-25
**Decision:** Migrate data fetching infrastructure from SWR to TanStack Query (v5).

## 1. Context & Motivation

The GitGivers application relies heavily on interacting with both internal APIs (PostgreSQL via Prisma) and external APIs (GitHub). As the application grew from a simple dashboard to a more interactive platform with complex mutation flows (e.g., registering repositories, sending karma), limitations in our initial data fetching strategy became apparent.

We initiated a comparison between our existing solution (SWR) and TanStack Query to determine the best path forward for scalability, maintainability, and developer experience.

## 2. Key Drivers for Migration

Based on our analysis (`comparison_swr_vs_tanstack.md`), the following factors drove the decision to migrate:

### A. Robust Mutation Handling 🏆
*   **SWR**: `useSWRMutation` exists but offers basic functionality. Optimistic updates often require manual cache manipulation which can be error-prone.
*   **TanStack Query**: `useMutation` is a first-class citizen with extensive lifecycle hooks (`onMutate`, `onError`, `onSettled`). This is critical for our application's "Karma" transactions, where UI responsiveness (optimistic updates) and data consistency (rollback on error) are paramount.

### B. Developer Experience & Debugging 🏆
*   **SWR**: Relies on logging or third-party tools.
*   **TanStack Query**: Provides official, powerful **DevTools** out of the box. Being able to visualize cache states, inspect query keys, and manually invalidate queries significantly reduces debugging time and cognitive load.

### C. Granular Cache Control
*   **SWR**: Defaults to aggressive revalidation (e.g., on focus). While configurable, it leans towards "always fresh".
*   **TanStack Query**: Distinguishes between `staleTime` (when to refetch) and `gcTime` (how long to keep unused data). This granular control allows us to optimize API calls to GitHub, avoiding rate limits while keeping the UI snappy.

## 3. Migration Strategy

We adopted an **Incremental Migration Strategy** to mitigate risk:

1.  **Coexistence**: We installed TanStack Query alongside SWR, wrapping the app in both providers.
2.  **Pilot**: We migrated `useIssues` first to validate the pattern without touching critical auth logic.
3.  **Critical Path**: We migrated `useUserKarma` (Auth) next, implementing a compatibility layer for `mutate` to ensure existing UI components didn't break.
4.  **Cleanup**: Once all hooks were ported, we removed SWR and its provider.

## 4. Outcome

*   **Codebase**: Successfully unified all data fetching under TanStack Query.
*   **Performance**: Reduced unnecessary re-renders and API calls via better stale time management.
*   **Stability**: 100% test coverage maintained across the transition.
*   **Future Proofing**: We are now positioned to easily implement features like infinite scrolling and dependent queries using standard, well-documented patterns.

---

> This document serves as a historical record of the architecture change on Dec 25, 2025.
