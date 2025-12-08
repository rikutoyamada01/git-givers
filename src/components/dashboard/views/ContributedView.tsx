import React, { useState } from 'react';
import { GitPullRequest, Zap, ArrowRight, Star, Clock, ChevronLeft, Search, Filter, ExternalLink } from 'lucide-react';
import { CONTRIBUTED_REPOS, AVAILABLE_CONTRIBUTION_ISSUES } from '../mockData';
import { ContributedRepo, LegacyIssue } from '../types';
import { useNotImplemented } from '@/hooks/useNotImplemented';
import { NotImplementedDialog } from '@/components/ui/NotImplementedDialog';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';

interface ContributedViewProps {
    onAcceptIssue: (issue: LegacyIssue) => void;
}

export const ContributedView: React.FC<ContributedViewProps> = ({ onAcceptIssue }) => {
    const [selectedRepo, setSelectedRepo] = useState<ContributedRepo | null>(null);
    const { isOpen, featureName, showNotImplemented, closeNotImplemented } = useNotImplemented();

    // Detail View: Show available issues for the selected repo
    if (selectedRepo) {
        const issues = AVAILABLE_CONTRIBUTION_ISSUES[selectedRepo.name] || [];

        return (
            <Card className="min-h-[500px] overflow-hidden">
                <NotImplementedDialog isOpen={isOpen} onClose={closeNotImplemented} featureName={featureName} />
                <CardHeader className="flex flex-row items-center gap-4 border-b border-brand-border bg-brand-panel p-4 space-y-0">
                    <button 
                        onClick={() => setSelectedRepo(null)}
                        className="p-1 rounded-md hover:bg-brand-border text-brand-text transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <Image src={selectedRepo.icon} alt="" width={32} height={32} className="rounded-md border border-brand-border" />
                    <div>
                        <CardTitle className="text-base font-bold text-brand-text leading-tight">{selectedRepo.name}</CardTitle>
                        <p className="text-xs text-brand-muted">Select a new task to continue your contribution streak</p>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {issues.length > 0 ? (
                        <div className="divide-y divide-[#30363d]">
                            {issues.map(issue => (
                                <div key={issue.id} className="p-6 hover:bg-brand-panel transition-colors group">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex gap-2">
                                            {issue.tags.map(tag => (
                                                <span key={tag} className="px-2 py-0.5 rounded-full bg-brand-border/50 border border-brand-border text-brand-muted text-xs">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <span className="flex items-center gap-1 text-[#e3b341] font-bold text-sm">
                                            <Zap className="w-3 h-3" />
                                            {issue.karma}
                                        </span>
                                    </div>
                                    
                                    <h4 
                                        onClick={() => showNotImplemented('Issue Details')}
                                        className="text-lg font-bold text-brand-text mb-2 group-hover:text-brand-accent transition-colors cursor-pointer flex items-center gap-2"
                                    >
                                        {issue.title}
                                        <ExternalLink className="w-3 h-3 text-brand-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </h4>
                                    <p className="text-brand-muted text-sm mb-4 line-clamp-2">
                                        {issue.desc}
                                    </p>

                                    <div className="flex items-center justify-between">
                                        <div className="text-xs text-brand-muted">
                                            Posted {issue.posted}
                                        </div>
                                        <button 
                                            onClick={() => onAcceptIssue(issue)}
                                            className="bg-brand-success hover:bg-brand-success/80 text-white px-4 py-1.5 rounded-md text-sm font-bold transition-all shadow-sm"
                                        >
                                            Accept Challenge
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            icon={Star}
                            description="No open bounties available for this repository right now."
                            action={
                                <button 
                                    onClick={() => setSelectedRepo(null)}
                                    className="mt-4 text-[#58a6ff] text-sm hover:underline"
                                >
                                    Back to list
                                </button>
                            }
                        />
                    )}
                </CardContent>
            </Card>
        );
    }

    // List View: Show contributed repos
    return (
        <Card className="min-h-[500px] overflow-hidden">
            <NotImplementedDialog isOpen={isOpen} onClose={closeNotImplemented} featureName={featureName} />
            <CardHeader className="flex flex-row items-center justify-between border-b border-brand-border bg-brand-panel p-4 space-y-0">
                <div>
                    <CardTitle className="text-base font-bold text-brand-text">Your Contributions</CardTitle>
                    <p className="text-xs text-brand-muted">Repositories you have earned Karma from</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => showNotImplemented('Search')} className="p-1.5 text-brand-muted hover:text-brand-text">
                        <Search className="w-4 h-4" />
                    </button>
                    <button onClick={() => showNotImplemented('Filter')} className="p-1.5 text-brand-muted hover:text-brand-text">
                        <Filter className="w-4 h-4" />
                    </button>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <div className="divide-y divide-[#30363d]">
                    {CONTRIBUTED_REPOS.map((repo, idx) => (
                        <div key={idx} className="p-4 flex items-center gap-4 hover:bg-brand-panel transition-colors">
                            <Image src={repo.icon} alt="" width={40} height={40} className="rounded-md border border-brand-border" />
                            
                            <div className="flex-1 min-w-0">
                                <h4 
                                    onClick={() => showNotImplemented('Repository Details')}
                                    className="font-bold text-brand-text text-base hover:text-brand-accent cursor-pointer truncate"
                                >
                                    {repo.name}
                                </h4>
                                <p className="text-xs text-brand-muted truncate mb-1">
                                    {repo.description}
                                </p>
                                <div className="flex items-center gap-4 text-xs">
                                    <span className="flex items-center gap-1 text-[#e3b341]">
                                        <Zap className="w-3 h-3" />
                                        {repo.totalKarmaEarned} Earned
                                    </span>
                                    <span className="flex items-center gap-1 text-brand-muted">
                                        <GitPullRequest className="w-3 h-3" />
                                        {repo.prsMerged} Merged
                                    </span>
                                    <span className="flex items-center gap-1 text-brand-muted">
                                        <Clock className="w-3 h-3" />
                                        Last active {repo.lastContributed}
                                    </span>
                                </div>
                            </div>

                            <button 
                                onClick={() => setSelectedRepo(repo)}
                                className="shrink-0 border border-brand-border hover:border-[#8b949e] bg-brand-panel text-brand-text px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 group"
                            >
                                Find Issues
                                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="p-8 text-center border-t border-brand-border bg-brand-panel/50">
                    <p className="text-sm text-brand-muted mb-2">Want to add more to your portfolio?</p>
                    <button onClick={() => showNotImplemented('Explore Overview')} className="text-[#58a6ff] hover:underline text-sm font-medium">
                        Explore new projects in Overview
                    </button>
                </div>
            </CardContent>
        </Card>
    );
};
