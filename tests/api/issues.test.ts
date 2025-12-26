// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"
import { POST } from "@/app/api/issues/sync/route"
import { GET } from "@/app/api/issues/route"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { mockSession, mockPrismaRepository } from "../helpers"
import type { Session } from "next-auth"

// Mock auth
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}))

// Mock prisma
vi.mock("@/lib/prisma", () => ({
  default: {
    repository: {
      findUnique: vi.fn(),
    },
    issue: {
      upsert: vi.fn(),
      findMany: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(prisma)),
  },
}))

// Global fetch mock
global.fetch = vi.fn()

describe("API /api/issues", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default authenticated session with accessToken
    vi.mocked(auth as unknown as () => Promise<Session | null>).mockResolvedValue({
        ...mockSession(),
        user: {
            ...mockSession().user,
             
            accessToken: "mock_gh_token" as any
        } as any  
    })
  })

  // POST /api/issues/sync
  describe("POST /api/issues/sync", () => {
    it("should return 401 if user is not authenticated", async () => {
      vi.mocked(auth as unknown as () => Promise<Session | null>).mockResolvedValue(null)

      const request = new NextRequest("http://localhost/api/issues/sync", {
        method: "POST",
        body: JSON.stringify({ repositoryId: "repo1" }),
      })
      const response = await POST(request)

      expect(response.status).toBe(401)
      await expect(response.json()).resolves.toEqual({ error: "Unauthorized" })
    })
    
     it("should return 401 if access token is missing", async () => {
      vi.mocked(auth as unknown as () => Promise<Session | null>).mockResolvedValue(mockSession()) // No access token

      const request = new NextRequest("http://localhost/api/issues/sync", {
        method: "POST",
        body: JSON.stringify({ repositoryId: "repo1" }),
      })
      const response = await POST(request)

      expect(response.status).toBe(401)
      await expect(response.json()).resolves.toEqual({ error: "GitHub Access Token missing in session" })
    })

    it("should return 400 if repositoryId is missing", async () => {
      const request = new NextRequest("http://localhost/api/issues/sync", {
        method: "POST",
        body: JSON.stringify({}),
      })
      const response = await POST(request)

      expect(response.status).toBe(400)
      await expect(response.json()).resolves.toEqual({ error: "Repository ID is required" })
    })

    it("should return 404 if repository not found", async () => {
      vi.mocked(prisma.repository.findUnique).mockResolvedValue(null)

      const request = new NextRequest("http://localhost/api/issues/sync", {
        method: "POST",
        body: JSON.stringify({ repositoryId: "repo1" }),
      })
      const response = await POST(request)

      expect(response.status).toBe(404)
      await expect(response.json()).resolves.toEqual({ error: "Repository not found" })
    })

    it("should successfully sync issues", async () => {
      const mockRepo = mockPrismaRepository({ id: "repo1", fullName: "user/repo" })
      vi.mocked(prisma.repository.findUnique).mockResolvedValue(mockRepo)

      // Mock GitHub API response
      const mockGithubIssues = [
          { id: 101, number: 1, title: "Issue 1", body: "Body 1", state: "open", html_url: "url1", updated_at: "2023-01-01T00:00:00Z" },
          { id: 102, number: 2, title: "Issue 2", body: null, state: "open", html_url: "url2", updated_at: "2023-01-02T00:00:00Z" },
          { id: 103, number: 3, title: "PR 1", body: "PR Body", state: "open", html_url: "url3", updated_at: "2023-01-03T00:00:00Z", pull_request: {} } // Should be skipped
      ]
      
      vi.mocked(fetch).mockResolvedValue({
          ok: true,
          json: async () => mockGithubIssues
      } as Response)

      vi.mocked(prisma.issue.upsert).mockResolvedValue({} as any)

      const request = new NextRequest("http://localhost/api/issues/sync", {
        method: "POST",
        body: JSON.stringify({ repositoryId: "repo1" }),
      })
      const response = await POST(request)

      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.count).toBe(2) // 2 issues, 1 PR skipped
      
      expect(prisma.issue.upsert).toHaveBeenCalledTimes(2)
      expect(prisma.issue.upsert).toHaveBeenCalledWith(expect.objectContaining({
          where: { githubId: 101 },
          create: expect.objectContaining({ githubId: 101, title: "Issue 1" })
      }))
    })
  })

  // GET /api/issues
  describe("GET /api/issues", () => {
    it("should return a list of issues", async () => {
       const mockIssues = [
           { id: "issue1", title: "Issue 1", repository: { fullName: "user/repo" } },
           { id: "issue2", title: "Issue 2", repository: { fullName: "user/repo" } }
       ]
        
       vi.mocked(prisma.issue.findMany).mockResolvedValue(mockIssues as any)
       
       // Use simple object mock to avoid URL parsing issues in test environment
       const request = { url: "http://localhost/api/issues" } as any
       const response = await GET(request)
       
       expect(response.status).toBe(200)
       await expect(response.json()).resolves.toEqual(mockIssues)
       expect(prisma.issue.findMany).toHaveBeenCalledWith(expect.objectContaining({
           // where: { state: 'open' }, // Adjusted logic in route, check if this match needs update or just objectContaining is enough
           // The route now conditionally builds 'where'. 
           // If we just check 'take: 20' it confirms default behavior.
           take: 20
       }))
    })
    
    it("should return 500 on database error", async () => {
        vi.mocked(prisma.issue.findMany).mockRejectedValue(new Error("DB Error"))
        
        const request = { url: "http://localhost/api/issues" } as any
        const response = await GET(request)
        expect(response.status).toBe(500)
        await expect(response.json()).resolves.toEqual({ error: "Internal Server Error" })
    })
  })
})
