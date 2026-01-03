/* eslint-disable @typescript-eslint/no-explicit-any */

import { vi, describe, it, expect, beforeEach } from 'vitest';
import { handleMergedPR } from '../../src/app/api/webhooks/github/route';
import prisma from '../../src/lib/prisma';
import { NextResponse } from 'next/server';

// Mock prisma
vi.mock('../../src/lib/prisma', () => ({
  default: {
    repository: {
      findUnique: vi.fn(),
    },
    issue: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    account: {
        findFirst: vi.fn(),
    },
    user: {
        update: vi.fn(),
    },
    transaction: {
        create: vi.fn(),
    },
    boost: {
        create: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(prisma)),
  },
}));

// Mock validateIssuePayout to simply return valid true to check our route logic purely
// Actually route logic calls it but also has its own strict checks.
// We are testing the strict checks in route.ts.

describe('handleMergedPR', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockRepo = {
    id: 'repo-1',
    full_name: 'test/repo',
    registeredById: 'owner-user-id',
    stargazersCount: 10,
  };

  const mockPullRequest = {
    number: 1,
    body: 'Closes #1',
    user: { // PR Author (Solver)
        id: 12345, // GitHub ID
        login: 'solver-user',
    },
    merged: true,
  };

  const mockSender = { // Trigger-er (Merger)
      id: 99999,
      login: 'maintainer-user',
  };

  const mockIssue = {
    id: 'issue-1',
    number: 1,
    repositoryId: 'repo-1',
    authorGithubId: 67890, // Issue Author (Not Solver)
    authorLogin: 'issue-creator',
    boosts: [],
  };

  const mockSolverAccount = {
      user: {
          id: 'solver-user-id', // GitGivers User ID
          username: 'solver-user',
          karma: 0,
      }
  };

  it('should process payout for valid solver', async () => {
    vi.mocked(prisma.repository.findUnique).mockResolvedValue(mockRepo as any);
    vi.mocked(prisma.issue.findFirst).mockResolvedValue(mockIssue as any);
    vi.mocked(prisma.account.findFirst).mockResolvedValue(mockSolverAccount as any);

    const response = await handleMergedPR(mockPullRequest, { ...mockRepo, id: 100 }, mockSender); // GitHub Repo ID is number usually, but here we mock
    
    // Check internal logic flow
    // 1. Repo registered? Yes.
    // 2. Issue linked? Yes.
    // 3. Issue found? Yes.
    // 4. Solver account found? Yes.
    // 5. Anti-gaming?
    //    - Solver(12345) != Author(67890). OK.
    //    - Solver(solver-user-id) != Owner(owner-user-id). OK.
    
    // Should call transaction
    expect(prisma.$transaction).toHaveBeenCalled();
    expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: 'solver-user-id' },
        data: { karma: { increment: expect.any(Number) } }, // 100 * 2.0 or something
    }));

    const json = await (response as NextResponse).json();
    expect(json).toEqual(expect.objectContaining({ message: 'Payout processed' }));
  });

  it('should skip payout if Solver is Issue Author (Self-Dealing)', async () => {
    vi.mocked(prisma.repository.findUnique).mockResolvedValue(mockRepo as any);
    
    // Issue Author IS Solver
    const selfDealingIssue = { ...mockIssue, authorGithubId: 12345 }; 
    vi.mocked(prisma.issue.findFirst).mockResolvedValue(selfDealingIssue as any);
    vi.mocked(prisma.account.findFirst).mockResolvedValue(mockSolverAccount as any);

    const response = await handleMergedPR(mockPullRequest, { ...mockRepo, id: 100 }, mockSender);

    expect(prisma.$transaction).not.toHaveBeenCalled();
    const json = await (response as NextResponse).json();
    expect(json.message).toContain('Payout skipped: Self-dealing (Solver is Issue Author)');
  });

  it('should skip payout if Solver is Repo Owner (Self-Dealing)', async () => {
     // Repo Owner IS Solver
    const selfDealingRepo = { ...mockRepo, registeredById: 'solver-user-id' };
    vi.mocked(prisma.repository.findUnique).mockResolvedValue(selfDealingRepo as any);
    vi.mocked(prisma.issue.findFirst).mockResolvedValue(mockIssue as any);
    vi.mocked(prisma.account.findFirst).mockResolvedValue(mockSolverAccount as any);

    const response = await handleMergedPR(mockPullRequest, { ...mockRepo, id: 100 }, mockSender);

    expect(prisma.$transaction).not.toHaveBeenCalled();
    const json = await (response as NextResponse).json();
    expect(json.message).toContain('Payout skipped: Self-dealing (Solver is Repo Owner)');
  });
});
