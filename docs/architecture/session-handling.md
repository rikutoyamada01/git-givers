# Session Handling Architecture

This document describes the session management and error handling architecture in Git-Givers, specifically focusing on "Zombie Sessions" and the user experience updates.

## Overview

We use **NextAuth.js** (v5) for authentication, persisting sessions via HTTP-only cookies. However, discrepancies can occur between the authentication state (Cookie) and the application state (Database), leading to "Zombie Sessions".

## The "Zombie Session" Problem

A Zombie Session occurs when:
1.  **Auth Cookie Exists**: The user has a valid `authjs.session-token` cookie.
2.  **User Missing in DB**: The corresponding `User` record in the database has been deleted (e.g., via manual reset or `prisma/seed.js`).

### Previous Behavior (Issues)
-   `useSWR` fetched `/api/users`.
-   API returned `404 Not Found` (Correct).
-   Hook triggered `signOut()` **immediately**.
-   **Result**: The user was redirected to `/login` without explanation, creating a confusing loop or flash.

## New Architecture

We moved from immediate, silent failure to a **guided error handling flow**.

### 1. Fatal Error Interception (`SessionGuard`)

The `SessionGuard` component monitors key SWR hooks (`useUserKarma`) for fatal errors (e.g., 404).

-   **Location**: `src/components/auth/SessionGuard.tsx`
-   **Logic**:
    -   Watch `useUserKarma().error`.
    -   If error status is `404` (User Not Found), trigger redirect.
    -   **Redirect Target**: `/session-error` (Generic Error Landing Page).

### 2. Error Landing Page (`/session-error`)

Instead of a modal or immediate sign-out, we send the user to a dedicated landing page.

-   **Location**: `src/app/session-error/page.tsx`
-   **Design**: Full-page layout using global `Navbar` and `Footer`.
-   **Purpose**:
    -   Inform the user of the inconsistency ("Session Data Mismatch").
    -   Provide clear actions.
-   **Actions**:
    -   **Securely Sign Out**: Redirects to `/signout` page.
    -   **Return Home**: Attempts to go back to dashboard/home.
    -   **Report Bug**: External link to GitHub Issues.

### 3. Reliable Sign Out (`/signout`)

The sign-out page was refactored to ensure client-side cleanup.

-   **Location**: `src/app/signout/page.tsx`
-   **Type**: Client Component (`"use client"`).
-   **Logic**:
    -   Uses `next-auth/react`'s `signOut()`.
    -   Ensures browser cookies and client state are cleared.
    -   **Redirect**: After sign-out, redirects to **Home (`/`)**.

## Flow Diagram

```mermaid
graph TD
    A[User Visits Dashboard] --> B{Valid Cookie?}
    B -- Yes --> C[Fetch User Data /api/users]
    B -- No --> D[Redirect to Login]
    
    C -->|200 OK| E[Show Dashboard]
    C -->|404 (Zombie)| F[SessionGuard Intercepts]
    
    F --> G[Redirect to /session-error]
    G --> H[User clicks 'Sign Out']
    H --> I[Redirect to /signout]
    I --> J[Execute Client-Side signOut]
    J --> K[Redirect to Home (/)]
```
