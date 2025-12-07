'use client';

import dynamic from 'next/dynamic';

const DevToolbar = dynamic(() => import('./DevToolbar'), { ssr: false });

export function DevToolsLoader() {
  return <DevToolbar />;
}
