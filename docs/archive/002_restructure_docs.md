# 002. Documentation Restructuring

Date: 2025-12-08

## Status

Accepted

## Context

The `docs` directory has grown to contain a large number of files with flat structure, making it difficult for new contributors to find relevant information. Mixed naming conventions (UpperSnakeCase, Numbered_SnakeCase, etc.) added to the confusion.

## Decision

We will restructure the `docs` directory into logical subdirectories and enforce kebab-case naming for better readability and maintainability.

### New Structure

- **`getting-started/`**: Guides for local setup, production, and OAuth.
- **`architecture/`**: System design, diagrams, and core logic explanations.
- **`guidelines/`**: Coding rules, AI guidelines, and contribution rules.
- **`planning/`**: Roadmap, feature ideas, and issue summaries.
- **`archive/`**: Deprecated or superseded documents.

### Naming Convention

- Use `kebab-case` for all new documentation files.
- Example: `CODING_RULE.md` -> `coding-rules.md`.

## Consequences

- **Positive**: Easier navigation, clearer categorization, consistent file naming.
- **Negative**: Existing links in Issues or PRs might break (mitigated by updating `README` and main entry points).
