import { vi, describe, it, expect, beforeEach } from 'vitest';
import { POST as registerHandler } from '../../src/app/api/repositories/route';
import { NextRequest } from "next/server";

// 1. Mock next/server
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

// 2. Mock auth
// We'll mock the return value per test if needed, but set a default here
const mockSession = {
    user: {
        id: 'user-1',
        accessToken: 'mock-gh-token',
    }
};
vi.mock('@/lib/auth', () => ({
  auth: vi.fn(() => Promise.resolve(mockSession)),
}));

// 3. Mock Prisma
const mockTx = {
    user: { update: vi.fn() },
    transaction: { create: vi.fn() },
    repository: { create: vi.fn((data) => Promise.resolve({ id: 'new-repo-id', ...data.data })) } 
};

vi.mock('@/lib/prisma', () => ({
  default: {
    repository: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    transaction: {
        create: vi.fn(),
    },
    $transaction: vi.fn((cb) => cb(mockTx)),
  },
}));

// 4. Mock Octokit
// Since it is dynamically imported, we assume the test environment handles it via vi.mock if we do it globally
const mockRequest = vi.fn();
vi.mock("octokit", () => {
    return {
        Octokit: class {
            constructor() {}
            request = mockRequest;
        }
    };
});

// 5. Mock GitHub Sync
vi.mock("@/lib/github-sync", () => ({
    syncRepositoryIssues: vi.fn(),
}));

import prisma from '@/lib/prisma';

describe('Repository Registration Security', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Default User Karma (Sufficient)
        // @ts-expect-error: Mocking partial return type
        vi.mocked(prisma.user.findUnique).mockResolvedValue({ karma: 1000 });
        // Default Repo not exists
        vi.mocked(prisma.repository.findUnique).mockResolvedValue(null);
    });

    it('should reject if user is not admin of the repo (Ownership Verification)', async () => {
        // Mock GitHub API returning permissions.admin = false
        mockRequest.mockResolvedValue({
            data: {
                id: 12345,
                permissions: { admin: false, push: true, pull: true }, // NOT ADMIN
                stargazers_count: 50,
                full_name: 'test/repo',
            }
        });

        const req = new NextRequest("http://localhost/api/repositories", {
            method: "POST",
            body: JSON.stringify({ githubId: 12345 })
        });

        const res = await registerHandler(req);
        
        expect(res.status).toBe(403);
        const json = await res.json();
        expect(json.message).toContain("must be an admin");
    });

    it('should use stargazers_count from GitHub, ignoring anything from client (Star Spoofing)', async () => {
        // Mock GitHub API returning permissions.admin = true AND 100 stars
        mockRequest.mockResolvedValue({
            data: {
                id: 12345,
                permissions: { admin: true },
                stargazers_count: 100, // REAL VALUE
                name: 'repo',
                full_name: 'test/repo',
                html_url: 'http://github.com/test/repo',
                description: 'desc'
            }
        });

        const req = new NextRequest("http://localhost/api/repositories", {
            method: "POST",
            body: JSON.stringify({ 
                githubId: 12345,
                stargazersCount: 0 // SPOOFED VALUE (trying to get 3x multiplier)
            })
        });

        const res = await registerHandler(req);

        expect(res.status).toBe(201);
        
        // Verify what was passed to prisma.create
        expect(mockTx.repository.create).toHaveBeenCalledWith(expect.objectContaining({
            data: expect.objectContaining({
                stargazersCount: 100, // CHECK: Must be 100 (from GitHub), NOT 0 (from Client)
                fullName: 'test/repo',
            })
        }));
    });
});
