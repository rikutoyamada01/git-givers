import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetcher } from '@/lib/fetcher';

export interface Repository {
    id: string;
    githubId: number;
    name: string;
    fullName: string;
    url: string;
    description: string | null;
    stargazersCount: number;
    registeredBy: {
        id: string;
        username: string;
    }
}

export function useRepositoriesQuery(options?: { owned?: boolean; viewer?: boolean }) {
    const queryClient = useQueryClient();
    const queryKey = ['repositories', options];
    
    // Construct query params
    const params = new URLSearchParams();
    if (options?.owned) params.append('owned', 'true');
    if (options?.viewer) params.append('viewer', 'true');
    const queryString = params.toString();

    const { data, error, isLoading } = useQuery<Repository[]>({
        queryKey,
        queryFn: () => fetcher(`/api/repositories${queryString ? `?${queryString}` : ''}`),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    return {
        repositories: data || [],
        isLoading,
        isError: error,
        mutate: () => queryClient.invalidateQueries({ queryKey }),
    };
}
