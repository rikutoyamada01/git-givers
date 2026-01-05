
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { handleMergedPR } from '../../src/app/api/webhooks/github/route';
import prisma from '../../src/lib/prisma';


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
    $transaction: vi.fn((callback) => callback(prisma)),
  },
}));

describe('Replay Attack Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockRepo = {
    id: 'repo-1',
    full_name: 'test/repo',
    registeredById: 'owner-id',
    stargazersCount: 10,
  };

  const mockPullRequest = {
    number: 1,
    body: 'Closes #1',
    user: { // Solver
        id: 12345,
        login: 'solver-user',
    },
    merged: true,
  };

  const mockSender = { id: 999 };

  const mockIssue = {
    id: 'issue-1',
    number: 1,
    repositoryId: 'repo-1',
    authorGithubId: 67890,
    state: 'open', // Initially Open
    boosts: [{ amount: 100 }],
  };

  const mockSolverAccount = {
      user: {
          id: 'solver-id',
          username: 'solver',
          karma: 0,
      }
  };

  it('should prevent double payout if webhook is sent twice', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(prisma.repository.findUnique).mockResolvedValue(mockRepo as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(prisma.issue.findFirst).mockResolvedValue(mockIssue as any); // Returns OPEN issue
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(prisma.account.findFirst).mockResolvedValue(mockSolverAccount as any);

    // 1. First Webhook
    await handleMergedPR(mockPullRequest, { ...mockRepo, id: 100 }, mockSender);
    
    // Expect Payout
    expect(prisma.user.update).toHaveBeenCalledTimes(1);

    // 2. Second Webhook (Replay)
    // IMPORTANT: In a real scenario, the DB state would have changed to 'closed'.
    // Here we mock the DB state change by returning a 'closed' issue for the second call.
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(prisma.issue.findFirst).mockResolvedValue({
        ...mockIssue,
        state: 'closed', // Changed to CLOSED by first call
    } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

    await handleMergedPR(mockPullRequest, { ...mockRepo, id: 100 }, mockSender);

    // BUG: If fixed, it should STILL be 1. If buggy, it might be 2 (if it ignores state).
    // Or if checking transaction history.
    
    // The current implementation blindly pays out if it finds the issue, 
    // unless we explicitly check for 'closed' state or existing transaction.
    
    // We want the total calls to remain 1
    expect(prisma.user.update).toHaveBeenCalledTimes(1);
  });
});
