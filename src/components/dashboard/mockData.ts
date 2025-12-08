
import { LegacyIssue, MyRequest, RepoIssue, Transaction, UserRepo, ContributedRepo } from "./types";

export const MOCK_ISSUES: LegacyIssue[] = [
  {
    id: 1,
    repo: "facebook/react",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
    title: "Fix hydration mismatch in Suspense boundary",
    desc: "When using lazy loading with SSR, the client hydration fails with a mismatch error on specific boundary conditions. This requires a deep dive into the reconciler.",
    tags: ["Core", "Bug"],
    karma: 450,
    difficulty: "High",
    posted: "2 hours ago",
    language: "TypeScript",
    languageColor: "#3178c6",
    html_url: "https://github.com/facebook/react/issues"
  },
  {
    id: 2,
    repo: "vercel/next.js",
    icon: "https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png",
    title: "Optimize Image component LCP on mobile",
    desc: "The current implementation of the Image component causes a slight delay in LCP on 3G networks. Needs profiling and optimization strategy.",
    tags: ["Performance", "Good First Issue"],
    karma: 120,
    difficulty: "Medium",
    posted: "5 hours ago",
    language: "JavaScript",
    languageColor: "#f1e05a",
    html_url: "https://github.com/vercel/next.js/issues"
  },
  {
    id: 3,
    repo: "rust-lang/rust",
    icon: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Rust_programming_language_black_logo.svg",
    title: "Implement trait alias stabilization",
    desc: "Work towards stabilizing trait aliases. There are several edge cases in the type checker that need to be resolved before stabilization.",
    tags: ["Compiler", "RFC"],
    karma: 800,
    difficulty: "Expert",
    posted: "1 day ago",
    language: "Rust",
    languageColor: "#dea584",
    html_url: "https://github.com/rust-lang/rust/issues"
  }
];

export const RECENT_REPOS = [
  "facebook/react",
  "vercel/next.js",
  "tailwindlabs/tailwindcss",
  "microsoft/typescript",
  "gitkarma/core"
];

export const MY_REPOS: UserRepo[] = [
    { name: "gitkarma/core", private: false, stars: 12, updated: "2 days ago" },
    { name: "gitkarma/frontend", private: false, stars: 8, updated: "5 hours ago" },
    { name: "personal/blog-starter", private: true, stars: 1, updated: "1 week ago" },
    { name: "personal/dotfiles", private: false, stars: 45, updated: "3 months ago" },
];

export const MY_REPO_ISSUES: RepoIssue[] = [
    { id: 101, number: 12, title: "Add dark mode toggle to dashboard", labels: [{name: "enhancement", color: "a2eeef"}], created_at: "2 days ago" },
    { id: 102, number: 15, title: "Fix crash on login when network is slow", labels: [{name: "bug", color: "d73a4a"}, {name: "high-priority", color: "b60205"}], created_at: "5 hours ago" },
    { id: 103, number: 18, title: "Update README with contribution guide", labels: [{name: "documentation", color: "0075ca"}], created_at: "1 week ago" },
    { id: 104, number: 22, title: "Refactor Navigation component", labels: [{name: "refactor", color: "cfd3d7"}], created_at: "1 day ago" },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
    { id: 1, type: 'earned', description: 'PR Merged: Fix hydration mismatch', amount: 450, date: '2 days ago', repo: 'facebook/react' },
    { id: 2, type: 'spent', description: 'Posted bounty: Add dark mode', amount: 200, date: '1 week ago', repo: 'gitkarma/core' },
    { id: 3, type: 'earned', description: 'Good First Issue: Update README', amount: 50, date: '2 weeks ago', repo: 'vercel/next.js' },
    { id: 4, type: 'earned', description: 'Sign-up Bonus', amount: 100, date: '1 month ago' },
    { id: 5, type: 'spent', description: 'Ghost penalty: Inactive on assigned issue', amount: 50, date: '2 months ago', repo: 'unknown/repo' },
];

export const MOCK_MY_REQUESTS: MyRequest[] = [
    { id: 101, title: "Add dark mode toggle to dashboard", repo: "gitkarma/core", bounty: 200, status: 'in_progress', assignee: 'shadcn', created_at: '2 days ago' },
    { id: 102, title: "Fix crash on login when network is slow", repo: "gitkarma/frontend", bounty: 500, status: 'open', created_at: '5 hours ago' },
    { id: 103, title: "Update README with contribution guide", repo: "personal/blog-starter", bounty: 50, status: 'completed', assignee: 'leerob', created_at: '1 week ago' },
];

export const CONTRIBUTED_REPOS: ContributedRepo[] = [
    {
        name: "facebook/react",
        icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
        totalKarmaEarned: 1250,
        prsMerged: 3,
        lastContributed: "2 days ago",
        description: "The library for web and native user interfaces."
    },
    {
        name: "vercel/next.js",
        icon: "https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png",
        totalKarmaEarned: 50,
        prsMerged: 1,
        lastContributed: "2 weeks ago",
        description: "The React Framework for the Web."
    }
];

// Mock issues available for the contributed repos
export const AVAILABLE_CONTRIBUTION_ISSUES: Record<string, LegacyIssue[]> = {
    "facebook/react": [
        {
            id: 201,
            repo: "facebook/react",
            icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
            title: "DevTools: Add profiler grouping",
            desc: "Add ability to group commits in the Profiler tab by interaction.",
            tags: ["DevTools", "Enhancement"],
            karma: 300,
            difficulty: "Medium",
            posted: "1 day ago",
            language: "TypeScript",
            languageColor: "#3178c6",
            html_url: "#"
        },
        {
             id: 202,
             repo: "facebook/react",
             icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1200px-React-icon.svg.png",
             title: "Improve error message for hydration mismatch",
             desc: "The current error message is ambiguous. Provide more context about the tree diff.",
             tags: ["DX", "Good First Issue"],
             karma: 150,
             difficulty: "Medium",
             posted: "3 days ago",
             language: "TypeScript",
             languageColor: "#3178c6",
             html_url: "#"
        }
    ],
    "vercel/next.js": [
        {
            id: 301,
            repo: "vercel/next.js",
            icon: "https://assets.vercel.com/image/upload/v1662130559/nextjs/Icon_dark_background.png",
            title: "Middleware: Fix header modification edge case",
            desc: "Headers modified in middleware are not persisting in specific edge runtime configurations.",
            tags: ["Bug", "Edge"],
            karma: 600,
            difficulty: "High",
            posted: "12 hours ago",
            language: "TypeScript",
            languageColor: "#3178c6",
            html_url: "#"
        }
    ]
};
