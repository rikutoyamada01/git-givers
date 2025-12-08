
import React, { useState, useEffect } from 'react';
import { ExternalLink, ArrowDownLeft, ArrowUpRight, Zap } from 'lucide-react';
import { useNotImplemented } from '@/hooks/useNotImplemented';
import { NotImplementedDialog } from '@/components/ui/NotImplementedDialog';
import { useSession } from 'next-auth/react';
import { LoadingState } from '@/components/ui/loading-state';

// Definition reflecting DB structure + inclusions
type DBTransaction = {
    id: string;
    amount: number;
    description: string | null;
    createdAt: string;
    fromUserId?: string | null;
    toUserId?: string | null;
    repositoryId?: string; // We added this
    // We might want to expand to specific repo details if we fetched them
};

export const TransactionHistoryView = () => {
    const { isOpen, featureName, showNotImplemented, closeNotImplemented } = useNotImplemented();
    const { data: session } = useSession();
    const user = session?.user;
    
    const [transactions, setTransactions] = useState<DBTransaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        async function fetchTransactions() {
            try {
                const res = await fetch('/api/karma');
                if (res.ok) {
                    const data = await res.json();
                    setTransactions(data);
                }
            } catch (error) {
                console.error("Failed to fetch transactions", error);
            } finally {
                setLoading(false);
            }
        }
        fetchTransactions();
    }, [user]);

    if (loading) return <LoadingState text="Loading history..." />;

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric' // optional
        });
    };

    return (
        <div className="bg-background border border-brand-border rounded-md overflow-hidden">
            <NotImplementedDialog isOpen={isOpen} onClose={closeNotImplemented} featureName={featureName} />
            <div className="p-4 border-b border-brand-border bg-brand-panel flex items-center justify-between">
                <h3 className="font-bold text-brand-text">Transaction History</h3>
                <button onClick={() => showNotImplemented('Export CSV')} className="text-xs text-brand-accent hover:underline flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    Export CSV
                </button>
            </div>
            
            <div className="divide-y divide-[#30363d]">
                {transactions.length === 0 ? (
                    <div className="p-8 text-center text-brand-muted">
                        No transactions yet. Start performing missions!
                    </div>
                ) : (
                    transactions.map((tx) => {
                        const isEarned = tx.toUserId === user?.id; // If I received it, I earned it.
                        // If toUserId is null (system), and fromUserId is Me, I spent it (to System).
                        // If fromUserId matches me, I spent it (unless I sent it to myself, but that would be weird here)
                        // Actually if I send to myself, it's net zero, but typically handled as transfer.
                        const type = isEarned ? 'earned' : 'spent';
                        
                        return (
                            <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-brand-panel transition-colors">
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1 p-1.5 rounded-full border ${
                                        type === 'earned' 
                                        ? 'bg-brand-success/10 border-brand-success text-brand-success' 
                                        : 'bg-[#da3633]/10 border-[#da3633] text-[#da3633]'
                                    }`}>
                                        {type === 'earned' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-brand-text">{tx.description || "No description"}</div>
                                        <div className="text-xs text-brand-muted flex items-center gap-2 mt-0.5">
                                            <span>{formatDate(tx.createdAt)}</span>
                                            {tx.repositoryId && (
                                                <>
                                                    <span>•</span>
                                                    <span className="font-mono">Repository Link</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className={`font-mono font-bold text-sm flex items-center gap-1 ${
                                    type === 'earned' ? 'text-brand-success' : 'text-brand-text'
                                }`}>
                                    {type === 'earned' ? '+' : '-'}{tx.amount}
                                    <Zap className="w-3 h-3" />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            
            <div className="p-3 text-center border-t border-brand-border bg-brand-panel">
                <button onClick={() => showNotImplemented('View Older Transactions')} className="text-xs text-brand-accent hover:underline">View older transactions</button>
            </div>
        </div>
    );
};
