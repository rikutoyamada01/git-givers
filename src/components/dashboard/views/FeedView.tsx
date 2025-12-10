import React, { useState } from 'react';
import { RefreshCw, GitPullRequest, CircleDot, Zap, Filter, ExternalLink, X, Check } from 'lucide-react';
import { Issue, LegacyIssue } from '../types';
import { useNotImplemented } from '@/hooks/useNotImplemented';
import { NotImplementedDialog } from '@/components/ui/NotImplementedDialog';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { calculateIssueReward } from '@/lib/karma';

export const SparklesIcon = () => (
    <svg className="w-4 h-4 text-[#e3b341]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z"/>
    </svg>
);

export const ActiveMissionCard = ({ issue, onAbandon }: { issue: Issue | LegacyIssue, onAbandon: () => void }) => {
    const [isAbandoning, setIsAbandoning] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [status, setStatus] = useState("Waiting for Pull Request...");

    const simulateCheck = () => {
        setIsChecking(true);
        setStatus("Syncing with GitHub...");
        setTimeout(() => {
            setIsChecking(false);
            setStatus("No linked PR found yet. Make sure to reference #" + issue.id);
        }, 1500);
    };

    const openPullRequestPage = () => {
        // Construct PR URL or just open issue for now
        if ('repository' in issue && issue.repository?.url) {
             window.open(`${issue.repository.url}/compare`, '_blank');
        } else if ('htmlUrl' in issue) {
             window.open(issue.htmlUrl, '_blank');
        } else {
             // Fallback for LegacyIssue
             window.open(`https://github.com/${(issue as LegacyIssue).repo || ''}/compare`, '_blank');
        }
    };

    const displayRepo = 'repository' in issue ? issue.repository?.fullName : (issue as LegacyIssue).repo;
    
    let displayKarma = issue.karma || 0;
    if ('repository' in issue && issue.repository && issue.repository.stargazersCount !== undefined) {
        displayKarma = calculateIssueReward({ stars: issue.repository.stargazersCount });
    }

    return (
        <div className="bg-background border border-[#238636] rounded-md overflow-hidden shadow-[0_0_15px_rgba(35,134,54,0.1)] relative">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#238636] to-[#2ea043]"></div>
             
             <div className="p-4 border-b border-brand-border bg-brand-panel flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="text-brand-success animate-pulse">
                        <CircleDot className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-brand-text">Active Mission</span>
                </div>
                <div className="text-xs font-mono text-brand-muted">Started just now</div>
             </div>

             <div className="p-6">
                <div className="flex items-start gap-4 mb-6">
                    {/* Placeholder for missing icon */}
                    <div className="w-12 h-12 rounded-md border border-brand-border bg-brand-muted/10 flex items-center justify-center">
                        <GitPullRequest className="w-6 h-6 text-brand-muted" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-brand-text mb-1 leading-snug">{issue.title}</h3>
                        <div className="text-sm text-brand-muted flex items-center gap-2">
                            <span>{displayRepo || 'Unknown Repo'}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-[#e3b341]">
                                <Zap className="w-3 h-3" />
                                {displayKarma} Karma
                            </span>
                        </div>
                    </div>
                </div>

                {/* Status Box */}
                <div className="bg-brand-panel border border-brand-border rounded-md p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-brand-text">Status</h4>
                        <button 
                            onClick={simulateCheck}
                            disabled={isChecking}
                            className="text-xs text-[#58a6ff] hover:underline flex items-center gap-1 disabled:opacity-50"
                        >
                            <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
                            Check for updates
                        </button>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-brand-muted">
                         <div className="w-2 h-2 rounded-full bg-brand-success animate-pulse"></div>
                         {status}
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button 
                        onClick={openPullRequestPage}
                        className="w-full bg-brand-success hover:bg-brand-success/80 text-brand-text py-2 rounded-md font-bold text-sm transition-colors flex items-center justify-center gap-2"
                    >
                        <GitPullRequest className="w-4 h-4" />
                        Submit Pull Request
                    </button>
                    
                    {!isAbandoning ? (
                        <button 
                            onClick={() => setIsAbandoning(true)}
                            className="w-full bg-[#21262d] hover:bg-brand-border text-brand-text border border-brand-border py-2 rounded-md font-medium text-sm transition-colors"
                        >
                            Abandon Mission
                        </button>
                    ) : (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
                             <button 
                                onClick={() => setIsAbandoning(false)}
                                className="flex-1 bg-[#21262d] hover:bg-brand-border text-brand-text border border-brand-border py-2 rounded-md font-medium text-sm transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={onAbandon}
                                className="flex-1 bg-[#da3633] hover:bg-[#b60205] text-brand-text border border-[#da3633] py-2 rounded-md font-bold text-sm transition-colors"
                            >
                                Confirm Abandon
                            </button>
                        </div>
                    )}
                </div>
             </div>
        </div>
    );
};

import toast from 'react-hot-toast';

export const FeedView = ({ 
    activeIssue, 
    onAbandon, 
    onPass, 
    issues = [],
    currentIndex = 0,
}: { 
    activeIssue: Issue | LegacyIssue | null,
    onAbandon: () => void,
    onPass: () => void,
    issues?: Issue[], 
    currentIndex?: number
}) => {
    const { isOpen, featureName, showNotImplemented, closeNotImplemented } = useNotImplemented();
    const [boosting, setBoosting] = useState(false);

    if (activeIssue) {
        return <ActiveMissionCard issue={activeIssue} onAbandon={onAbandon} />;
    }

    // Using the props passed from Dashboard
    const displayIssue = issues.length > 0 ? issues[currentIndex % issues.length] : null;

    if (!displayIssue) {
         return (
            <Card className="min-h-[500px] flex flex-col items-center justify-center">
                <EmptyState
                    icon={SparklesIcon}
                    title="No active missions found"
                    description="Sync some repositories to see issues here!"
                />
            </Card>
         );
    }
    
    const handleBoost = async () => {
        if (!displayIssue) return;
        setBoosting(true);
        try {
            const response = await fetch('/api/boost', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    issueId: displayIssue.id,
                    amount: 50 // Fixed boost amount for now
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Boost failed');
            }
            
            const result = await response.json();
            toast.success(`Boosted ${result.amount} Karma!`);
            // Optimistic update or refresh could happen here
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "An error occurred");
        } finally {
            setBoosting(false);
        }
    };

    return (
        <Card className="min-h-[500px] flex flex-col relative">
            <NotImplementedDialog isOpen={isOpen} onClose={closeNotImplemented} featureName={featureName} />
            <CardHeader className="flex flex-row items-center justify-between border-b border-brand-border p-4 space-y-0">
                <div className="flex items-center gap-2">
                    <SparklesIcon />
                    <span className="font-bold text-brand-text">Suggested Mission</span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => showNotImplemented('Filter')} className="text-brand-muted hover:text-brand-accent"><Filter className="w-4 h-4" /></button>
                </div>
            </CardHeader>

            <CardContent className="flex-1 p-6 flex flex-col items-center justify-center relative">
                {/* Background Cards Effect */}
                <div className="absolute top-8 w-[95%] h-full bg-brand-panel border border-brand-border rounded-xl opacity-40 scale-95 -z-10 translate-y-2"></div>
                <div className="absolute top-10 w-[90%] h-full bg-brand-panel border border-brand-border rounded-xl opacity-20 scale-90 -z-20 translate-y-4"></div>

                {/* Main Card */}
                <div className="w-full bg-brand-panel border border-brand-border rounded-xl p-6 shadow-2xl relative">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                            {/* Placeholder Icon */}
                            <div className="w-12 h-12 rounded-md border border-brand-border bg-brand-muted/10 flex items-center justify-center">
                                <GitPullRequest className="w-6 h-6 text-brand-muted" />
                            </div>
                            <div>
                                <h3 
                                    onClick={() => window.open(displayIssue.htmlUrl || '#', '_blank')}
                                    className="text-lg font-bold text-brand-text hover:text-brand-accent cursor-pointer flex items-center gap-2"
                                >
                                    {displayIssue.repository?.fullName || "Unknown Repo"}
                                    <ExternalLink className="w-3 h-3 text-brand-muted" />
                                </h3>
                                <div className="text-xs text-brand-muted mt-1">
                                    Issue #{displayIssue.number} • {displayIssue.updatedAt ? new Date(displayIssue.updatedAt).toLocaleDateString() : 'Unknown date'}
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-2xl font-bold text-[#e3b341] flex items-center gap-1">
                                <Zap className="w-5 h-5 fill-[#e3b341]" />
                                {displayIssue.repository?.stargazersCount !== undefined 
                                    ? calculateIssueReward({ stars: displayIssue.repository.stargazersCount }) 
                                    : 100}
                            </span>
                            <span className="text-xs text-brand-muted uppercase tracking-wider">Reward</span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-xl font-bold text-brand-text mb-3 leading-snug">{displayIssue.title}</h2>
                        <p className="text-brand-muted leading-relaxed text-sm mb-4 line-clamp-3">
                            {displayIssue.body || "No description provided."}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 rounded-full bg-[#30363d] text-brand-text text-xs border border-brand-border">
                                {displayIssue.state}
                            </span>
                            <button
                                onClick={handleBoost}
                                disabled={boosting}
                                className="px-2 py-1 rounded-full bg-[#f1e05a]/10 text-[#f1e05a] text-xs border border-[#f1e05a]/20 hover:bg-[#f1e05a]/20 transition-colors flex items-center gap-1 disabled:opacity-50"
                            >
                                <Zap className="w-3 h-3" />
                                Boost (+50)
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-brand-border pt-6">
                        <button 
                            onClick={onPass}
                            className="flex items-center justify-center gap-2 py-3 rounded-lg border border-brand-border text-brand-muted hover:bg-brand-border hover:text-brand-text transition-all font-medium"
                        >
                            <X className="w-5 h-5" />
                            Pass
                        </button>
                        <button 
                            onClick={() => window.open(displayIssue.htmlUrl || '#', '_blank')}
                            className="flex items-center justify-center gap-2 py-3 rounded-lg bg-brand-success text-brand-text hover:bg-brand-success/80 transition-all font-bold shadow-lg shadow-green-900/20"
                        >
                            <Check className="w-5 h-5" />
                            View on GitHub
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
