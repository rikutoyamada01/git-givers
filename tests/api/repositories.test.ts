/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from "vitest"
import { NextRequest } from "next/server"
import { POST, GET } from "@/app/api/repositories/route"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { mockSession, mockPrismaRepository, mockPrismaUser } from "../helpers"
import type { Session } from "next-auth"

// Mock auth
vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}))

// Mock prisma
// Mock prisma
vi.mock("@/lib/prisma", () => ({
  default: {
    repository: {
      findUnique: vi.fn(),
      create: vi.fn(),
      findMany: vi.fn(),
    },
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    transaction: {
      create: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(prisma)),
  },
}))

describe("API /api/repositories", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Default authenticated session
    vi.mocked(auth as unknown as () => Promise<Session | null>).mockResolvedValue(mockSession())
  })

  // POST /api/repositories
  describe("POST /api/repositories", () => {
    it("should return 401 if user is not authenticated", async () => {
      vi.mocked(auth as unknown as () => Promise<Session | null>).mockResolvedValue(null)

      const request = new NextRequest("http://localhost/api/repositories", {
        method: "POST",
        body: JSON.stringify({
          githubId: 123,
          name: "test-repo",
          fullName: "user/test-repo",
          url: "http://github.com/user/test-repo",
          description: "A test repository",
        }),
      })
      const response = await POST(request)

      expect(response.status).toBe(401)
      await expect(response.json()).resolves.toEqual({ message: "Unauthorized" })
    })

    it("should return 400 if required fields are missing", async () => {
      const request = new NextRequest("http://localhost/api/repositories", {
        method: "POST",
        body: JSON.stringify({
          githubId: 123,
          name: "test-repo",
          // Missing fullName and url
        }),
      })
      const response = await POST(request)

      expect(response.status).toBe(400)
      await expect(response.json()).resolves.toEqual({ message: "Missing required repository fields" })
    })

    it("should return 409 if repository is already registered", async () => {
      vi.mocked(prisma.repository.findUnique).mockResolvedValue(
        mockPrismaRepository({ githubId: 123 })
      )

      const request = new NextRequest("http://localhost/api/repositories", {
        method: "POST",
        body: JSON.stringify({
          githubId: 123,
          name: "test-repo",
          fullName: "user/test-repo",
          url: "http://github.com/user/test-repo",
          description: "A test repository",
        }),
      })
      const response = await POST(request)

      expect(response.status).toBe(409)
      await expect(response.json()).resolves.toEqual({ message: "Repository already registered" })
      expect(prisma.repository.findUnique).toHaveBeenCalledWith({ where: { githubId: 123 } })
    })

    it("should successfully register a new repository", async () => {
      vi.mocked(prisma.repository.findUnique).mockResolvedValue(null)
      vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: "testUserId", karma: 100 } as any)
      vi.mocked(prisma.user.update).mockResolvedValue({ id: "testUserId", karma: 50 } as any)
      vi.mocked(prisma.transaction.create).mockResolvedValue({ id: 1 } as any)
      
      const newRepo = mockPrismaRepository({
        id: "newRepoId",
        githubId: 456,
        name: "new-repo",
        fullName: "user/new-repo",
        url: "http://github.com/user/new-repo",
        description: "A new test repository",
        stargazersCount: 0,
      })
      vi.mocked(prisma.repository.create).mockResolvedValue(newRepo)

      const request = new NextRequest("http://localhost/api/repositories", {
        method: "POST",
        body: JSON.stringify({
          githubId: 456,
          name: "new-repo",
          fullName: "user/new-repo",
          url: "http://github.com/user/new-repo",
          description: "A new test repository",
        }),
      })
      const response = await POST(request)

      expect(response.status).toBe(201)
      expect(response.status).toBe(201)
      await expect(response.json()).resolves.toEqual(expect.objectContaining({
        id: newRepo.id,
        githubId: newRepo.githubId,
        name: newRepo.name,
        fullName: newRepo.fullName,
        url: newRepo.url,
        description: newRepo.description,
        registeredById: newRepo.registeredById,
      }))
      expect(prisma.repository.create).toHaveBeenCalledWith({
        data: {
          githubId: 456,
          name: "new-repo",
          fullName: "user/new-repo",
          url: "http://github.com/user/new-repo",
          description: "A new test repository",
          stargazersCount: 0,
          registeredBy: {
            connect: {
              id: "testUserId",
            },
          },
        },
      })
    })

    it("should return 500 on internal server error during registration", async () => {
      vi.mocked(prisma.repository.findUnique).mockResolvedValue(null)
      vi.mocked(prisma.repository.create).mockRejectedValue(new Error("Database error"))

      const request = new NextRequest("http://localhost/api/repositories", {
        method: "POST",
        body: JSON.stringify({
          githubId: 789,
          name: "error-repo",
          fullName: "user/error-repo",
          url: "http://github.com/user/error-repo",
          description: "An error test repository",
        }),
      })
      const response = await POST(request)

      expect(response.status).toBe(500)
      await expect(response.json()).resolves.toEqual({ message: "Internal server error" })
    })
  })

  // GET /api/repositories
  describe("GET /api/repositories", () => {
    it("should return 401 if user is not authenticated", async () => {
      vi.mocked(auth as unknown as () => Promise<Session | null>).mockResolvedValue(null)


      const response = await GET({ url: "http://localhost/api/repositories" } as any)

      expect(response.status).toBe(401)
      await expect(response.json()).resolves.toEqual({ message: "Unauthorized" })
    })

    it("should return a list of registered repositories for an authenticated user", async () => {
      const mockRepositories = [
        mockPrismaRepository({
          id: "repo1",
          githubId: 1,
          name: "repo-one",
          registeredBy: mockPrismaUser(),
          createdAt: new Date("2023-01-02"), // Newer
        }),
        mockPrismaRepository({
          id: "repo2",
          githubId: 2,
          name: "repo-two",
          registeredBy: mockPrismaUser(),
          createdAt: new Date("2023-01-01"), // Older
        }),
      ]
      
      vi.mocked(prisma.repository.findMany).mockResolvedValue(mockRepositories)


      const response = await GET({ url: "http://localhost/api/repositories" } as any)

      expect(response.status).toBe(200)
      await expect(response.json()).resolves.toEqual(
        mockRepositories.map((repo) => expect.objectContaining({
          id: repo.id,
          githubId: repo.githubId,
          name: repo.name,
          fullName: repo.fullName,
          url: repo.url,
          description: repo.description,
          registeredById: repo.registeredById,
        }))
      )
    })

    it("should return 500 on internal server error during fetching repositories", async () => {
      vi.mocked(prisma.repository.findMany).mockRejectedValue(new Error("Database error"))


      const response = await GET({ url: "http://localhost/api/repositories" } as any)

      expect(response.status).toBe(500)
      await expect(response.json()).resolves.toEqual({ message: "Internal server error" })
    })
  })
})
