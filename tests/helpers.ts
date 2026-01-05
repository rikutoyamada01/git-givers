import type { Session } from "next-auth"
import type { Repository, User } from "@prisma/client"

export const mockSession = (overrides?: Partial<Session>): Session => {
  return {
    user: {
      id: "testUserId",
      name: "Test User",
      email: "test@example.com",
      image: "https://example.com/avatar.png",
      accessToken: "mock-access-token",
      ...overrides?.user,
    },
    expires: "2099-01-01T00:00:00.000Z",
    ...overrides,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mockPrismaRepository = (overrides?: Partial<Repository> & Record<string, any>): Repository & Record<string, any> => {
  return {
    id: "repo_1",
    githubId: 12345,
    name: "test-repo",
    fullName: "testuser/test-repo",
    url: "https://github.com/testuser/test-repo",
    description: "A test repository",
    stargazersCount: 0,
    registeredById: "testUserId",
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}

export const mockPrismaUser = (overrides?: Partial<User>): User => {
  return {
    id: "testUserId",
    name: "Test User",
    username: "testuser",
    email: "test@example.com",
    emailVerified: null,
    image: "https://example.com/avatar.png",
    karma: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  }
}
