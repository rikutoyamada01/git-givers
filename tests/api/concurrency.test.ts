
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { POST as boostHandler } from '../../src/app/api/boost/route';
import { POST as registerHandler } from '../../src/app/api/repositories/route';
import { NextRequest } from 'next/server';

// Mock next/server
vi.mock("next/server", () => {
  return {
    NextRequest: class {
        url: string;
        headers: Headers;
        _body: unknown;

        constructor(url: string, init: { headers?: HeadersInit; body?: unknown; method?: string }) { 
            this.url = url; 
            this.headers = new Headers(init?.headers);
            this._body = init?.body;
        }
        
        async json() { return typeof this._body === 'string' ? JSON.parse(this._body) : this._body; }
        async text() { return typeof this._body === 'string' ? this._body : JSON.stringify(this._body); }
    },
    NextResponse: {
      json: (body: unknown, init: { status?: number }) => ({
        status: init?.status || 200,
        json: async () => body,
        text: async () => JSON.stringify(body),
      }),
    },
  };
});

// Mock auth
vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}));

// Mock octokit
vi.mock("octokit", () => {
  return {
    Octokit: class {
        async request() {
            return {
                data: {
                    id: 123,
                    name: 'repo',
                    full_name: 'user/repo',
                    html_url: 'https://github.com/user/repo',
                    description: 'desc',
                    stargazers_count: 0,
                    permissions: { admin: true },
                }
            };
        }
    }
  };
});

// Real Prisma Client is tricky to mock for race conditions because the race happens in the DB.
// Testing race conditions with mocks is mostly testing if we use `prisma.$transaction`.
// However, we can simulate the "read" then "write" gap if our code isn't transactional.

// Since we can't easily spin up a real Postgres for this unit test environment,
// we will verify that `prisma.$transaction` is CALLED, which implies safety (assuming Prisma works).
// If we were NOT using $transaction, we would see individual calls.

import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

vi.mock('@/lib/prisma', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    issue: {
      findUnique: vi.fn(),
    },
    repository: {
      findUnique: vi.fn(),
       create: vi.fn(), // Missing in previous mock?
    },
    $transaction: vi.fn(async (callback) => {
        // Simulate transaction execution
        return await callback(prisma);
    }),
    boost: {
        create: vi.fn(),
    },
    transaction: {
        create: vi.fn(),
    },

  },
}));

describe('Concurrency Tests (Mocked)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should use a transaction for boosting to prevent double spend', async () => {
        // Setup valid request
        // @ts-expect-error: Mocking partial user
        vi.mocked(auth).mockResolvedValue({ user: { id: 'user-1' } });
        vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'user-1', karma: 100, name: null, username: null, email: null, emailVerified: null, image: null, createdAt: new Date(), updatedAt: new Date() });
        const mockIssueWithRepo = {
            id: 'iss-1',
            githubId: 1,
            number: 1,
            title: 'test',
            body: null,
            state: 'open',
            htmlUrl: 'http://example.com',
            repositoryId: 'repo-1',
            authorGithubId: null,
            authorLogin: null,
            assigneeId: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        vi.mocked(prisma.issue.findUnique).mockResolvedValue({
            ...mockIssueWithRepo,
            repository: {
                id: 'repo-1',
                githubId: 1,
                name: 'test-repo',
                fullName: 'user/test-repo',
                url: 'http://example.com',
                description: null,
                stargazersCount: 0,
                registeredById: 'user-1',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        } as typeof mockIssueWithRepo & { repository: { registeredById: string } });


        const req = new NextRequest('http://localhost/api/boost', {
            method: 'POST',
            body: JSON.stringify({ issueId: 'iss-1', amount: 100 }),
        });

        await boostHandler(req);

        // CRITICAL CHECK: Did we use $transaction?
        expect(prisma.$transaction).toHaveBeenCalled();
    });
    
    it('should use a transaction for repo registration to prevent double charge', async () => {
        // @ts-expect-error: Mocking partial user
        vi.mocked(auth).mockResolvedValue({ user: { id: 'user-1', accessToken: 'mock' } });
        // Valid karma for registration (500)
        vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'user-1', karma: 1000, name: null, username: null, email: null, emailVerified: null, image: null, createdAt: new Date(), updatedAt: new Date() });
        vi.mocked(prisma.repository.findUnique).mockResolvedValue(null); // Repo not registered yet

        const req = new NextRequest('http://localhost/api/repositories', {
                 method: 'POST',
                 body: JSON.stringify({ 
                     githubId: 123, 
                     name: 'repo', 
                     fullName: 'user/repo', 
                     url: 'https://github.com/user/repo' 
                 }),
        });

        await registerHandler(req);

        // CRITICAL CHECK: Did we use $transaction?
        expect(prisma.$transaction).toHaveBeenCalled();
    });
});
