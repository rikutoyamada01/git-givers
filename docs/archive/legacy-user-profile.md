# User Profile in GitKarma

This document explains how the GitKarma user profile works: what is stored, what is editable, and how it syncs with GitHub.

## 1. Data Model

The core fields used by the profile are:

- `id`: Internal user ID (cuid)
- `name`: Display name in GitKarma (editable in app)
- `username`: GitHub username, kept in sync with GitHub (read‑only in app)
- `image`: Avatar URL used in GitKarma (editable in app, GitHub avatar as default)
- `karma`: Current total Karma
- `_count.transactionsSent`: Number of Karma transactions sent
- `_count.transactionsReceived`: Number of Karma transactions received

These fields live in the `User` model in `prisma/schema.prisma`.

## 2. GitHub Sync Behaviour

GitHub information is used only as a **source of truth for identity**, not for rendering the full GitHub profile.

- **Username**
  - On every sign‑in, `profile.login` (GitHub username) is synced to `User.username`.
  - The user cannot change this from GitKarma; it always reflects the current GitHub username.

- **Name / Avatar**
  - On first sign‑in (or while still empty), GitHub profile values are used as defaults:
    - `User.name` ← `profile.name`
    - `User.image` ← `profile.avatar_url`
  - After the user edits `name` or `avatar` in GitKarma, those fields are **no longer overwritten** by GitHub.

Sync logic is implemented in `src/lib/auth.ts` using the `events.signIn` hook from NextAuth.

## 3. Profile API

The profile page uses the `/api/users` endpoint:

- `GET /api/users`
  - Requires authentication.
  - Returns the current `User` plus `_count.transactionsSent` and `_count.transactionsReceived`.

- `PATCH /api/users`
  - Requires authentication.
  - Accepts:
    - `name?: string`
    - `image?: string` (URL)
  - Validates input with `zod` and returns the updated `User`.
  - `username` is **not** updatable via this API; it is GitHub‑only.

Implementation is in `src/app/api/users/route.ts`.

## 4. Dashboard Profile UI

The dashboard profile view is implemented in `src/components/dashboard/views/ProfileView.tsx` and shows:

- Left side:
  - Avatar (editable via URL)
  - Display name (`name`, editable)
  - GitHub username (`username`, read‑only, synced from GitHub)
  - GitKarma Stats:
    - Total Karma
    - Karma Sent (`transactionsSent` count)
    - Karma Received (`transactionsReceived` count)

- Right side:
  - GitKarma‑specific activity overview:
    - Heatmap‑style visualisation (currently simulated)
    - Timeline of recent Karma‑related events (currently mocked text)

The UI only surfaces **GitKarma‑specific data**; GitHub‑native metrics (followers, stars, repositories, etc.) are intentionally omitted.

## 5. Future Extensions

Potential extensions, if needed:

- Replace the simulated heatmap and timeline with real data from:
  - GitKarma `Transaction` records
  - Optional GitHub API calls tied to GitKarma activity
- Add public, shareable profiles (e.g., `/users/:id`) reusing the same data model but with a read‑only view.
- Attach additional GitKarma‑specific fields (e.g., per‑user preferences) as new columns on `User`.
