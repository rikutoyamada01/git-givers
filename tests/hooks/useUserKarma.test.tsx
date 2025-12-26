import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useUserKarma } from '@/hooks/useUserKarma';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

// Mock fetcher
vi.mock('@/lib/fetcher', () => ({
    fetcher: vi.fn(),
    HttpError: class extends Error {
        status: number;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        info: any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        constructor(m: string, s: number, i: any) { super(m); this.status = s; this.info = i; }
    }
}));

import { fetcher } from '@/lib/fetcher';

describe('useUserKarma', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const createWrapper = () => {
        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });
        // eslint-disable-next-line react/display-name
        return ({ children }: { children: ReactNode }) => (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        );
    };

    it('fetches user data', async () => {
        const mockUser = { id: '1', karma: 100 };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (fetcher as any).mockResolvedValue(mockUser);

        const { result } = renderHook(() => useUserKarma(), { wrapper: createWrapper() });

        await waitFor(() => expect(result.current.user).toEqual(mockUser));
    });

    it('mutate updates cache optimistically', async () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (fetcher as any).mockResolvedValue({ id: '1', karma: 100 });
        
        // Create a wrapper with a captured client to verify cache
        const queryClient = new QueryClient();
         
        const wrapper = ({ children }: { children: ReactNode }) => (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        );

        const { result } = renderHook(() => useUserKarma(), { wrapper });

        await waitFor(() => expect(result.current.user).toEqual({ id: '1', karma: 100 }));

        // Perform optimistic update
        await result.current.mutate({ id: '1', karma: 50 }, { revalidate: false });

        expect(queryClient.getQueryData(['user', 'karma'])).toEqual({ id: '1', karma: 50 });
        // Request didn't change (fetcher not called again for revalidation)
        expect(fetcher).toHaveBeenCalledTimes(1);
    });
});
