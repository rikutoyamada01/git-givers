"use client";

import React, { useState } from 'react';
import { User, Bell, Shield, Key, CreditCard } from 'lucide-react';
import { useNotImplemented } from '@/hooks/useNotImplemented';
import { NotImplementedDialog } from '@/components/ui/NotImplementedDialog';

type SettingsTab = 'profile' | 'account' | 'security' | 'notifications' | 'ssh' | 'billing';

export const SettingsView = () => {
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
    const { isOpen, featureName, showNotImplemented, closeNotImplemented } = useNotImplemented();

    const getTabClass = (tabName: SettingsTab) => {
        const baseClass = "w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors duration-200";
        if (activeTab === tabName) {
            return `${baseClass} bg-brand-accent text-white`;
        }
        return `${baseClass} text-brand-text hover:bg-brand-panel hover:text-brand-text`;
    };

    return (
        <div className="flex flex-col md:flex-row gap-8 items-start max-w-6xl">
            <NotImplementedDialog isOpen={isOpen} onClose={closeNotImplemented} featureName={featureName} />
            {/* Settings Sidebar */}
            <div className="w-full md:w-64 flex-shrink-0">
                <nav className="space-y-1">
                    <button 
                        onClick={() => setActiveTab('profile')}
                        className={getTabClass('profile')}
                    >
                        <User className="w-4 h-4" />
                        Public Profile
                    </button>
                    <button 
                        onClick={() => setActiveTab('account')}
                        className={getTabClass('account')}
                    >
                        <User className="w-4 h-4" />
                        Account
                    </button>
                    <button 
                        onClick={() => setActiveTab('security')}
                        className={getTabClass('security')}
                    >
                        <Shield className="w-4 h-4" />
                        Password & Authentication
                    </button>
                    <button 
                        onClick={() => setActiveTab('notifications')}
                        className={getTabClass('notifications')}
                    >
                        <Bell className="w-4 h-4" />
                        Notifications
                    </button>
                    <button 
                        onClick={() => setActiveTab('ssh')}
                        className={getTabClass('ssh')}
                    >
                        <Key className="w-4 h-4" />
                        SSH and GPG keys
                    </button>
                    <div className="border-t border-brand-border my-2"></div>
                    <button 
                        onClick={() => setActiveTab('billing')}
                        className={getTabClass('billing')}
                    >
                        <CreditCard className="w-4 h-4" />
                        Billing and plans
                    </button>
                </nav>
            </div>

            {/* Settings Content */}
            <div className="flex-1 w-full min-w-0">
                {activeTab === 'profile' && (
                    <div className="animate-in fade-in duration-300">
                        <div className="border-b border-brand-border pb-4 mb-6">
                            <h2 className="text-2xl font-normal text-brand-text">Public Profile</h2>
                        </div>

                        <div className="space-y-6 max-w-2xl">
                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-brand-text text-sm">Name</label>
                                <input 
                                    type="text" 
                                    defaultValue="Guest User"
                                    className="bg-background border border-brand-border rounded-md py-1.5 px-3 text-sm text-brand-text focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:outline-none transition-shadow"
                                />
                                <p className="text-xs text-brand-muted">Your name may appear around GitGivers where you contribute or are mentioned.</p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-brand-text text-sm">Public Email</label>
                                <select className="bg-background border border-brand-border rounded-md py-1.5 px-3 text-sm text-brand-text focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:outline-none">
                                    <option>guest@example.com</option>
                                    <option>Don&apos;t show my email address</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-brand-text text-sm">Bio</label>
                                <textarea 
                                    className="bg-background border border-brand-border rounded-md py-1.5 px-3 text-sm text-brand-text min-h-[100px] focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:outline-none resize-y"
                                    placeholder="Tell us a little bit about yourself"
                                ></textarea>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-semibold text-brand-text text-sm">URL</label>
                                <input 
                                    type="text" 
                                    placeholder="https://example.com"
                                    className="bg-background border border-brand-border rounded-md py-1.5 px-3 text-sm text-brand-text focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:outline-none"
                                />
                            </div>

                            <div className="pt-4 border-t border-brand-border mt-4">
                                <button onClick={() => showNotImplemented('Update Profile')} className="bg-brand-success hover:bg-brand-success/80 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm">
                                    Update profile
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'account' && (
                    <div className="animate-in fade-in duration-300">
                        <div className="border-b border-brand-border pb-4 mb-6">
                            <h2 className="text-2xl font-normal text-brand-text">Account Settings</h2>
                        </div>
                        <div className="space-y-8 max-w-2xl">
                             <div className="flex flex-col gap-2">
                                <h3 className="text-lg font-medium text-brand-text">Change username</h3>
                                <p className="text-sm text-brand-muted">Changing your username can have unintended side effects.</p>
                                <button onClick={() => showNotImplemented('Change Username')} className="w-fit bg-[#21262d] border border-brand-border hover:bg-brand-border text-brand-text px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                    Change username
                                </button>
                             </div>
                             
                             <div className="border-t border-brand-border"></div>
                             
                             <div className="flex flex-col gap-2">
                                <h3 className="text-lg font-medium text-brand-text">Export account data</h3>
                                <p className="text-sm text-brand-muted">Export all your data from GitGivers.</p>
                                <button onClick={() => showNotImplemented('Export Data')} className="w-fit bg-[#21262d] border border-brand-border hover:bg-brand-border text-brand-text px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                    Start export
                                </button>
                             </div>

                             <div className="border-t border-brand-border"></div>

                             <div className="flex flex-col gap-2">
                                <h3 className="text-lg font-medium text-red-500">Delete account</h3>
                                <p className="text-sm text-brand-muted">Once you delete your account, there is no going back. Please be certain.</p>
                                <button onClick={() => showNotImplemented('Delete Account')} className="w-fit bg-[#21262d] border border-red-500 text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                                    Delete account
                                </button>
                             </div>
                        </div>
                    </div>
                )}

                {['security', 'notifications', 'ssh', 'billing'].includes(activeTab) && (
                     <div className="animate-in fade-in duration-300">
                        <div className="border-b border-brand-border pb-4 mb-6">
                            <h2 className="text-2xl font-normal text-brand-text">
                                {activeTab === 'ssh' ? 'SSH and GPG Keys' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                            </h2>
                        </div>
                        <div className="p-12 text-center border border-brand-border border-dashed rounded-md bg-background">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-panel mb-4 border border-brand-border">
                                <Shield className="w-6 h-6 text-brand-muted" />
                            </div>
                            <h3 className="text-brand-text font-medium mb-2">Work in Progress</h3>
                            <p className="text-brand-muted text-sm max-w-sm mx-auto">
                                This section is currently under development. Check back later for updates.
                            </p>
                        </div>
                     </div>
                )}
            </div>
        </div>
    );
};
