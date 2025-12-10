
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { handleMergedPR, validateSignature } from "@/app/api/webhooks/github/route"
import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
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
}))

describe("Webhook Logic: handleMergedPR", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  })

  it("should payout karma for a valid merged PR", async () => {
    // Mocks
    vi.mocked(prisma.repository.findUnique).mockResolvedValue({
        id: "repo_1",
        registeredById: "owner_id",
        stargazersCount: 0,
    } as any);
    
    vi.mocked(prisma.issue.findFirst).mockResolvedValue({
        id: "issue_1",
        repositoryId: "repo_1",
        boosts: [],
    } as any);
    
    vi.mocked(prisma.account.findFirst).mockResolvedValue({
        user: {
            id: "solver_id",
            username: "solver",
        }
    } as any);
    
    const pr = { number: 1, body: "Closes #10", merged: true };
    const repo = { id: 12345, full_name: "test/repo" };
    const sender = { id: 999, login: "solver" };

    const response = await handleMergedPR(pr, repo, sender);
    const json = await response.json();
    
    expect(response.status).toBe(200);
    expect(json.message).toBe("Payout processed");
    expect(json.reward).toBeGreaterThan(0);
    
    // Verify DB calls
    expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: "solver_id" },
        data: { karma: { increment: 300 } } // Base check: 100 * 3.0 multiplier
    }));
  });

  it("should skip payout if repo is not registered", async () => {
    vi.mocked(prisma.repository.findUnique).mockResolvedValue(null);

    const pr = { number: 1, body: "Closes #10", merged: true };
    const repo = { id: 99999, full_name: "unknown/repo" };
    const sender = { id: 999, login: "solver" };

    const response = await handleMergedPR(pr, repo, sender);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.message).toBe("Repository not registered");
  });
});
