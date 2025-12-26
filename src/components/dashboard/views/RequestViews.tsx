
import React, { useState } from 'react';
import { X, Book, Check, CircleDot, Zap, Loader, Plus, Filter, User } from 'lucide-react';
import { MOCK_MY_REQUESTS } from '../mockData';
import { useNotImplemented } from '@/hooks/useNotImplemented';
import { NotImplementedDialog } from '@/components/ui/NotImplementedDialog';
import { useRepositoriesQuery } from '@/hooks/useRepositoriesQuery';
import { useIssuesQuery } from '@/hooks/useIssuesQuery';

export const CreateRequestView = ({ onPublish, onCancel }: { onPublish: (amount: number, issueId: string) => void, onCancel: () => void }) => {
    const [step, setStep] = useState(1);
    // Use repository ID (string) instead of name for robust linking
    const [selectedRepoId, setSelectedRepoId] = useState<string | null>(null);
    const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
    const [karmaAmount, setKarmaAmount] = useState<number>(100);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch Real Data - Step 1: Get MY repositories
    const { repositories, isLoading: reposLoading } = useRepositoriesQuery({ viewer: true });
    
    // Fetch Real Data - Step 2: Get Issues for SELECTED repository (Dependent Query)
    // We only fetch when selectedRepoId is set.
    const { issues, isLoading: issuesLoading } = useIssuesQuery({ 
        repositoryId: selectedRepoId || undefined 
    });

    // Derived State
    const selectedRepo = repositories.find((r) => r.id === selectedRepoId);
    // Since 'issues' is now already filtered by the API for this repo, we don't need to filter by repoId again on client
    const filteredIssues = issues; 
    const selectedIssue = issues.find((i) => i.id === selectedIssueId);

    const handleSubmit = () => {
        if(!selectedRepoId || !selectedIssueId) return;
        setIsSubmitting(true);
        // Simulate delay is fine, or we can just call onPublish immediately
        setTimeout(() => {
            setIsSubmitting(false);
            onPublish(karmaAmount, selectedIssueId);
        }, 1000);
    };

    if (reposLoading) return <div className="p-8 text-center text-brand-muted"><Loader className="w-6 h-6 animate-spin mx-auto mb-2"/>Loading repositories...</div>;

    return (
        <div className="bg-brand-panel border border-brand-border rounded-md overflow-hidden">
             <div className="p-4 border-b border-brand-border flex items-center justify-between">
                <h3 className="font-bold text-brand-text">New Karma Request</h3>
                <button onClick={onCancel} className="text-brand-muted hover:text-brand-text"><X className="w-5 h-5"/></button>
             </div>

             <div className="p-6">
                {/* Steps Indicator */}
                <div className="flex items-center mb-8 text-sm">
                    <div className={`flex items-center gap-2 ${step >= 1 ? 'text-brand-accent' : 'text-brand-muted'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 1 ? 'border-brand-accent bg-brand-accent/10' : 'border-brand-border'}`}>1</div>
                        <span>Repo</span>
                    </div>
                    <div className="w-8 h-px bg-[#30363d] mx-2"></div>
                    <div className={`flex items-center gap-2 ${step >= 2 ? 'text-brand-accent' : 'text-brand-muted'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 2 ? 'border-brand-accent bg-brand-accent/10' : 'border-brand-border'}`}>2</div>
                        <span>Issue</span>
                    </div>
                    <div className="w-8 h-px bg-[#30363d] mx-2"></div>
                    <div className={`flex items-center gap-2 ${step >= 3 ? 'text-brand-accent' : 'text-brand-muted'}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${step >= 3 ? 'border-brand-accent bg-brand-accent/10' : 'border-brand-border'}`}>3</div>
                        <span>Bounty</span>
                    </div>
                </div>

                {step === 1 && (
                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-brand-text">Select a Repository</label>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {repositories.length === 0 ? (
                                <div className="text-sm text-brand-muted italic p-2 border border-brand-border border-dashed rounded text-center">
                                    No repositories registered yet.
                                </div>
                            ) : (
                                repositories.map(repo => (
                                    <div 
                                        key={repo.id}
                                        onClick={() => setSelectedRepoId(repo.id)}
                                        className={`p-3 rounded-md border cursor-pointer flex items-center justify-between group transition-colors ${selectedRepoId === repo.id ? 'border-brand-accent bg-brand-accent/10' : 'border-brand-border hover:border-brand-muted'}`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Book className="w-4 h-4 text-brand-muted" />
                                            <span className="text-brand-text font-medium">{repo.name}</span>
                                        </div>
                                        {selectedRepoId === repo.id && <Check className="w-4 h-4 text-brand-accent" />}
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="flex justify-end pt-4">
                            <button 
                                onClick={() => setStep(2)} 
                                disabled={!selectedRepoId}
                                className="bg-brand-success hover:bg-brand-success/80 text-white px-4 py-2 rounded-md font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next: Select Issue
                            </button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <label className="block text-sm font-semibold text-brand-text">Select an Issue to Boost from {selectedRepo?.name}</label>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {issuesLoading ? (
                                <div className="text-center py-4"><Loader className="w-4 h-4 animate-spin mx-auto"/></div>
                            ) : filteredIssues.length === 0 ? (
                                <div className="text-sm text-brand-muted italic p-2 border border-brand-border border-dashed rounded text-center">
                                    No open issues found in this repository.
                                </div>
                            ) : (
                                filteredIssues.map(issue => (
                                    <div 
                                        key={issue.id}
                                        onClick={() => setSelectedIssueId(issue.id)}
                                        className={`p-3 rounded-md border cursor-pointer group transition-colors ${selectedIssueId === issue.id ? 'border-brand-accent bg-brand-accent/10' : 'border-brand-border hover:border-brand-muted'}`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <CircleDot className="w-4 h-4 text-brand-success mt-1 shrink-0" />
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <span className="text-brand-text font-medium leading-snug">{issue.title}</span>
                                                    <span className="text-xs text-brand-muted">#{issue.number}</span>
                                                </div>
                                                <div className="flex gap-2 mt-2">
                                                    <span className="text-xs text-brand-muted">Created: {new Date(issue.createdAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="flex justify-between pt-4">
                            <button onClick={() => setStep(1)} className="text-brand-accent text-sm hover:underline">Back</button>
                            <button 
                                onClick={() => setStep(3)} 
                                disabled={!selectedIssueId}
                                className="bg-brand-success hover:bg-brand-success/80 text-white px-4 py-2 rounded-md font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next: Set Bounty
                            </button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-brand-text mb-2">Karma Bounty Amount</label>
                            <div className="flex items-center gap-4">
                                <div className="relative flex-1">
                                    <input 
                                        type="number" 
                                        value={karmaAmount}
                                        onChange={(e) => setKarmaAmount(Number(e.target.value))}
                                        min={50}
                                        step={10}
                                        className="w-full bg-background border border-brand-border rounded-md py-2 pl-10 pr-4 text-brand-text focus:border-brand-accent focus:ring-1 focus:ring-[#58a6ff]"
                                    />
                                    <Zap className="w-4 h-4 text-[#e3b341] absolute left-3 top-2.5" />
                                </div>
                                <div className="text-xs text-brand-muted">
                                    Est. Value: <span className="text-brand-text">High Priority</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-background rounded-md p-4 border border-brand-border">
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-brand-muted">Base Amount</span>
                                <span className="text-brand-text">{karmaAmount}</span>
                            </div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-brand-muted">Platform Fee (5%)</span>
                                <span className="text-brand-text">{Math.floor(karmaAmount * 0.05)}</span>
                            </div>
                            <div className="border-t border-brand-border my-2"></div>
                            <div className="flex justify-between font-bold">
                                <span className="text-brand-text">Total Cost</span>
                                <span className="text-[#e3b341] flex items-center gap-1">
                                    <Zap className="w-3 h-3" />
                                    {Math.floor(karmaAmount * 1.05)}
                                </span>
                            </div>
                            <div className="mt-2 text-xs text-brand-muted text-right">
                                Boosting Issue: <span className="font-semibold text-brand-text">#{selectedIssue?.number} {selectedIssue?.title}</span>
                            </div>
                        </div>

                        <div className="flex justify-between pt-4">
                            <button onClick={() => setStep(2)} className="text-brand-accent text-sm hover:underline">Back</button>
                            <button 
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-brand-success hover:bg-brand-success/80 text-white px-6 py-2 rounded-md font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader className="w-4 h-4 animate-spin" />
                                        Publishing...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-4 h-4" />
                                        Publish Request
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}
             </div>
        </div>
    );
};

export const MyRequestsView = () => {
    const { isOpen, featureName, showNotImplemented, closeNotImplemented } = useNotImplemented();

    return (
        <div className="bg-background border border-brand-border rounded-md overflow-hidden">
             <NotImplementedDialog isOpen={isOpen} onClose={closeNotImplemented} featureName={featureName} />
             <div className="bg-brand-panel border-b border-brand-border p-3 flex items-center justify-between text-sm text-brand-text">
                 <div className="flex gap-4">
                     <span className="font-bold flex items-center gap-1"><CircleDot className="w-4 h-4 text-brand-text"/> 3 Open</span>
                     <span className="text-brand-muted flex items-center gap-1"><Check className="w-4 h-4"/> 1 Closed</span>
                 </div>
                 <div className="flex items-center gap-2">
                     <button onClick={() => showNotImplemented('Filter')} className="text-brand-muted hover:text-brand-accent"><Filter className="w-4 h-4" /></button>
                 </div>
             </div>
             
             <div className="divide-y divide-[#30363d]">
                 {MOCK_MY_REQUESTS.map(req => (
                     <div key={req.id} className="p-4 hover:bg-brand-panel transition-colors group">
                         <div className="flex justify-between items-start">
                             <div className="flex gap-3">
                                 <div className="mt-1">
                                    {req.status === 'open' && <CircleDot className="w-4 h-4 text-brand-success" />}
                                    {req.status === 'in_progress' && <div className="w-4 h-4 rounded-full border-2 border-[#e3b341] border-t-transparent animate-spin" />}
                                    {req.status === 'completed' && <Check className="w-4 h-4 text-[#8957e5]" />}
                                 </div>
                                 <div>
                                     <div 
                                        onClick={() => showNotImplemented('Request Details')}
                                        className="text-brand-text font-semibold text-base group-hover:text-brand-accent cursor-pointer"
                                     >
                                         {req.title}
                                     </div>
                                     <div className="text-xs text-brand-muted mt-1 flex items-center gap-2">
                                         <span className="font-mono">#{req.id}</span>
                                         <span>•</span>
                                         <span>{req.repo}</span>
                                         <span>•</span>
                                         <span>opened {req.created_at}</span>
                                     </div>
                                 </div>
                             </div>
                             
                             <div className="flex flex-col items-end gap-2">
                                 <div className="flex items-center gap-1 text-[#e3b341] font-bold text-xs bg-[#e3b341]/10 px-2 py-0.5 rounded-full border border-[#e3b341]/20">
                                     <Zap className="w-3 h-3" />
                                     {req.bounty}
                                 </div>
                                 {req.assignee ? (
                                     <div className="text-xs text-brand-muted flex items-center gap-1">
                                         <User className="w-3 h-3" />
                                         <span className="font-medium text-brand-text">{req.assignee}</span>
                                     </div>
                                 ) : (
                                     <div className="text-xs text-brand-muted italic">No assignee</div>
                                 )}
                             </div>
                         </div>
                     </div>
                 ))}
             </div>
             <div className="p-3 text-center border-t border-brand-border bg-brand-panel">
                <button onClick={() => showNotImplemented('View All Requests')} className="text-xs text-brand-accent hover:underline">View all requests</button>
            </div>
        </div>
    )
};
