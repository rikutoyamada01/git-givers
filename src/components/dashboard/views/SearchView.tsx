
import React from 'react';
import { ExternalLink, Zap } from 'lucide-react';
import { LegacyIssue } from '../types';
import { MOCK_ISSUES, AVAILABLE_CONTRIBUTION_ISSUES } from '../mockData';
import { useNotImplemented } from '@/hooks/useNotImplemented';
import { NotImplementedDialog } from '@/components/ui/NotImplementedDialog';

interface SearchViewProps {
    query: string;
    onAccept: (issue: LegacyIssue) => void;
}

export const SearchView: React.FC<SearchViewProps> = ({ query, onAccept }) => {
    const { isOpen, featureName, showNotImplemented, closeNotImplemented } = useNotImplemented();
    const allIssues = [
        ...MOCK_ISSUES,
        ...Object.values(AVAILABLE_CONTRIBUTION_ISSUES).flat()
    ];

    const results = allIssues.filter(issue => 
        issue.title.toLowerCase().includes(query.toLowerCase()) ||
        issue.desc.toLowerCase().includes(query.toLowerCase()) ||
        issue.repo.toLowerCase().includes(query.toLowerCase()) ||
        issue.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase())) ||
        issue.language.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="bg-background border border-brand-border rounded-md overflow-hidden min-h-[500px]">
            <NotImplementedDialog isOpen={isOpen} onClose={closeNotImplemented} featureName={featureName} />
            <div className="p-4 border-b border-brand-border bg-brand-panel flex items-center justify-between">
                <div>
                    <h3 className="font-bold text-brand-text">Search Results</h3>
                    <p className="text-xs text-brand-muted">
                        Showing results for <span className="font-mono text-brand-text">&quot;{query}&quot;</span>
                    </p>
                </div>
                <span className="bg-brand-border text-brand-text text-xs px-2 py-1 rounded-full">
                    {results.length} found
                </span>
            </div>
            
            <div className="divide-y divide-[#30363d]">
                {results.length > 0 ? (
                    results.map(issue => (
                        <div key={issue.id} className="p-6 hover:bg-brand-panel transition-colors group">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex gap-2">
                                    {issue.tags.map(tag => (
                                        <span key={tag} className="px-2 py-0.5 rounded-full bg-brand-border/50 border border-brand-border text-brand-muted text-xs">
                                            {tag}
                                        </span>
                                    ))}
                                    <span className="px-2 py-0.5 rounded-full border text-xs" style={{ borderColor: issue.languageColor + '40', color: issue.languageColor }}>
                                        {issue.language}
                                    </span>
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
                                <div className="flex items-center gap-2 text-xs text-brand-muted">
                                    <span className="font-mono">{issue.repo}</span>
                                    <span>•</span>
                                    <span>Posted {issue.posted}</span>
                                </div>
                                <button 
                                    onClick={() => onAccept(issue)}
                                    className="bg-brand-success hover:bg-brand-success/80 text-white px-4 py-1.5 rounded-md text-sm font-bold transition-all shadow-sm"
                                >
                                    Accept Issue
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-12 text-center text-brand-muted">
                        <p className="mb-2 text-lg">No results found</p>
                        <p className="text-sm">Try searching for different keywords, repository names, or languages.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
