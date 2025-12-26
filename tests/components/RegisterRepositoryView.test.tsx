
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import RegisterRepositoryView from '@/components/dashboard/views/RegisterRepositoryView' // Default export
import { useSession } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  // eslint-disable-next-line react/display-name
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

// Mock toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

describe('RegisterRepositoryView', () => {
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    
    // Mock Session
    vi.mocked(useSession).mockReturnValue({
      data: { user: { name: 'Test User', email: 'test@example.com', accessToken: 'mock_token' } },
      status: 'authenticated',
      update: vi.fn(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any)
  })

  it('filters out already registered repositories', async () => {
    // Mock Fetch
    vi.spyOn(global, 'fetch').mockImplementation((url) => {
      // 1. Mock GitHub Repos Fetch
      if (typeof url === 'string' && url.includes('api.github.com/user/repos')) {
        return Promise.resolve({
          ok: true,
          json: async () => [
            {
              id: 101,
              name: 'repo-registered',
              full_name: 'test/repo-registered',
              html_url: 'http://github.com/test/repo-registered',
              description: 'This repo is already registered',
              private: false,
              stargazers_count: 10,
            },
            {
              id: 102,
              name: 'repo-new',
              full_name: 'test/repo-new',
              html_url: 'http://github.com/test/repo-new',
              description: 'This is a new repo',
              private: true,
              stargazers_count: 5,
            },
          ],
        } as Response)
      }

      // 2. Mock Registered Repos Fetch
      if (typeof url === 'string' && url.endsWith('/api/repositories')) {
        return Promise.resolve({
          ok: true,
          json: async () => [
            {
              id: 'uuid-1',
              githubId: 101, // matches repo-registered
              name: 'repo-registered',
              full_name: 'test/repo-registered',
            },
            {
                id: 'uuid-2',
                githubId: 999, // some other repo
                name: 'other-repo',
                full_name: 'test/other-repo',
              },
          ],
        } as Response)
      }

      // 3. Mock User Karma Fetch (via useUserKarma hook SWR)
      // Note: useUserKarma uses useSWR which uses fetcher. fetcher calls fetch.
      if (typeof url === 'string' && url.endsWith('/api/users')) {
          return Promise.resolve({
              ok: true,
              json: async () => ({
                  karma: 1000
              })
          } as Response)
      }

      return Promise.reject(new Error(`Unhandled fetch: ${url}`))
    })

    render(<RegisterRepositoryView onCancel={mockOnCancel} />, { wrapper: createWrapper() })

    // Wait for loading to finish
    await waitFor(() => {
        expect(screen.queryByText('Loading repositories...')).not.toBeInTheDocument()
    })

    // Expect "repo-new" to be visible
    expect(screen.getByText('test/repo-new')).toBeInTheDocument()

    // Expect "repo-registered" NOT to be visible (filtered out)
    expect(screen.queryByText('test/repo-registered')).not.toBeInTheDocument()
  })

  it('displays all repos if registered repos fetch fails (fallback)', async () => {
      // Mock Fetch
      vi.spyOn(global, 'fetch').mockImplementation((url) => {
        if (typeof url === 'string' && url.includes('api.github.com/user/repos')) {
          return Promise.resolve({
            ok: true,
            json: async () => [
              {
                id: 101,
                name: 'repo-registered',
                full_name: 'test/repo-registered',
                html_url: 'http://github.com/test/repo-registered',
                description: 'This repo is already registered',
                stargazers_count: 10,
              }
            ],
          } as Response)
        }
  
        if (typeof url === 'string' && url.endsWith('/api/repositories')) {
            // Simulate failure
          return Promise.resolve({
            ok: false,
            status: 500,
          } as Response)
        }

        if (typeof url === 'string' && url.endsWith('/api/users')) {
            return Promise.resolve({ ok: true, json: async () => ({ karma: 1000 }) } as Response)
        }
  
        return Promise.reject(new Error(`Unhandled fetch: ${url}`))
      })
  
      render(<RegisterRepositoryView onCancel={mockOnCancel} />, { wrapper: createWrapper() })
  
      await waitFor(() => {
          expect(screen.queryByText('Loading repositories...')).not.toBeInTheDocument()
      })
  
      // Should show the repo since filter failed
      expect(screen.getByText('test/repo-registered')).toBeInTheDocument()
    })
})
