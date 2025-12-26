'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';
import { queryClient as globalQueryClient } from '@/lib/react-query';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Ensure QueryClient is stable across renders
  const [client] = useState(() => globalQueryClient);

  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
