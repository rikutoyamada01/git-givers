import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetcher, HttpError } from '@/lib/fetcher';

export interface UserData {
    id: string;
    name?: string;
    image?: string;
    karma: number;
}

export function useUserKarma() {
    const queryClient = useQueryClient();
    const queryKey = ['user', 'karma'];

     
    const { data, error, isLoading } = useQuery<UserData, HttpError>({
        queryKey,
        queryFn: () => fetcher('/api/users'),
        // SWR behavior mapping:
        // revalidateOnFocus: true (default)
        // revalidateOnReconnect: true (default)
    });

    // Emulate SWR's mutate function
    const mutate = async (newData?: UserData, options?: { revalidate?: boolean }) => {
        if (newData !== undefined) {
            // Optimistic update
            queryClient.setQueryData(queryKey, newData);
            
            // If revalidation is not explicitly disabled, or if it is requested
            if (options?.revalidate !== false) {
                 await queryClient.invalidateQueries({ queryKey });
            }
            return newData;
        } else {
            // Just revalidate
            return queryClient.invalidateQueries({ queryKey });
        }
    };

    return {
        user: data,
        isLoading,
        isError: error,
        mutate,
    };
}
