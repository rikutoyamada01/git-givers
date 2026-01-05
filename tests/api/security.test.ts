
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

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(url: string, init: any) { 
            this.url = url; 
            this.headers = new Headers(init?.headers);
            this._body = init?.body;
        }
        
        async json() { return typeof this._body === 'string' ? JSON.parse(this._body) : this._body; }
        async text() { return typeof this._body === 'string' ? this._body : JSON.stringify(this._body); }
    },
    NextResponse: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      json: (body: any, init: any) => ({
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

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
             vi.mocked(auth).mockResolvedValue(null as unknown as any);
             
             const req = new NextRequest('http://localhost/api/boost', {
                 method: 'POST',
                 body: JSON.stringify({ issueId: 'iss-1', amount: 100 }),
             });
             
             const res = await boostHandler(req);
             expect(res.status).toBe(401);
        });

        it('should reject repo registration without login', async () => {
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
             vi.mocked(auth).mockResolvedValue(null as unknown as any);
             
             const req = new NextRequest('http://localhost/api/repositories', {
                 method: 'POST',
                 body: JSON.stringify({ githubId: 123, name: 'repo' }),
             });
             
             const res = await registerHandler(req);
             expect(res.status).toBe(401);
        });
        
        it('should reject boosting an issue in a repo the user does not own', async () => {
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
             vi.mocked(auth).mockResolvedValue({ user: { id: 'attacker-id' } } as unknown as any);
             
             // Mock user has enough karma
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
             vi.mocked(prisma.user.findUnique).mockResolvedValue({ karma: 1000 } as unknown as any);
             
             // Mock Issue exists but belongs to someone else
             // Mock Issue exists but belongs to someone else
             vi.mocked(prisma.issue.findUnique).mockResolvedValue({
                 id: 'iss-1',
                 state: 'open',
                 repository: {
                     registeredById: 'victim-id', // NOT attacker-id
                 }
             } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
             
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
