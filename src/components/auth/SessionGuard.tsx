'use client';

import { useUserKarma } from '@/hooks/useUserKarma';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';

export const SessionGuard = () => {
  const { isError: error } = useUserKarma();
  const router = useRouter();
  const pathname = usePathname();

  // Zombie Session Detection
  useEffect(() => {
    // Don't show guard on public pages or login page or the error page itself
    if (pathname === '/login' || pathname === '/' || pathname === '/session-error') {
       return;
    }

    if (error?.status === 404) {
      router.push('/session-error');
    }
  }, [error, router, pathname]);

  return null;
};
