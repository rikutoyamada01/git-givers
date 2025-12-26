
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { syncRepositoryIssues } from '../../src/lib/github-sync';
import prisma from '../../src/lib/prisma';

// Mock prisma
vi.mock('../../src/lib/prisma', () => ({
  default: {
    repository: {
      findUnique: vi.fn(),
    },
    issue: {
      upsert: vi.fn(),
    },
  },
}));

// Mock fetch
const fetchMock = vi.fn();
global.fetch = fetchMock;

describe('syncRepositoryIssues', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockRepoId = 'repo-123';
  const mockToken = 'gh_token';
  const mockRepo = {
    id: mockRepoId,
    fullName: 'owner/repo',
  };

  it('should throw error if repository is not found', async () => {
    vi.mocked(prisma.repository.findUnique).mockResolvedValue(null);

    await expect(syncRepositoryIssues(mockRepoId, mockToken))
      .rejects.toThrow('Repository not found');
  });

  it('should throw error if GitHub API fails', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(prisma.repository.findUnique).mockResolvedValue(mockRepo as any);
    fetchMock.mockResolvedValue({
      ok: false,
      status: 404,
      text: async () => 'Not Found',
    });

    await expect(syncRepositoryIssues(mockRepoId, mockToken))
      .rejects.toThrow('GitHub API Error: 404 Not Found');
  });

  it('should sync issues successfully', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(prisma.repository.findUnique).mockResolvedValue(mockRepo as any);
    
    const mockIssues = [
      {
        id: 1,
        number: 101,
        title: 'Issue 1',
        body: 'Body 1',
        state: 'open',
        html_url: 'http://github.com/owner/repo/issues/101',
        updated_at: '2023-01-01T00:00:00Z',
      },
      {
        id: 2,
        number: 102, // Pull Request
        title: 'PR 1',
        pull_request: {},
        updated_at: '2023-01-01T00:00:00Z',
      }
    ];

    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockIssues,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    vi.mocked(prisma.issue.upsert).mockResolvedValue({ id: 'issue-db-1' } as any);

    const count = await syncRepositoryIssues(mockRepoId, mockToken);

    expect(count).toBe(1); // Should filter out PR
    expect(prisma.repository.findUnique).toHaveBeenCalledWith({ where: { id: mockRepoId } });
    expect(fetchMock).toHaveBeenCalledWith(
      `https://api.github.com/repos/${mockRepo.fullName}/issues?state=open&per_page=50`,
      expect.objectContaining({
        headers: expect.objectContaining({
            Authorization: `Bearer ${mockToken}`
        })
      })
    );
    expect(prisma.issue.upsert).toHaveBeenCalledTimes(1);
    expect(prisma.issue.upsert).toHaveBeenCalledWith(expect.objectContaining({
        where: { githubId: 1 },
        create: expect.objectContaining({ number: 101, repositoryId: mockRepoId }),
    }));
  });
});
