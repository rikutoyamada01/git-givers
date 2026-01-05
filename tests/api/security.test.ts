
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { POST as webhookHandler } from '../../src/app/api/webhooks/github/route';
import { POST as boostHandler } from '../../src/app/api/boost/route';
import { POST as registerHandler } from '../../src/app/api/repositories/route';
import { NextRequest } from "next/server";
import { verify } from "@octokit/webhooks-methods";
import type { Session } from "next-auth";

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

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    issue: {
      findUnique: vi.fn(),
    },
    $transaction: vi.fn((cb) => cb({
        user: { update: vi.fn() },
        boost: { create: vi.fn() },
        transaction: { create: vi.fn() },
        repository: { create: vi.fn() }
    })),
  },
}));

// Mock Webhook verify
vi.mock("@octokit/webhooks-methods", () => ({
    verify: vi.fn(),
}));

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

describe('Security Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.GITHUB_WEBHOOK_SECRET = 'test-secret';
    });

    afterEach(() => {
        delete process.env.GITHUB_WEBHOOK_SECRET;
    });

    describe('Webhook Security', () => {
        it('should reject requests with missing signature', async () => {
            const req = {
                headers: { 
                    get: () => null 
                },
                text: async () => JSON.stringify({ action: 'test' }),
                method: 'POST',
                url: 'http://localhost/api/webhooks/github',
            } as unknown as NextRequest;
            // No x-hub-signature-256 header

            const res = await webhookHandler(req);
            expect(res.status).toBe(401);
            const json = await res.json();
            expect(json.message).toBe('Missing signature');
        });

        it('should reject requests with invalid signature', async () => {
            const req = {
                headers: { 
                    get: (key: string) => key === 'x-hub-signature-256' ? 'sha256=invalidSignature' : null
                },
                text: async () => JSON.stringify({ action: 'test' }),
                method: 'POST',
                url: 'http://localhost/api/webhooks/github',
            } as unknown as NextRequest;

            vi.mocked(verify).mockResolvedValue(false);

            const res = await webhookHandler(req);
            expect(res.status).toBe(401);
            const json = await res.json();
            expect(json.message).toBe('Invalid signature');
        });
        
        it('should return 500 if server secret is missing', async () => {
             delete process.env.GITHUB_WEBHOOK_SECRET;
             const req = {
                method: 'POST',
             } as unknown as NextRequest;
             
             const res = await webhookHandler(req);
             expect(res.status).toBe(500);
        });
    });

    describe('API Access Control', () => {
        it('should reject boost requests without login', async () => {
             vi.mocked(auth as unknown as () => Promise<Session | null>).mockResolvedValue(null);
             
             const req = new NextRequest('http://localhost/api/boost', {
                 method: 'POST',
                 body: JSON.stringify({ issueId: 'iss-1', amount: 100 }),
             });
             
             const res = await boostHandler(req);
             expect(res.status).toBe(401);
        });

        it('should reject repo registration without login', async () => {
             vi.mocked(auth as unknown as () => Promise<Session | null>).mockResolvedValue(null);
             
             const req = new NextRequest('http://localhost/api/repositories', {
                 method: 'POST',
                 body: JSON.stringify({ githubId: 123, name: 'repo' }),
             });
             
             const res = await registerHandler(req);
             expect(res.status).toBe(401);
        });
        
        it('should reject boosting an issue in a repo the user does not own', async () => {
             vi.mocked(auth as unknown as () => Promise<Session | null>).mockResolvedValue({ user: { id: 'attacker-id', name: null, email: null, image: null, accessToken: 'mock' }, expires: '2099-01-01' });
             
             // Mock user has enough karma
             vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'attacker-id', karma: 1000, name: null, username: null, email: null, emailVerified: null, image: null, createdAt: new Date(), updatedAt: new Date() });
             
             // Mock Issue with repository relation
             const mockIssue = {
                 id: 'iss-1',
                 githubId: 1,
                 number: 1,
                 title: 'test issue',
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
                 ...mockIssue,
                 repository: {
                     id: 'repo-1',
                     githubId: 1,
                     name: 'test-repo',
                     fullName: 'victim/test-repo',
                     url: 'http://example.com',
                     description: null,
                     stargazersCount: 0,
                     registeredById: 'victim-id',
                     createdAt: new Date(),
                     updatedAt: new Date()
                 }
             } as typeof mockIssue & { repository: { registeredById: string } });
             
             const req = new NextRequest('http://localhost/api/boost', {
                 method: 'POST',
                 body: JSON.stringify({ issueId: 'iss-1', amount: 100 }),
             });
             
             const res = await boostHandler(req);
             expect(res.status).toBe(403);
             const json = await res.json();
             expect(json.message).toBe('You can only boost issues in your own repositories');
        });
    });
});
