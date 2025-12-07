'use client';

import { useState, useEffect } from 'react';
import {  Wrench, X, Database, User } from 'lucide-react';
import { ModelEditor } from './ModelEditor';
import { SessionInspector } from './SessionInspector';

export default function DevToolbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'models' | 'session'>('models');
  const [isClient, setIsClient] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    const timer = setTimeout(() => setIsClient(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!isClient) return null;

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all border border-gray-700"
        aria-label="Open DevTools"
      >
        <Wrench size={24} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end sm:items-center sm:justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full h-[80vh] sm:w-[800px] sm:h-[600px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-t-xl sm:rounded-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-indigo-500" />
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">DevTools</h2>
            <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-full">
              Local
            </span>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/50">
          <TabButton 
            active={activeTab === 'models'} 
            onClick={() => setActiveTab('models')}
            icon={<Database className="w-4 h-4" />}
            label="DB Editor"
          />
          <TabButton 
            active={activeTab === 'session'} 
            onClick={() => setActiveTab('session')}
            icon={<User className="w-4 h-4" />}
            label="Session"
          />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'models' && <ModelEditor />}
          {activeTab === 'session' && <SessionInspector />}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-r border-zinc-200 dark:border-zinc-800
        ${active 
          ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 border-b-2 border-b-indigo-500' 
          : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 bg-zinc-50 dark:bg-zinc-950 border-b border-transparent'}
      `}
    >
      {icon}
      {label}
    </button>
  );
}
