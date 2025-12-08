# GitGivers Documentation: The Internals Book

Welcome to the GitGivers library. This documentation is structured to be read like a technical book ("Doujinshi"), guiding you from concept to implementation.

## 📚 Table of Contents

### [1. Getting Started (Setup)](getting-started/)
The forge logic. How to build the environment.
-   **[Appendix A-1: Local Setup](getting-started/01-local-setup.md)**: Start here.
-   **[Appendix A-2: Production Guide](getting-started/02-production-guide.md)**: How to deploy.

### [2. Architecture (The Core)](architecture/)
The engine room. "Why" we built it this way.
-   **[Chapter 1: Introduction](architecture/01-introduction.md)**: The philosophy and concepts.
-   **[Chapter 2: System Architecture](architecture/02-system-architecture.md)**: Next.js, Vercel, and the Stack.
-   **[Chapter 3: Database Design](architecture/03-database-design.md)**: The Prisma schema and ERO.
-   **[Chapter 4: Core Logic](architecture/04-core-logic.md)**: The Karma math and State Machines.

### [3. Guidelines (The Law)](guidelines/)
How to contribute without breaking things.
-   **[Appendix B-1: Coding Standards](guidelines/01-coding-standards.md)**: Naming, TS patterns, State management.
-   **[Appendix B-2: Workflow](guidelines/02-workflow-protocols.md)**: Git, PRs, and Reviews.
-   **[Appendix B-3: AI Collaboration](guidelines/03-ai-collaboration.md)**: How to use LLMs responsibly.

### [4. Planning (The Future)](planning/)
Where we are going.
-   **[Chapter 5: Grand Roadmap](planning/01-grand-roadmap.md)**: Phase 1 to Moonshot.
-   *Archive*: Older brainstorming docs are kept here for reference.

### [5. Archive (The Past)](archive/)
-   **Decision Records (ADRs)**: Important decisions like renames or stack choices.
-   **Legacy Docs**: Old specs that have been superseded.

---

## 🛠 Documentation Operations

### Directory Structure & Naming
We enforce a strict structure to keep this "Book" readable.

1.  **Categorization**: Every file must live in a subdirectory (`architecture`, `getting-started`, etc.). Root `docs/` is for this index only.
2.  **Ordering**: Files should have a number prefix (e.g., `01-`, `02-`) if they are meant to be read in order (Chapters).
    -   Exceptions: "Appendix" style docs can use descriptive names or `appendix-` prefixes, but we serve them via numbered files (e.g., `01-local-setup`) to maintain sorting.
3.  **Casing**: Always use `kebab-case.md`.
    -   Good: `01-system-architecture.md`
    -   Bad: `01_SystemArchitecture.md`

### How to Update
-   **Small Fixes**: Edit the existing file directly.
-   **New Features**:
    -   If it's a major logic change, update **Chapter 4** (`04-core-logic.md`).
    -   If it's a new DB model, update **Chapter 3** (`03-database-design.md`).
-   **New Guide**: Add it to `guidelines/` or `getting-started/` and add a link here.

### Writing Style (Variable Tone)
We use a "Technical Doujinshi" style:
-   **Engaging**: Don't be a robot. Use "We", "You", and metaphors (Forge, Engine Room).
-   **Opinionated**: Explain *why* (e.g., "Why we decided against Remix").
-   **Visual**: Use mermaid diagrams liberally.
