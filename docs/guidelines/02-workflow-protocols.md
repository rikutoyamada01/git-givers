# Appendix B-2: The Rituals (Workflow Protocols)

Great code alone doesn't ship products. Great *collaboration* does.
This document outlines how we work together, Git, and how we merge.

## 1. The Git Flow

### 1.1 Branching Strategy
We use a simple Feature Branch workflow.

-   **`main`**: The holy grail. Production-ready code. Deployable at any time.
-   **`feature/*`**: Where the magic happens.
    -   Example: `feature/user-profile-v2`
    -   Example: `feature/fix-login-bug`

### 1.2 Conventional Commits
Your commit message is a letter to the future. Make it readable.
We follow [Conventional Commits](https://www.conventionalcommits.org/).

**Format**: `type(scope): description`

-   **`feat`**: A new feature (correlates with MINOR in SemVer).
    -   `feat(auth): add google oauth provider`
-   **`fix`**: A bug fix (correlates with PATCH in SemVer).
    -   `fix(navbar): resolve layout shift on mobile`
-   **`docs`**: Documentation only changes.
-   **`style`**: Formatting, missing semi colons, etc; no production code change.
-   **`refactor`**: A code change that neither fixes a bug nor adds a feature.
    -   `refactor(db): optimize user query performance`
-   **`test`**: Adding missing tests or correcting existing tests.
-   **`chore`**: Maintenance tasks, dependency updates.

> **Why?** This allows us to auto-generate Changelogs and determine semantic version numbers automatically.

## 2. Pull Request (PR) Etiquette

### 2.1 The Description
"Fixed stuff" is not a description. Use this template:

```markdown
## What's Changed
- Added a new 'Profile' component.
- Connected to the `/api/user` endpoint.

## Why
Users need to see their own stats.

## Screenshots (if UI)
[Link to image or drag & drop here]

## Checklist
- [ ] Tests added
- [ ] Lint passed
```

### 2.2 The Self-Review
Before you ask others to review your code, review it yourself.
1.  Read the diff on GitHub/GitLab.
2.  Did you leave `console.log`?
3.  Did you leave `TODO` comments that should be done now?
4.  Is the variable naming clear?

### 2.3 The Reviewer's Duty
Reviewing is as important as coding.
-   **Be Kind**: Critique the code, not the person.
    -   Bad: "Why did you do this?"
    -   Good: "This might be cleaner if we extracted it to a utility function."
-   **Look for Logic**: Linters catch syntax. You catch *logic* errors and *security* holes.

## 3. Testing Strategy

### 3.1 Unit Tests (Vitest)
-   Target: Utility functions, intricate calculations (like our Karma logic).
-   Goal: High coverage on "business logic".

### 3.2 Integration/Component Tests
-   Target: Critical UI paths (Login, Payment flow).
-   We use `react-testing-library`.
-   **Rule**: Test *behavior*, not implementation.
    -   Bad: "Check if the component has a state variable named `isOpen`."
    -   Good: "Clicking the button updates the text to 'Open'."
