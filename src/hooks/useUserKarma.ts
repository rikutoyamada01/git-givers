import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';

export interface UserData {
    id: string;
    name?: string;
    image?: string;
    karma: number;
}

export function useUserKarma() {
    const { data, error, mutate, isLoading } = useSWR<UserData>('/api/users', fetcher, {
        revalidateOnFocus: true,
        revalidateOnReconnect: true,
    });

    // Zombie Session handling is now managed by <SessionGuard /> in the layout.
    // We strictly return the error state here so the guard can react to it.

    return {
        user: data,
        isLoading,
        isError: error,
        mutate,
    };
}
