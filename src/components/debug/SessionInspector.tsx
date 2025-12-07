'use client';

import { useSession, signOut } from 'next-auth/react';

export function SessionInspector() {
  const { data: session, status } = useSession();

  return (
    <div className="p-4 h-full overflow-auto bg-zinc-50 dark:bg-zinc-925">
      <div className="mb-6 flex items-center justify-between">
         <div className="flex items-center gap-3">
             <div className={`w-3 h-3 rounded-full ${status === 'authenticated' ? 'bg-green-500' : 'bg-red-500'}`} />
             <span className="font-medium text-zinc-700 dark:text-zinc-300">
               Status: <span className="uppercase">{status}</span>
             </span>
         </div>
         {status === 'authenticated' && (
             <button
               onClick={() => signOut()}
               className="px-3 py-1.5 text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded hover:opacity-80 transition-opacity"
             >
               Force Logout
             </button>
         )}
      </div>

      <div className="space-y-4">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
            <div className="px-3 py-2 bg-zinc-100 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-500">
                Session Object
            </div>
            <pre className="p-4 text-xs font-mono text-zinc-700 dark:text-zinc-300 overflow-auto max-h-[400px]">
                {JSON.stringify(session, null, 2)}
            </pre>
        </div>
        
        <div className="text-xs text-zinc-400 text-center">
            Cookie: next-auth.session-token
        </div>
      </div>
    </div>
  );
}
