'use client';

import { SWRConfig } from 'swr';
import { signOut } from 'next-auth/react';
import toast from 'react-hot-toast';
import { ReactNode } from 'react';

// Extract the error handling logic for easier testing/maintenance
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handleError = (error: any) => {
  // Global handling for 401 Unauthorized
  if (error.status === 401) {
    // Only show toast if it's a 401, as this is a global Auth action
    toast.error('Session expired. Please sign in again.');
    
    // Force sign out and redirect to login
    signOut({ callbackUrl: '/login' });
    return;
  }

  // Other errors (404, 500, etc.) are NOT handled globally.
  // They should be handled by the consuming hook or component.
};

export function SWRProvider({ children }: { children: ReactNode }) {
  return (
    <SWRConfig
      value={{
        onError: handleError,
        // Optional: Disable automatic revalidation on focus/reconnect to avoid API spam
        // revalidateOnFocus: false,
        // revalidateOnReconnect: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}
