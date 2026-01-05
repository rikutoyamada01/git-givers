
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { POST as boostHandler } from '../../src/app/api/boost/route';
import { POST as registerHandler } from '../../src/app/api/repositories/route';
import { NextRequest } from 'next/server';

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
                    html_url: 'http://example.com',
                    description: 'desc',
                    stargazers_count: 0,
                    permissions: { admin: true },
                }
            };
        }
    }
  };
});

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import type { Session } from 'next-auth';

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
        vi.mocked(auth as unknown as () => Promise<Session | null>).mockResolvedValue({ user: { id: 'user-1', accessToken: 'mock', name: null, email: null, image: null }, expires: '2099-01-01' });
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
             vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'user-1', karma: 1000, name: null, username: null, email: null, emailVerified: null, image: null, createdAt: new Date(), updatedAt: new Date() });
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
                 body: JSON.stringify({ name: 'repo' }), // Missing githubId
             });
             const res = await registerHandler(req);
             expect(res.status).toBe(400);
        });
        
        it('should return 409 if repository already exists', async () => {
            vi.mocked(prisma.repository.findUnique).mockResolvedValue({ id: 'exists', githubId: 123, name: 'repo', fullName: 'user/repo', url: 'http://example.com', description: null, stargazersCount: 0, registeredById: 'user-1', createdAt: new Date(), updatedAt: new Date() });
            
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
