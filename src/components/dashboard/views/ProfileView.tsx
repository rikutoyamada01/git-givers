"use client";

import React, { useEffect, useState } from 'react';
import { GitBranch, Zap, Target } from 'lucide-react';
import { useNotImplemented } from '@/hooks/useNotImplemented';
import { NotImplementedDialog } from '@/components/ui/NotImplementedDialog';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';

export type UserProfileData = {
  id: string;
  name: string | null;
  username: string | null;
  image: string | null;
  karma: number;
  _count?: {
    transactionsSent: number;
    transactionsReceived: number;
  };
};

type ProfileViewProps = {
    initialUser?: UserProfileData | null;
    editable?: boolean;
};

export const ProfileView: React.FC<ProfileViewProps> = ({
    initialUser = null,
    editable = true,
}) => {
    const { isOpen, featureName, showNotImplemented, closeNotImplemented } = useNotImplemented();
    const [user, setUser] = useState<UserProfileData | null>(initialUser);
    const [loading, setLoading] = useState(!initialUser);
    const [error, setError] = useState<string | null>(null);

    const [name, setName] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);

    useEffect(() => {
        if (initialUser) {
            return;
        }
        const fetchUser = async () => {
            try {
                setLoading(true);
                const res = await fetch('/api/users', { cache: 'no-store' });
                if (!res.ok) {
                    throw new Error(`Failed to load profile (${res.status})`);
                }
                const data = (await res.json()) as UserProfileData;
                setUser(data);
                setName(data.name ?? '');
                setImageUrl(data.image ?? '');
            } catch (e) {
                console.error('[ProfileView] failed to fetch user', e);
                setError('プロフィール情報の取得に失敗しました。時間をおいて再度お試しください。');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [initialUser]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editable) return;
        setSaving(true);
        setSaveMessage(null);
        setError(null);

        try {
            const res = await fetch('/api/users', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name.trim() || undefined,
                    image: imageUrl.trim(),
                }),
            });

            const body = await res.json();

            if (!res.ok) {
                if (body?.error === 'Username is already taken') {
                    setError('このユーザー名は既に使用されています。別の名前を試してください。');
                } else if (body?.issues) {
                    setError('入力内容に誤りがあります。');
                } else {
                    setError('プロフィールの保存に失敗しました。');
                }
                return;
            }

            setUser(body as UserProfileData);
            setSaveMessage('プロフィールを保存しました。');
        } catch (e) {
            console.error('[ProfileView] failed to save profile', e);
            setError('プロフィールの保存に失敗しました。');
        } finally {
            setSaving(false);
        }
    };

    const avatarSrc =
        imageUrl ||
        user?.image ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.username || 'Guest User')}&background=random&size=300`;

    if (loading) {
        return <LoadingState text="Loading profile..." />;
    }

    if (error) {
        return <ErrorState message={error} />;
    }

    return (
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start max-w-7xl mx-auto">
            <NotImplementedDialog isOpen={isOpen} onClose={closeNotImplemented} featureName={featureName} />
            {/* Left Sidebar - User Info & GitKarma Stats */}
            <div className="w-full md:w-[296px] shrink-0 -mt-8 md:mt-0 relative z-10">
                <div className="relative group">
                    <Image 
                        src={avatarSrc}
                        alt="Avatar" 
                        width={260}
                        height={260}
                        className="w-[150px] h-[150px] md:w-[260px] md:h-[260px] rounded-full border border-brand-border shadow-xl object-cover"
                    />
                </div>

                <div className="pt-4 pb-4">
                    <h1 className="text-2xl font-bold text-brand-text leading-tight">
                        {user?.name || 'Unnamed User'}
                    </h1>
                    <div className="text-xl text-brand-muted font-light">
                        {user?.username || 'no-username'}
                    </div>
                </div>

                {saveMessage && (
                    <div className="mb-3 text-xs text-emerald-300 bg-emerald-900/30 border border-emerald-700 rounded px-2 py-1">
                        {saveMessage}
                    </div>
                )}

                <form onSubmit={handleSave} className="space-y-3 mb-4">
                    <div className="space-y-1">
                        <label className="block text-xs font-medium text-brand-muted">Display name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-background border border-brand-border rounded-md px-3 py-1.5 text-sm text-brand-text focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] focus:outline-none"
                            placeholder="Your name"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs font-medium text-brand-muted">GitHub Username</label>
                        <div className="w-full bg-background border border-dashed border-brand-border rounded-md px-3 py-1.5 text-sm text-brand-muted">
                            {user?.username || 'GitHub 連携後に表示されます'}
                        </div>
                        <p className="text-[11px] text-brand-muted">
                            GitHub 側のプロフィールを更新すると、次回ログイン時に自動で同期されます。
                        </p>
                    </div>
                    <div className="space-y-1">
                        <label className="block text-xs font-medium text-brand-muted">Avatar URL (optional)</label>
                        <input
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full bg-background border border-brand-border rounded-md px-3 py-1.5 text-sm text-brand-text focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff] focus:outline-none"
                            placeholder="https://..."
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={saving || loading}
                        className="w-full bg-brand-panel border border-brand-border hover:bg-brand-border disabled:opacity-60 disabled:cursor-not-allowed text-brand-text py-1.5 rounded-md text-sm font-medium transition-colors"
                    >
                        {saving ? 'Saving...' : 'Save profile'}
                    </button>
                </form>

                <Card className="mb-6 shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                    <CardContent className="p-4">
                        <h3 className="text-xs font-semibold text-brand-muted uppercase tracking-wider mb-3">GitGivers Stats</h3>
                        
                        <div className="flex items-center gap-3 mb-4">
                             <div className="w-10 h-10 rounded-md bg-gradient-to-br from-[#8b5cf6] to-[#6366f1] flex items-center justify-center text-white font-bold text-lg shadow-lg">
                                 {(user?.karma ?? 0).toString().slice(0, 2)}
                             </div>
                             <div>
                                 <div className="text-sm font-bold text-brand-text">Level 12</div>
                                 <div className="text-xs text-brand-muted">Code Grandmaster</div>
                             </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                 <div className="flex items-center gap-2 text-brand-text">
                                     <Zap className="w-4 h-4 text-[#e3b341]" />
                                     Total Karma
                                 </div>
                                 <span className="font-mono font-bold">{user?.karma ?? 0}</span>
                            </div>
                             <div className="flex items-center justify-between text-sm">
                                 <div className="flex items-center gap-2 text-brand-text">
                                     <Target className="w-4 h-4 text-brand-success" />
                                     Karma Sent
                                 </div>
                                 <span className="font-mono font-bold">
                                    {user?._count?.transactionsSent ?? 0}
                                 </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-brand-text">
                                    <GitBranch className="w-4 h-4 text-[#a855f7]" />
                                    Karma Received
                                </div>
                                <span className="font-mono font-bold">
                                    {user?._count?.transactionsReceived ?? 0}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
                <div>
                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                             <h2 className="text-base font-normal text-brand-text">Karma Activity (GitGivers)</h2>
                        </div>
                        <Card className="overflow-hidden">
                             <CardContent className="p-4">
                                 <div className="flex items-center justify-between mb-4">
                                     <h3 className="text-sm font-semibold text-brand-text">1,234 contributions in the last year</h3>
                                     <div className="text-xs text-brand-muted flex items-center gap-4">
                                         <div className="flex items-center gap-1">
                                             <span className="w-3 h-3 bg-brand-panel border border-brand-border rounded-sm"></span>
                                             Less
                                         </div>
                                         <div className="flex items-center gap-1">
                                             <span className="w-3 h-3 bg-[#0e4429] rounded-sm"></span>
                                             <span className="w-3 h-3 bg-[#006d32] rounded-sm"></span>
                                             <span className="w-3 h-3 bg-[#26a641] rounded-sm"></span>
                                             <span className="w-3 h-3 bg-[#39d353] rounded-sm"></span>
                                             More
                                         </div>
                                     </div>
                                 </div>
                                 
                                 {/* Simulated Graph */}
                                 <div className="flex gap-[2px] h-[100px] items-end justify-center opacity-80">
                                     {Array.from({ length: 52 }).map((_, w) => (
                                         <div key={w} className="flex flex-col gap-[2px]">
                                             {Array.from({ length: 7 }).map((_, d) => {
                                                 const level = Math.random() > 0.7 ? Math.floor(Math.random() * 4) + 1 : 0;
                                                 const colors = ['bg-brand-panel', 'bg-[#0e4429]', 'bg-[#006d32]', 'bg-[#26a641]', 'bg-[#39d353]'];
                                                 return (
                                                     <div 
                                                        key={d} 
                                                        className={`w-[10px] h-[10px] rounded-[2px] ${colors[level]} ${level === 0 ? 'border border-brand-border/30' : ''}`}
                                                     ></div>
                                                 );
                                             })}
                                         </div>
                                     ))}
                                 </div>
                            </CardContent>
                        </Card>
                    </div>
                    
                    <div className="space-y-4">
                        <h2 className="text-base font-normal text-brand-text">Contribution Activity</h2>
                        <div className="relative pl-6 before:absolute before:left-2.5 before:top-2 before:bottom-0 before:w-px before:bg-[#30363d]">
                            <div className="mb-6 relative">
                                <div className="absolute -left-6 top-1 bg-[#30363d] rounded-full p-1 border border-[#0d1117]">
                                    <GitBranch className="w-3 h-3 text-brand-muted" />
                                </div>
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-sm font-normal text-brand-text">
                                        Created a pull request in <span onClick={() => showNotImplemented('Repository Details')} className="font-bold text-brand-accent hover:underline cursor-pointer">gitgivers/frontend</span>
                                    </h3>
                                    <span className="text-xs text-brand-muted">2 days ago</span>
                                </div>
                                <div className="text-sm text-brand-muted font-mono">
                                    fix: update navbar responsiveness #124
                                </div>
                            </div>

                             <div className="mb-6 relative">
                                <div className="absolute -left-6 top-1 bg-[#30363d] rounded-full p-1 border border-[#0d1117]">
                                    <Zap className="w-3 h-3 text-[#e3b341]" />
                                </div>
                                <div className="flex items-center justify-between mb-1">
                                    <h3 className="text-sm font-normal text-brand-text">
                                        Earned <span className="font-bold text-[#e3b341]">450 Karma</span> from <span onClick={() => showNotImplemented('Repository Details')} className="font-bold text-brand-accent hover:underline cursor-pointer">facebook/react</span>
                                    </h3>
                                    <span className="text-xs text-brand-muted">5 days ago</span>
                                </div>
                            </div>
                            
                            <div className="relative">
                                <button 
                                    onClick={() => showNotImplemented('Show More Activity')}
                                    className="w-full py-2 border border-brand-border rounded-md text-xs font-bold text-brand-accent hover:bg-brand-panel hover:underline transition-colors"
                                >
                                    Show more activity
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
