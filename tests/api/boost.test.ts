/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"
import { POST } from "@/app/api/boost/route"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

// Mock Auth
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}))

// Mock Prisma
vi.mock("@/lib/prisma", () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    issue: {
      findUnique: vi.fn(),
    },
    boost: {
      create: vi.fn(),
    },
    transaction: {
      create: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(prisma)),
  },
}))

describe("API /api/boost", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(auth).mockResolvedValue({
        user: { id: "user_1" }
    } as any)
  })

  it("should return 401 if not authenticated", async () => {
    vi.mocked(auth).mockResolvedValue(null as any)
    
    const request = new NextRequest("http://localhost/api/boost", {
        method: "POST",
        body: JSON.stringify({ issueId: "issue_1", amount: 50 }),
    })
    
    const response = await POST(request)
    expect(response.status).toBe(401)
  })

  it("should return 403 if insufficient karma", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user_1",
        karma: 10, // Less than boost amount
    } as any)
    
    const request = new NextRequest("http://localhost/api/boost", {
        method: "POST",
        body: JSON.stringify({ issueId: "issue_1", amount: 50 }),
    })
    
    const response = await POST(request)
    expect(response.status).toBe(403)
  })

  it("should process boost if valid", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue({
        id: "user_1",
        karma: 100,
    } as any)
    
    vi.mocked(prisma.issue.findUnique).mockResolvedValue({
        id: "issue_1",
        number: 1,
        state: "open",
        repositoryId: "repo_1",
    } as any)
    
    vi.mocked(prisma.boost.create).mockResolvedValue({
        id: "boost_1",
        amount: 50,
        userId: "user_1",
        issueId: "issue_1",
    } as any)
    
    const request = new NextRequest("http://localhost/api/boost", {
        method: "POST",
        body: JSON.stringify({ issueId: "issue_1", amount: 50 }),
    })
    
    const response = await POST(request)
    const json = await response.json()
    
    expect(response.status).toBe(201)
    expect(json.id).toBe("boost_1")
    
    // Verify Deduct
    expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: "user_1" },
        data: { karma: { decrement: 50 } }
    }))
    
    // Verify Transaction Log
    expect(prisma.transaction.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
            amount: -50,
            description: "Boosted Issue #1"
        })
    }))
  })
})
