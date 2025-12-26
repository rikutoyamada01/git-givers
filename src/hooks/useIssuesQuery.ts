import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Issue } from '@/components/dashboard/types';
import { fetcher } from '@/lib/fetcher';

export function useIssuesQuery(options?: { repositoryId?: string }) {
    const queryClient = useQueryClient();
    const queryKey = ['issues', options];

    const params = new URLSearchParams();
    if (options?.repositoryId) params.append('repositoryId', options.repositoryId);
    const queryString = params.toString();

    const { data, error, isLoading } = useQuery<Issue[]>({
        queryKey,
        queryFn: () => fetcher(`/api/issues${queryString ? `?${queryString}` : ''}`),
        // Options matching SWR behavior where applicable
        // SWR: revalidateOnFocus: true (default in Request Query)
        // SWR: revalidateOnReconnect: true (default in React Query)
        // SWR: dedupingInterval: 5000 (React Query uses staleTime)
        staleTime: 5000, 
    });

    return {
        issues: data || [],
        isLoading,
        isError: error,
        // Mimic SWR's mutate. In TanStack Query, we invalidate.
        // Or we can expose a function that behaves like SWR's mutate (optimistic update or revalidation)
        // For simple compatibility, we expose a revalidate function.
        mutate: () => queryClient.invalidateQueries({ queryKey }),
    };
}
