# 001. Rename Project to GitGivers

Date: 2025-12-08

## Status

Accepted

## Context

We initially named the project "GitKarma". However, during development, we discovered that a service named `gitkarma.dev` already exists.
Using a name that is already taken by a similar service (even if just a domain) can lead to confusion, SEO issues, and potential trademark conflicts.

## Decision

We decided to rename the project to "**GitGivers**".

The name "GitGivers" reflects the platform's goal of facilitating "giving" back to the open-source community through contributions, rather than just accumulating points.

## Consequences

The rename affects the entire codebase, including configuration files, UI components, and documentation.

### Positive
-   **Uniqueness**: "GitGivers" appears to be available and unused.
-   **Brand Safety**: Avoids conflict with the existing `gitkarma.dev`.
-   **Identity**: Better aligns with the philosophy of contribution.

### Negative
-   **Refactoring Cost**: Requires a comprehensive search-and-replace across the codebase.
-   **Local Directory**: The root directory `git-karma` will remain unchanged to avoid disrupting the local development workspace, potentially causing minor confusion (folder name vs project name).
