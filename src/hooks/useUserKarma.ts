import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

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

    return {
        user: data,
        isLoading,
        isError: error,
        mutate,
    };
}
