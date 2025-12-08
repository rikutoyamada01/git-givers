# Appendix B-1: The Code of Conduct (Coding Standards)

> "Code is read much more often than it is written." — Python Design Guidelines

In GitGivers, we treat code as a communication tool. It's not just about making the computer do things; it's about telling the next developer (who might be you in 3 months) *intent*.

## 1. General Principles

### 1.1 TypeScript First (Strict Mode)
We don't just "use" TypeScript; we rely on it.
-   **Rule**: `any` is strictly prohibited.
-   **Why?**: `any` silences the compiler, effectively turning off the lights in a room full of furniture. You *will* stub your toe.
-   **Alternative**: Use `unknown` if you truly don't know the shape, then narrow it with type guards. Use Zod schema inference for API data.

### 1.2 Functional Components Only
-   **Rule**: Use React Functional Components (FC) + Hooks. Class components are legacy.
-   **Style**:
    ```tsx
    // Good
    export const UserProfile = ({ userId }: { userId: string }) => { ... }
    
    // Avoid
    export const UserProfile: React.FC<{ userId: string }> = ({ userId }) => { ... }
    ```
    *Why?* The `React.FC` type has some historic baggage (like implicit `children`). Explicit prop typing is cleaner.

### 1.3 Server Components by Default
Next.js App Router flips the script.
-   **Default**: Every component is a Server Component unless you say otherwise.
-   **When to use 'use client'**:
    -   You need `useState`, `useEffect`, `useRef`.
    -   You need event listeners (`onClick`, `onChange`).
    -   You need browser-only APIs (`window`, `localStorage`).
-   **Optimization Tip**: Don't make the *entire* page a Client Component. Push the interactivity down to the leaves of the component tree.
    -   *Bad*: `page.tsx` has `"use client"`.
    -   *Good*: `page.tsx` (Server) fetches data -> `<InteractiveButton />` (Client).

## 2. Naming Conventions: The Art of labeling

Naming is the hardest problem in Computer Science. Here's our cheat sheet.

| Item | Case | Example |
| :--- | :--- | :--- |
| **Files (Components)** | PascalCase | `UserProfile.tsx`, `SubmitButton.tsx` |
| **Files (Utilities)** | camelCase | `formatDate.ts`, `useLocalStorage.ts` |
| **Variables/Functions** | camelCase | `getUserData()`, `isLoading` |
| **Constants** | UPPER_SNAKE_CASE | `MAX_RETRY_COUNT`, `DEFAULT_THEME` |
| **Types/Interfaces** | PascalCase | `User`, `ApiResponse` |

> **Pro Tip**: Boolean variables should answer a Yes/No question.
> -   Bad: `valid`, `loading`
> -   Good: `isValid`, `isLoading`, `hasError`

## 3. Directory Structure: Colocation
We follow the **"Keep Related Things Together"** philosophy.
Don't scatter your files by type (`/styles`, `/tests`, `/components`). Group them by **Feature**.

```text
src/
  features/
    profile/
      ProfileCard.tsx
      useProfileData.ts
      profile.test.tsx      <-- Tests live right next to the code!
      profile.module.css    <-- Styles too (if using modules)
```
*Why?* When you delete a feature, you delete one folder. No zombie code left behind in utils/ or logic/.

## 4. Styling: Tailwind CSS
We write CSS, but we write it in our HTML.
-   **Utility First**: Use utility classes. They limit your choices, which creates consistency.
-   **No Magic Numbers**:
    -   Bad: `w-[230px]` (Why 230? Why not 228?)
    -   Good: `w-56`, `w-60` (Stick to the scale).
-   **Ordering**: Use the VS Code extension to auto-sort, or follow:
    1.  Layout (`flex`, `grid`, `absolute`)
    2.  Spacing (`m-4`, `p-2`)
    3.  Sizing (`w-full`, `h-screen`)
    4.  Typography (`text-lg`, `font-bold`)
    5.  Visuals (`bg-red-500`, `rounded`)

## 5. State Management
"State is the root of all evil." — Keep it local.

1.  **Server State**: Data from the DB. Fetch it in Server Components. Pass it down via props. You don't need Redux for this.
2.  **URL State**: The URL is the ultimate global state. Search params (`?tab=settings`) are shareable. Use them.
3.  **Local State**: `useState`. Specific to one component.
4.  **Global Client State**: `Context` / `Zustand`. Use sparingly. Only for things truly global like "Dark Mode" or "Current User Session".

## 6. Database & API
-   **Prisma**: Our ORM. It generates types from your DB schema. Use them!
-   **Zod**: The gatekeeper.
    -   Validate **API Inputs**: Never trust what the frontend sends you.
    -   Validate **Forms**: Give users instant feedback before they hit submit.
