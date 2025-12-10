
export interface Issue {
  id: string; // CUID from DB
  githubId: number;
  number: number;
  title: string;
  body: string | null;
  state: string;
  htmlUrl: string;
  repositoryId: string;
  repository?: RegisteredRepository; // Relation
  createdAt: string;
  updatedAt: string;
  karma?: number; 
}

export interface LegacyIssue {
  id: number;
  repo: string;
  icon: string;
  title: string;
  desc: string;
  tags: string[];
  karma: number;
  difficulty: "High" | "Medium" | "Expert" | "Good First Issue";
  posted: string;
  language: string;
  languageColor: string;
  html_url: string;
}

export interface UserRepo {
    name: string;
    private: boolean;
    stars: number;
    updated: string;
}

export interface RepoIssue {
    id: number;
    title: string;
    labels: { name: string, color: string }[];
    number: number;
    created_at: string;
}

export interface Transaction {
    id: number;
    type: 'earned' | 'spent';
    description: string;
    amount: number;
    date: string;
    repo?: string;
}

export interface MyRequest {
    id: number;
    title: string;
    repo: string;
    bounty: number;
    status: 'open' | 'in_progress' | 'completed';
    assignee?: string;
    created_at: string;
}

export interface ContributedRepo {
    name: string;
    icon: string;
    totalKarmaEarned: number;
    prsMerged: number;
    lastContributed: string;
    description: string;
}

export type DashboardView = 'feed' | 'create' | 'history' | 'my-requests' | 'settings' | 'profile' | 'contributions' | 'search' | 'register-repo';

export interface RegisteredRepository {
    id: string;
    githubId: number;
    name: string;
    fullName: string;
    url: string;
    description: string | null;
    stargazersCount: number;
    registeredBy: {
        id: string;
        name: string | null;
        username: string | null;
        image: string | null;
    };
    createdAt: string;
}
