/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { POST } from '@/app/api/repositories/route'
import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { NextRequest } from 'next/server'

// Mock dependencies
vi.mock('@/lib/prisma', () => ({
  default: {
    user: {
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    repository: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
    transaction: {
      create: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(prisma)),
  },
}))

vi.mock('@/lib/auth', () => ({
  auth: vi.fn(),
}))

describe('POST /api/repositories (Karma Logic)', () => {
  const mockUser = {
    id: 'user-1',
    karma: 100,
  }

  const mockRepoData = {
    githubId: 12345,
    name: 'test-repo',
    fullName: 'user/test-repo',
    url: 'https://github.com/user/test-repo',
    description: 'A test repository',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return 401 if user is not authenticated', async () => {
    vi.mocked(auth).mockResolvedValueOnce(null as any)
    const req = new NextRequest('http://localhost/api/repositories', {
      method: 'POST',
    })

    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('should return 400 if required fields are missing', async () => {
    vi.mocked(auth).mockResolvedValueOnce({ user: { id: 'user-1' } } as any)
    const req = new NextRequest('http://localhost/api/repositories', {
      method: 'POST',
      body: JSON.stringify({}),
    })

    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('should return 409 if repository is already registered', async () => {
    vi.mocked(auth).mockResolvedValueOnce({ user: { id: 'user-1' } } as any)
    vi.mocked(prisma.repository.findUnique).mockResolvedValueOnce({ id: 'repo-1' } as any)
    
    const req = new NextRequest('http://localhost/api/repositories', {
      method: 'POST',
      body: JSON.stringify(mockRepoData),
    })

    const res = await POST(req)
    expect(res.status).toBe(409)
  })

  it('should return 403 if user has insufficient Karma', async () => {
    vi.mocked(auth).mockResolvedValueOnce({ user: { id: 'user-1' } } as any)
    vi.mocked(prisma.repository.findUnique).mockResolvedValueOnce(null)
    // User has 40 Karma, cost is 50
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ ...mockUser, karma: 40 } as any)

    const req = new NextRequest('http://localhost/api/repositories', {
      method: 'POST',
      body: JSON.stringify(mockRepoData),
    })

    const res = await POST(req)
    expect(res.status).toBe(403)
    const data = await res.json()
    expect(data.message).toContain('Insufficient Karma')
  })

  it('should successfully register repository and deduct Karma', async () => {
    vi.mocked(auth).mockResolvedValueOnce({ user: { id: 'user-1' } } as any)
    vi.mocked(prisma.repository.findUnique).mockResolvedValueOnce(null)
    // User has 100 Karma
    vi.mocked(prisma.user.findUnique).mockResolvedValueOnce({ ...mockUser } as any)
    
    // Mock transaction results
    vi.mocked(prisma.user.update).mockResolvedValueOnce({ ...mockUser, karma: 50 } as any)
    vi.mocked(prisma.repository.create).mockResolvedValueOnce({ ...mockRepoData, id: 'new-repo-1' } as any)

    const req = new NextRequest('http://localhost/api/repositories', {
      method: 'POST',
      body: JSON.stringify(mockRepoData),
    })

    const res = await POST(req)
    expect(res.status).toBe(201)

    // Verify Prisma calls
    expect(prisma.$transaction).toHaveBeenCalled()
    
    // Check Karma deduction
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { karma: { decrement: 50 } },
    })

    // Check Transaction record creation
    expect(prisma.transaction.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        amount: -50,
        description: expect.stringContaining('Register repository'),
        userId: 'user-1',
      }),
    })

    // Check Repository creation
    expect(prisma.repository.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        githubId: mockRepoData.githubId,
        registeredBy: { connect: { id: 'user-1' } },
      }),
    })
  })
})
