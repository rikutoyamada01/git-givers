import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useIssuesQuery } from '@/hooks/useIssuesQuery';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Mock fetcher
vi.mock('@/lib/fetcher', () => ({
    fetcher: vi.fn(),
}));

import { fetcher } from '@/lib/fetcher';

describe('useIssuesQuery', () => {
    const createWrapper = () => {
        const queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });
        // eslint-disable-next-line react/display-name
        return ({ children }: { children: ReactNode }) => (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        );
    };

    it('returns initial loading state', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (fetcher as any).mockImplementation(() => new Promise(() => {})); // Never resolves
        const { result } = renderHook(() => useIssuesQuery(), { wrapper: createWrapper() });
        
        expect(result.current.isLoading).toBe(true);
        expect(result.current.issues).toEqual([]);
    });

    it('returns data on success', async () => {
        const mockIssues = [{ id: 1, title: 'Test Issue' }];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (fetcher as any).mockResolvedValue(mockIssues);

        const { result } = renderHook(() => useIssuesQuery(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(result.current.issues).toEqual(mockIssues);
        expect(result.current.isError).toBeNull();
    });

    it('returns error on failure', async () => {
        const mockError = new Error('Failed to fetch');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (fetcher as any).mockRejectedValue(mockError);

        const { result } = renderHook(() => useIssuesQuery(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.isError).toBeTruthy());
        
        expect(result.current.issues).toEqual([]);
    });
});
