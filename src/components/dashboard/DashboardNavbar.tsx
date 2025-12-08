import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Zap, Plus, ChevronDown, Bell, Ghost, LogOut, Settings, User, X, Search, GitPullRequest, Inbox } from 'lucide-react';
import { ThemeToggle } from '../ThemeToggle';
import { DashboardView } from './types';
import { RECENT_REPOS } from './mockData';
import { useNotImplemented } from '@/hooks/useNotImplemented';
import { NotImplementedDialog } from '@/components/ui/NotImplementedDialog';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

interface DashboardNavbarProps {
  onNavigate: (page: string) => void;
  karma: number;
  onCreateClick: () => void;
  onHistoryClick: () => void;
  onSettingsClick: () => void;
  onProfileClick: () => void;
  onSearch: (query: string) => void;
  currentView: DashboardView;
  onViewChange: (view: DashboardView) => void;
  userImage?: string;
}

const DashboardNavbar: React.FC<DashboardNavbarProps> = ({ 
  onNavigate, 
  karma, 
  onCreateClick, 
  onHistoryClick,
  onSettingsClick,
  onProfileClick,
  onSearch,
  currentView,
  onViewChange,
  userImage
}) => {
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { isOpen, featureName, showNotImplemented, closeNotImplemented } = useNotImplemented();
  const { data: session } = useSession();
  const sessionUser = session?.user as
    | ({ name?: string | null; image?: string | null; username?: string | null })
    | undefined;

  const userName = sessionUser?.name ?? sessionUser?.username ?? 'Guest';
  const displayUserImage =
    userImage ||
    sessionUser?.image ||
    (sessionUser?.username ? `https://github.com/${sessionUser.username}.png` : undefined);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch(searchQuery);
      setIsMobileMenuOpen(false);
    }
  };

  const handleMobileNav = (view: DashboardView) => {
    onViewChange(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <NotImplementedDialog isOpen={isOpen} onClose={closeNotImplemented} featureName={featureName} />
      <header className="bg-brand-panel py-3 px-4 md:px-6 border-b border-brand-border flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button 
            className="md:hidden text-brand-muted hover:text-brand-text"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>
          <Link 
            href="/"
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <Image src="/icon.png" alt="GitKarma Logo" width={32} height={32} className="object-contain" />
            </div>
            <span className="font-bold text-brand-text text-sm hidden md:block group-hover:text-brand-accent">GitKarma</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-1.5 ml-2">
            <div className="relative">
              <input 
                ref={inputRef}
                type="text" 
                placeholder="Type / to search" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-background border border-brand-border rounded-md py-1 px-3 text-sm text-brand-text w-64 focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] focus:outline-none transition-all placeholder-[#8b949e]"
              />
              <div className="absolute right-2 top-1.5 border border-brand-border rounded px-1.5 text-[10px] text-brand-muted">/</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 text-sm font-bold text-brand-text ml-2">
            <button onClick={() => showNotImplemented('Pull Requests')} className="px-2 hover:text-brand-accent">Pull requests</button>
            <button onClick={() => showNotImplemented('Issues')} className="px-2 hover:text-brand-accent">Issues</button>
            <button onClick={() => showNotImplemented('Codespaces')} className="px-2 hover:text-brand-accent">Codespaces</button>
            <button onClick={() => showNotImplemented('Marketplace')} className="px-2 hover:text-brand-accent">Marketplace</button>
            <button onClick={() => showNotImplemented('Explore')} className="px-2 hover:text-brand-accent">Explore</button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Karma Display */}
          <button className="md:hidden flex items-center gap-1.5 px-2 py-0.5 border border-brand-border rounded-md bg-background" onClick={onHistoryClick}>
            <Zap className="w-3 h-3 text-[#e3b341]" />
            <span className="text-xs font-medium text-brand-text">{karma}</span>
          </button>

          <div className="relative">
            <button 
              onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
              className="border border-brand-border rounded-md p-1 cursor-pointer hover:border-[#8b949e] transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4 text-brand-text" />
              <ChevronDown className="w-3 h-3 text-brand-text" />
            </button>
            
            {isCreateMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsCreateMenuOpen(false)}></div>
                <div className="absolute right-0 top-full mt-2 w-48 bg-brand-panel border border-brand-border rounded-md shadow-xl z-20 py-1">
                  <button 
                    onClick={() => { onCreateClick(); setIsCreateMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-brand-text hover:bg-[#1f6feb] hover:text-white"
                  >
                    New Karma Request
                  </button>
                  <div className="border-t border-brand-border my-1"></div>
                  <button 
                    onClick={() => { onViewChange('register-repo'); setIsCreateMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-brand-text hover:bg-[#1f6feb] hover:text-white"
                  >
                    Register Repository
                  </button>
                </div>
              </>
            )}
          </div>
          
          <div className="mr-2 hidden md:block">
            <ThemeToggle />
          </div>

          <div className="relative">
            <Bell className="w-4 h-4 text-brand-text" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#1f6feb] rounded-full border-2 border-brand-panel"></span>
          </div>
          <div className="relative ml-1">
            <button 
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <div className="w-5 h-5 rounded-full bg-[#30363d] flex items-center justify-center border border-brand-border overflow-hidden">
                {displayUserImage ? (
                  <Image
                    src={displayUserImage}
                    alt={userName}
                    width={20}
                    height={20}
                    className="w-5 h-5 object-cover"
                  />
                ) : (
                  <Ghost className="w-3 h-3 text-brand-muted" />
                )}
              </div>
              <ChevronDown className="w-3 h-3 text-brand-text" />
            </button>

            {isUserMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)}></div>
                <div className="absolute right-0 top-full mt-2 w-48 bg-brand-panel border border-brand-border rounded-md shadow-xl z-20 py-1">
                  <div className="px-4 py-2 text-xs text-brand-muted">
                    Signed in as <strong className="text-brand-text">{userName}</strong>
                  </div>
                  <div className="border-t border-brand-border my-1"></div>
                  <button 
                      onClick={() => { onProfileClick(); setIsUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-brand-text hover:bg-[#1f6feb] hover:text-white flex items-center gap-2"
                  >
                    <User className="w-3 h-3" />
                    Your Profile
                  </button>
                  <button 
                    onClick={() => { onHistoryClick(); setIsUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-sm text-brand-text hover:bg-[#1f6feb] hover:text-white flex items-center gap-2"
                  >
                    <Zap className="w-3 h-3" />
                    Transactions
                  </button>
                  <button 
                      onClick={() => { onSettingsClick(); setIsUserMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-sm text-brand-text hover:bg-[#1f6feb] hover:text-white flex items-center gap-2"
                  >
                      <Settings className="w-3 h-3" />
                      Settings
                  </button>
                  <div className="border-t border-brand-border my-1"></div>
                  <button 
                    onClick={() => onNavigate('home')}
                    className="w-full text-left px-4 py-2 text-sm text-brand-text hover:bg-[#1f6feb] hover:text-white flex items-center gap-2"
                  >
                    <LogOut className="w-3 h-3" />
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-[300px] h-full bg-brand-panel border-r border-brand-border flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-brand-border flex items-center justify-between">
               <div className="flex items-center gap-2">
                 <div className="w-8 h-8 flex items-center justify-center">
                    <Image src="/icon.png" alt="GitKarma Logo" width={32} height={32} className="object-contain" />
                 </div>
                 <span className="font-bold text-white text-sm">GitKarma</span>
               </div>
               <button onClick={() => setIsMobileMenuOpen(false)} className="text-brand-muted">
                 <X className="w-6 h-6" />
               </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
               {/* Search */}
               <div className="relative mb-6">
                 <input 
                   type="text" 
                   placeholder="Search..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   onKeyDown={handleKeyDown}
                   className="w-full bg-background border border-brand-border rounded-md py-2 pl-9 pr-3 text-sm text-brand-text focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] focus:outline-none"
                 />
                 <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-brand-muted" />
               </div>

               {/* Dashboard Navigation */}
               <div className="mb-6">
                 <h3 className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2 px-2">Dashboard</h3>
                 <nav className="space-y-1">
                   <button 
                      onClick={() => handleMobileNav('feed')}
                      className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium ${currentView === 'feed' ? 'bg-[#1f6feb]/10 text-brand-text' : 'text-brand-text hover:bg-[#21262d]'}`}
                   >
                     <Search className="w-4 h-4 text-brand-muted" />
                     Overview
                   </button>
                   <button 
                      onClick={() => handleMobileNav('contributions')}
                      className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium ${currentView === 'contributions' ? 'bg-[#1f6feb]/10 text-brand-text' : 'text-brand-text hover:bg-[#21262d]'}`}
                   >
                     <GitPullRequest className="w-4 h-4 text-brand-muted" />
                     Contributions
                   </button>
                   <button 
                      onClick={() => handleMobileNav('my-requests')}
                      className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium ${currentView === 'my-requests' ? 'bg-[#1f6feb]/10 text-brand-text' : 'text-brand-text hover:bg-[#21262d]'}`}
                   >
                     <Inbox className="w-4 h-4 text-brand-muted" />
                     My Requests
                   </button>
                   <button 
                      onClick={() => handleMobileNav('history')}
                      className={`w-full flex items-center gap-3 px-2 py-2 rounded-md text-sm font-medium ${currentView === 'history' ? 'bg-[#1f6feb]/10 text-brand-text' : 'text-brand-text hover:bg-[#21262d]'}`}
                   >
                     <Zap className="w-4 h-4 text-brand-muted" />
                     Transaction History
                   </button>
                 </nav>
               </div>

               <div className="border-t border-brand-border my-4"></div>

               {/* Repositories */}
               <div className="mb-6">
                 <h3 className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-2 px-2">Top Repositories</h3>
                 <nav className="space-y-1">
                   {RECENT_REPOS.slice(0, 5).map((repo, i) => (
                      <div key={i} className="flex items-center gap-2 px-2 py-2 rounded-md text-sm font-medium text-brand-text hover:bg-[#21262d] cursor-pointer">
                        <div className="w-4 h-4 rounded-full bg-[#30363d] flex items-center justify-center shrink-0 overflow-hidden">
                           <Image src={`https://github.com/${repo.split('/')[0]}.png`} width={16} height={16} className="object-cover opacity-80" alt="" />
                        </div>
                        <span className="truncate">{repo}</span>
                      </div>
                   ))}
                 </nav>
               </div>

               <div className="border-t border-brand-border my-4"></div>
               
               {/* General Nav */}
               <nav className="space-y-2 text-sm font-medium text-brand-text">
                  <button onClick={() => showNotImplemented('Pull Requests')} className="block w-full text-left px-2 py-1.5 hover:text-[#58a6ff]">Pull requests</button>
                  <button onClick={() => showNotImplemented('Issues')} className="block w-full text-left px-2 py-1.5 hover:text-[#58a6ff]">Issues</button>
                  <button onClick={() => showNotImplemented('Codespaces')} className="block w-full text-left px-2 py-1.5 hover:text-[#58a6ff]">Codespaces</button>
                  <button onClick={() => showNotImplemented('Explore')} className="block w-full text-left px-2 py-1.5 hover:text-[#58a6ff]">Explore</button>
               </nav>

               <div className="mt-8 pt-4 border-t border-brand-border">
                  <button 
                    onClick={() => { onNavigate('home'); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-2 text-sm text-brand-muted hover:text-[#da3633] px-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashboardNavbar;
