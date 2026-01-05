
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { POST as boostHandler } from '../../src/app/api/boost/route';
import { POST as registerHandler } from '../../src/app/api/repositories/route';
import { NextRequest } from 'next/server';

// Mock auth
vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}));

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

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

// Mock Prisma
vi.mock('@/lib/prisma', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
    },
    issue: {
      findUnique: vi.fn(),
    },
    repository: {
        findUnique: vi.fn(),
    }
  },
}));

describe('Edge Case & Input Validation Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(auth).mockResolvedValue({ user: { id: 'user-1' } } as any);
    });

    describe('Boost API', () => {
        it('should reject negative amount', async () => {
            const req = new NextRequest('http://localhost/api/boost', {
                method: 'POST',
                body: JSON.stringify({ issueId: 'iss-1', amount: -100 }),
            });
            const res = await boostHandler(req);
            expect(res.status).toBe(400); // Bad Request
            const json = await res.json();
            expect(json.message).toBe('Invalid boost parameters');
        });

        it('should reject zero amount', async () => {
            const req = new NextRequest('http://localhost/api/boost', {
                method: 'POST',
                body: JSON.stringify({ issueId: 'iss-1', amount: 0 }),
            });
            const res = await boostHandler(req);
            expect(res.status).toBe(400);
        });

        it('should handle missing fields', async () => {
             const req = new NextRequest('http://localhost/api/boost', {
                method: 'POST',
                body: JSON.stringify({ amount: 100 }), // missing issueId
            });
            const res = await boostHandler(req);
            expect(res.status).toBe(400);
        });
        
         it('should return 404 for non-existent issue', async () => {
             vi.mocked(prisma.user.findUnique).mockResolvedValue({ karma: 1000 } as any);
             vi.mocked(prisma.issue.findUnique).mockResolvedValue(null);

             const req = new NextRequest('http://localhost/api/boost', {
                method: 'POST',
                body: JSON.stringify({ issueId: 'missing-issue', amount: 100 }),
            });
            const res = await boostHandler(req);
            expect(res.status).toBe(404);
        });
    });

    describe('Repository Registration API', () => {
        it('should reject missing required fields', async () => {
             const req = new NextRequest('http://localhost/api/repositories', {
                 method: 'POST',
                 body: JSON.stringify({ githubId: 123 }), // Missing name, url, etc.
             });
             const res = await registerHandler(req);
             expect(res.status).toBe(400);
        });
        
        it('should return 409 if repository already exists', async () => {
            vi.mocked(prisma.repository.findUnique).mockResolvedValue({ id: 'exists' } as any);
            
             const req = new NextRequest('http://localhost/api/repositories', {
                 method: 'POST',
                 body: JSON.stringify({ 
                     githubId: 123, 
                     name: 'repo', 
                     fullName: 'user/repo', 
                     url: 'http://example.com' 
                 }), 
             });
             const res = await registerHandler(req);
             expect(res.status).toBe(409);
        });
    });
});
