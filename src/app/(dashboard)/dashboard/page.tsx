"use client";

import React, { useState, useEffect } from 'react';
import { Search, Inbox, Zap, GitPullRequest } from 'lucide-react';
import { useRouter } from 'next/navigation';

import DashboardNavbar from '../../../components/dashboard/DashboardNavbar';
import { DashboardFooter } from '../../../components/dashboard/DashboardFooter';
import { LeftSidebar, RightSidebar } from '../../../components/dashboard/DashboardSidebar';
import { FeedView } from '../../../components/dashboard/views/FeedView';
import { CreateRequestView, MyRequestsView } from '../../../components/dashboard/views/RequestViews';
import { TransactionHistoryView } from '../../../components/dashboard/views/HistoryView';
import { SettingsView } from '../../../components/dashboard/views/SettingsView';
import { ProfileView } from '../../../components/dashboard/views/ProfileView';
import { ContributedView } from '../../../components/dashboard/views/ContributedView';
import { SearchView } from '../../../components/dashboard/views/SearchView';
import { Issue, LegacyIssue, DashboardView } from '../../../components/dashboard/types';
import RegisterRepositoryView from '../../../components/dashboard/views/RegisterRepositoryView';
import { LoadingState } from '@/components/ui/loading-state';

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [activeIssue, setActiveIssue] = useState<Issue | LegacyIssue | null>(null);
  const [user, setUser] = useState<{ karma: number, name?: string, image?: string } | null>(null);
  
  // Changed from repositories to issues for Phase 1
  const [issues, setIssues] = useState<Issue[]>([]); 
  const [view, setView] = useState<DashboardView>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Swipe State
  const [currentIssueIndex, setCurrentIssueIndex] = useState(0);

  // Fetch initial data
  useEffect(() => {
    async function initData() {
        try {
            const [userRes, issuesRes] = await Promise.all([
                fetch('/api/users'),
                fetch('/api/issues')
            ]);
            
            if (userRes.ok) {
                const userData = await userRes.json();
                setUser(userData);
            }
            if (issuesRes.ok) {
                const issuesData = await issuesRes.json();
                setIssues(issuesData);
            }
        } catch (error) {
            console.error("Failed to load dashboard data", error);
        } finally {
            setIsLoading(false);
        }
    }
    initData();
  }, []);

  const handleNext = () => {
    if (issues.length > 0) {
        setCurrentIssueIndex((prev) => (prev + 1) % issues.length);
    }
  };

  const handlePublishRequest = (amount: number) => {
    if (user) {
        setUser({ ...user, karma: user.karma - Math.floor(amount * 1.05) });
    }
    setView('my-requests');
  };

  const handleNavigate = (page: string) => {
      if (page === 'home') {
          window.location.href = '/api/auth/signout';
      } else if (page === 'docs') {
          router.push('/docs');
      } else if (page === 'guidelines') {
          router.push('/guidelines');
      } else {
          console.log('Navigate to:', page);
      }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setView('search');
  };

  const renderContent = () => {
      if (isLoading && !user) return <LoadingState text="Loading dashboard..." />;

      switch (view) {
          case 'create':
              return <CreateRequestView onPublish={handlePublishRequest} onCancel={() => setView('feed')} />;
          case 'register-repo':
              return <RegisterRepositoryView onCancel={() => setView('feed')} />;
          case 'history':
              return <TransactionHistoryView />;
          case 'settings':
              return <SettingsView />;
          case 'my-requests':
              return <MyRequestsView />;
          case 'profile':
              return <ProfileView />;
          case 'contributions':
              return <ContributedView onAcceptIssue={(issue) => setActiveIssue(issue)} />;
          case 'search':
              return <SearchView query={searchQuery} onAccept={(issue) => setActiveIssue(issue)} />;
          case 'feed':
          default:
              return <FeedView 
                  activeIssue={activeIssue}
                  issues={issues}
                  currentIndex={currentIssueIndex}
                  onPass={handleNext}
                  onAbandon={() => setActiveIssue(null)}
              />;
      }
  };

  return (
    <div className="min-h-screen bg-background font-sans text-brand-text flex flex-col">
      <DashboardNavbar 
        onNavigate={handleNavigate} 
        karma={user?.karma || 0} 
        onCreateClick={() => setView('create')} 
        onHistoryClick={() => setView('history')}
        onSettingsClick={() => setView('settings')}
        onProfileClick={() => setView('profile')}
        onSearch={handleSearch}
        currentView={view}
        onViewChange={setView}
        userImage={user?.image}
      />
      
      <main className="max-w-[1280px] mx-auto p-4 md:p-6 md:flex gap-6 w-full flex-1">
        {view !== 'settings' && view !== 'profile' && <LeftSidebar karma={user?.karma || 0} onHistoryClick={() => setView('history')} onViewChange={setView} />}

        <div className="flex-1 min-w-0">
             {view !== 'create' && view !== 'profile' && view !== 'settings' && (
                <div className="border-b border-brand-border flex gap-6 px-2 mb-6 overflow-x-auto">
                    <button 
                        onClick={() => setView('feed')}
                        className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${view === 'feed' ? 'border-brand-accent text-brand-text' : 'border-transparent text-brand-muted hover:text-brand-text'}`}
                    >
                        <Search className="w-4 h-4" />
                        Overview
                    </button>
                    <button 
                        onClick={() => setView('contributions')}
                        className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${view === 'contributions' ? 'border-brand-accent text-brand-text' : 'border-transparent text-brand-muted hover:text-brand-text'}`}
                    >
                        <GitPullRequest className="w-4 h-4" />
                        Contributions
                    </button>
                    <button 
                        onClick={() => setView('my-requests')}
                        className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${view === 'my-requests' ? 'border-brand-accent text-brand-text' : 'border-transparent text-brand-muted hover:text-brand-text'}`}
                    >
                        <Inbox className="w-4 h-4" />
                        My Requests
                    </button>
                    <button 
                        onClick={() => setView('history')}
                        className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${view === 'history' ? 'border-brand-accent text-brand-text' : 'border-transparent text-brand-muted hover:text-brand-text'}`}
                    >
                        <Zap className="w-4 h-4" />
                        History
                    </button>
                </div>
             )}

             {renderContent()}
        </div>

        {view !== 'settings' && view !== 'history' && view !== 'profile' && <RightSidebar />}
      </main>

      <DashboardFooter onNavigate={handleNavigate} />
    </div>
  );
};

export default Dashboard;
