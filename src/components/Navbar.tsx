"use client";

import React, { useState, useEffect } from 'react';
import { Github, Menu, X, User } from 'lucide-react';
import Image from 'next/image';

import { usePathname, useRouter } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { useNotImplemented } from '@/hooks/useNotImplemented';
import { NotImplementedDialog } from '@/components/ui/NotImplementedDialog';
import { useSession } from 'next-auth/react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, featureName, closeNotImplemented } = useNotImplemented();
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (target: string) => {
    if (target.startsWith('#')) {
      if (pathname !== '/') {
        router.push('/' + target);
      } else {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
        router.push(target);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 border-b ${
        isScrolled || isMobileMenuOpen || pathname !== '/'
          ? 'glass-panel border-brand-border shadow-lg' 
          : 'bg-transparent border-transparent'
      }`}
    >
      <NotImplementedDialog isOpen={isOpen} onClose={closeNotImplemented} featureName={featureName} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-3 group cursor-pointer"
            onClick={() => handleNavClick('/')}
          >

            <div className="relative w-8 h-8 flex items-center justify-center rounded-lg group-hover:rotate-12 transition-transform duration-300">
              <Image src="/icon.png" alt="GitGivers Logo" fill className="object-contain" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              Git<span className="text-brand-accent">Givers</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button onClick={() => handleNavClick('#features')} className="text-brand-text hover:text-brand-accent transition-colors text-sm font-medium">機能</button>
              <button onClick={() => handleNavClick('#how-it-works')} className="text-brand-text hover:text-brand-accent transition-colors text-sm font-medium">仕組み</button>
              <button onClick={() => handleNavClick('/docs')} className={`transition-colors text-sm font-medium ${pathname === '/docs' ? 'text-brand-accent' : 'text-brand-text hover:text-brand-accent'}`}>ドキュメント</button>
              <button onClick={() => handleNavClick('/guidelines')} className={`transition-colors text-sm font-medium ${pathname === '/guidelines' ? 'text-brand-accent' : 'text-brand-text hover:text-brand-accent'}`}>ガイドライン</button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
             <ThemeToggle />
             {session ? (
                <div className="relative">
                  <button 
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 focus:outline-none"
                  >
                    {session.user?.image ? (
                      <Image src={session.user.image} alt="User Avatar" width={32} height={32} className="rounded-full border border-brand-border" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-brand-panel border border-brand-border flex items-center justify-center">
                        <User className="w-4 h-4 text-brand-text" />
                      </div>
                    )}
                  </button>

                  {isUserMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)}></div>
                      <div className="absolute right-0 top-full mt-2 w-48 bg-brand-panel border border-brand-border rounded-md shadow-xl z-20 py-1">
                        <div className="px-4 py-2 text-xs text-brand-muted border-b border-brand-border">
                          Signed in as <br/>
                          <span className="font-bold text-brand-text truncate block">{session.user?.name || session.user?.email}</span>
                        </div>
                        <button 
                          onClick={() => router.push('/dashboard')}
                          className="w-full text-left px-4 py-2 text-sm text-brand-text hover:bg-brand-muted/10 transition-colors"
                        >
                          Dashboard
                        </button>
                        <button 
                          onClick={() => window.location.href = '/api/auth/signout'}
                          className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          Sign out
                        </button>
                      </div>
                    </>
                  )}
                </div>
             ) : (
                <button 
                    onClick={() => handleNavClick('/login')}
                    className="bg-brand-panel hover:bg-brand-panel/80 text-brand-text px-4 py-2 rounded-md border border-brand-border text-sm font-medium flex items-center gap-2 transition-all hover:border-brand-muted shadow-sm"
                >
                  <Github className="w-4 h-4" />
                  Sign in with GitHub
                </button>
             )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-brand-text hover:text-brand-accent p-2"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-brand-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            <button onClick={() => handleNavClick('#features')} className="text-left text-brand-text hover:text-brand-accent block px-3 py-2 rounded-md text-base font-medium">機能</button>
            <button onClick={() => handleNavClick('#how-it-works')} className="text-left text-brand-text hover:text-brand-accent block px-3 py-2 rounded-md text-base font-medium">仕組み</button>
             <button onClick={() => handleNavClick('/docs')} className="text-left text-brand-text hover:text-brand-accent block px-3 py-2 rounded-md text-base font-medium">ドキュメント</button>
             <button onClick={() => handleNavClick('/guidelines')} className="text-left text-brand-text hover:text-brand-accent block px-3 py-2 rounded-md text-base font-medium">ガイドライン</button>
            <div className="px-3 py-2">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-brand-muted">Theme:</span>
                    <ThemeToggle />
                </div>
                {session ? (
                   <div className="space-y-2">
                     <div className="flex items-center gap-3 px-2 py-2">
                        {session.user?.image ? (
                          <Image src={session.user.image} alt="User Avatar" width={32} height={32} className="rounded-full" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-brand-panel border border-brand-border flex items-center justify-center">
                            <User className="w-4 h-4 text-brand-text" />
                          </div>
                        )}
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-brand-text">{session.user?.name}</span>
                            <span className="text-xs text-brand-muted">{session.user?.email}</span>
                        </div>
                     </div>
                     <button 
                        onClick={() => router.push('/dashboard')}
                        className="w-full bg-brand-panel hover:bg-brand-panel/80 text-brand-text px-4 py-3 rounded-md border border-brand-border text-sm font-medium flex items-center justify-center gap-2 transition-all"
                     >
                        Dashboard
                     </button>
                     <button 
                        onClick={() => window.location.href = '/api/auth/signout'}
                        className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 px-4 py-3 rounded-md border border-red-500/20 text-sm font-medium flex items-center justify-center gap-2 transition-all"
                     >
                        Sign out
                     </button>
                   </div>
                ) : (
                   <button 
                      onClick={() => handleNavClick('/login')}
                      className="w-full bg-brand-panel hover:bg-brand-panel/80 text-brand-text px-4 py-3 rounded-md border border-brand-border text-sm font-medium flex items-center justify-center gap-2 transition-all"
                   >
                   <Github className="w-4 h-4" />
                   Sign in with GitHub
                   </button>
                )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
