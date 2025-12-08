import Link from 'next/link';
import React from 'react';
import { useNotImplemented } from '@/hooks/useNotImplemented';
import { NotImplementedDialog } from '@/components/ui/NotImplementedDialog';
import Image from 'next/image';

interface DashboardFooterProps {
  onNavigate: (page: string) => void;
}

export const DashboardFooter: React.FC<DashboardFooterProps> = () => {
  const { isOpen, featureName, showNotImplemented, closeNotImplemented } = useNotImplemented();

  return (
    <>
      <NotImplementedDialog isOpen={isOpen} onClose={closeNotImplemented} featureName={featureName} />
      <footer className="mt-auto py-6 max-w-[1280px] mx-auto px-4 md:px-6 w-full border-t border-brand-border">
        <div className="flex flex-col md:flex-row items-center gap-4 md:justify-between text-xs text-brand-muted">
          <div className="flex items-center gap-2 order-2 md:order-1">
            <Link 
               href="/"
               className="cursor-pointer hover:text-brand-text transition-colors p-1 rounded-full hover:bg-brand-panel" 
               title="Go to Home"
            >
               <Image src="/icon.png" alt="GitGivers Logo" width={24} height={24} className="object-contain" />
            </Link>
            <span>&copy; {new Date().getFullYear()} GitGivers Project.</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 order-1 md:order-2 font-medium">
              <Link href="/" className="hover:text-brand-accent hover:underline">Top (LP)</Link>
              <Link href="/docs" className="hover:text-brand-accent hover:underline">Docs</Link>
              <Link href="/guidelines" className="hover:text-brand-accent hover:underline">Guidelines</Link>
              <button onClick={() => showNotImplemented('Blog')} className="hover:text-brand-accent hover:underline">Blog</button>
              <button onClick={() => showNotImplemented('About')} className="hover:text-brand-accent hover:underline">About</button>
              <button onClick={() => showNotImplemented('Terms')} className="hover:text-brand-accent hover:underline">Terms</button>
              <button onClick={() => showNotImplemented('Privacy')} className="hover:text-brand-accent hover:underline">Privacy</button>
              <button onClick={() => showNotImplemented('Contact')} className="hover:text-brand-accent hover:underline">Contact</button>
          </div>
        </div>
      </footer>
    </>
  );
};
