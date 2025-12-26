import { QueryClient } from '@tanstack/react-query';


// Centralized error handling for queries
// // Centralized error handling for queries
// const queryErrorHandler = (error: unknown) => {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   const status = (error as any)?.status;
//
//   if (status === 401) {
//     toast.error('Session expired. Please sign in again.');
//     signOut({ callbackUrl: '/login' });
//   } else {
//     // Basic error toast for other errors, can be customized per query if needed
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     const message = (error as any)?.message || 'An error occurred fetching data';
//     // Don't toast 404s as they might be handled by UI (e.g. SessionGuard)
//     if (status !== 404) {
//         toast.error(message);
//     }
//   }
// };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry failed queries 1 time (default is 3)
      retry: 1,
      // Data is fresh for 1 minute
      staleTime: 1000 * 60,
      // Refetch on window focus
      refetchOnWindowFocus: true,
      // Global error handler is not directly supported in v5 via config like SWR
      // But we can use QueryCache / MutationCache for global callbacks if needed.
      // For now, we rely on individual hooks or a wrapper. 
      // However, for migration parity, we can't easily injection global onError here like SWRConfig.
      // We will handle specific critical errors in hooks or specific global handlers if we decide to implement QueryCache callbacks later.
      // NOTE: For now, we will use default behavior and handle critical 401s in a wrapper or individual hooks if not using QueryCache.
      // UPDATE: To match SWRProvider's global error handling, let's use QueryCache global callbacks.
    },
  },
});
