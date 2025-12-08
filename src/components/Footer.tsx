"use client";

import React from 'react';
import { Twitter, Github, Heart } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useNotImplemented } from '@/hooks/useNotImplemented';
import { NotImplementedDialog } from '@/components/ui/NotImplementedDialog';

const Footer: React.FC = () => {
  const { isOpen, featureName, showNotImplemented, closeNotImplemented } = useNotImplemented();

  return (
    <footer className="bg-background border-t border-brand-border pt-16 pb-8">
        <NotImplementedDialog isOpen={isOpen} onClose={closeNotImplemented} featureName={featureName} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
                <div className="col-span-1 sm:col-span-2 lg:col-span-1">
                    <Link href="/" className="flex items-center gap-2 mb-4 cursor-pointer">
                        <Image src="/icon.png" alt="GitGivers Logo" width={24} height={24} className="object-contain" />
                        <span className="font-bold text-foreground text-xl">GitGivers</span>
                    </Link>
                    <p className="text-sm text-brand-muted leading-relaxed">
                        相互貢献型OSSプラットフォーム。<br />
                        Build together, grow together.
                    </p>
                </div>
                <div>
                    <h4 className="text-foreground font-bold mb-4 tracking-wide">Platform</h4>
                    <ul className="space-y-3 text-sm text-brand-muted">
                        <li><button onClick={() => showNotImplemented('Search')} className="hover:text-brand-accent transition-colors">検索</button></li>
                        <li><button onClick={() => showNotImplemented('Ranking')} className="hover:text-brand-accent transition-colors">ランキング</button></li>
                        <li><button onClick={() => showNotImplemented('Enterprise Plan')} className="hover:text-brand-accent transition-colors">企業向けプラン</button></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-foreground font-bold mb-4 tracking-wide">Resources</h4>
                    <ul className="space-y-3 text-sm text-brand-muted">
                        <li><Link href="/docs" className="hover:text-brand-accent transition-colors">ドキュメント</Link></li>
                        <li><Link href="/docs" className="hover:text-brand-accent transition-colors">API</Link></li>
                        <li><Link href="/guidelines" className="hover:text-brand-accent transition-colors">コミュニティガイドライン</Link></li>
                        <li><Link href="/contribution" className="hover:text-brand-accent transition-colors">コントリビューション</Link></li>
                    </ul>
                </div>

                {/* Sponsors Section */}
                <div>
                    <h4 className="text-foreground font-bold mb-4 tracking-wide">Sponsors</h4>
                    <p className="text-xs text-brand-muted mb-4 leading-relaxed">
                        GitGiversは100%オープンソースです。開発の継続をサポートしてください。
                    </p>
                    <a 
                        href="https://github.com/sponsors" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#db61a2] hover:bg-[#bf4b8a] text-foreground px-4 py-2 rounded-md text-sm font-bold transition-all shadow-lg shadow-pink-500/20 hover:-translate-y-0.5"
                    >
                        <Heart className="w-4 h-4 fill-white" />
                        Sponsor
                    </a>
                </div>

                <div>
                    <h4 className="text-foreground font-bold mb-4 tracking-wide">Connect</h4>
                    <div className="flex space-x-4">
                        <button onClick={() => showNotImplemented('Twitter')} className="text-brand-muted hover:text-foreground transition-colors bg-brand-panel p-2 rounded-lg border border-brand-border hover:border-brand-accent" aria-label="Twitter">
                            <Twitter className="w-5 h-5" />
                        </button>
                        <a href="https://github.com/rikutoyamada01/git-karma" target="_blank" rel="noopener noreferrer" className="text-brand-muted hover:text-foreground transition-colors bg-brand-panel p-2 rounded-lg border border-brand-border hover:border-brand-accent" aria-label="GitHub">
                            <Github className="w-5 h-5" />
                        </a>
                        <button onClick={() => showNotImplemented('Discord')} className="text-brand-muted hover:text-foreground transition-colors bg-brand-panel p-2 rounded-lg border border-brand-border hover:border-brand-accent" aria-label="Discord">
                            {/* Discord Icon SVG */}
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-2.067-9.333-5.236-13.687a.068.068 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className="border-t border-brand-border pt-8 text-center text-sm text-brand-muted font-mono">
                &copy; {new Date().getFullYear()} GitGivers Project. All rights reserved.
            </div>
        </div>
    </footer>
  );
};

export default Footer;
