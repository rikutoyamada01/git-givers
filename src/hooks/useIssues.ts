import useSWR from 'swr';
import { Issue } from '@/components/dashboard/types';
import { fetcher } from '@/lib/fetcher';

export function useIssues() {
    const { data, error, mutate, isLoading } = useSWR<Issue[]>('/api/issues', fetcher, {
        revalidateOnFocus: true,     // Revalidate when focusing the window
        revalidateOnReconnect: true, // Revalidate when regaining connection
        refreshInterval: 0,          // Disable auto-polling (based on user requirement)
        dedupingInterval: 5000,      // Dedup requests within 5 seconds
    });

    return {
        issues: data || [],
        isLoading,
        isError: error,
        mutate,
    };
}
