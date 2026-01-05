
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { POST as boostHandler } from '../../src/app/api/boost/route';
import { POST as registerHandler } from '../../src/app/api/repositories/route';
import { NextRequest, NextResponse } from 'next/server';

// Mock next/server
vi.mock("next/server", () => {
  return {
    NextRequest: class {
        url: string;
        headers: Headers;
        _body: any;

        constructor(url: string, init: any) { 
            this.url = url; 
            this.headers = new Headers(init?.headers);
            this._body = init?.body;
        }
        
        async json() { return typeof this._body === 'string' ? JSON.parse(this._body) : this._body; }
        async text() { return typeof this._body === 'string' ? this._body : JSON.stringify(this._body); }
    },
    NextResponse: {
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
    }
  },
}));

describe('Concurrency Tests (Mocked)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should use a transaction for boosting to prevent double spend', async () => {
        // Setup valid request
        vi.mocked(auth).mockResolvedValue({ user: { id: 'user-1' } } as any);
        vi.mocked(prisma.user.findUnique).mockResolvedValue({ karma: 100 } as any);
        vi.mocked(prisma.issue.findUnique).mockResolvedValue({
            id: 'iss-1',
            state: 'open',
            repository: { registeredById: 'user-1' }
        } as any);

        const req = new NextRequest('http://localhost/api/boost', {
            method: 'POST',
            body: JSON.stringify({ issueId: 'iss-1', amount: 100 }),
        });

        await boostHandler(req);

        // CRITICAL CHECK: Did we use $transaction?
        expect(prisma.$transaction).toHaveBeenCalled();
    });
    
    it('should use a transaction for repo registration to prevent double charge', async () => {
        vi.mocked(auth).mockResolvedValue({ user: { id: 'user-1' } } as any);
        // Valid karma for registration (500)
        vi.mocked(prisma.user.findUnique).mockResolvedValue({ karma: 1000 } as any);
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
