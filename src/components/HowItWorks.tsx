import React from 'react';
import { HeartHandshake, Coins, Rocket } from 'lucide-react';

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-24 bg-background relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-accent/5 rounded-[100%] blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
                <h2 className="text-sm text-brand-accent font-semibold tracking-widest uppercase mb-2">The Cycle</h2>
                <p className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                    技術のわらしべ長者になろう
                </p>
                <p className="max-w-2xl text-xl text-brand-muted mx-auto leading-relaxed">
                    GitGiversは、一方的なボランティアではありません。<br/>
                    あなたの貢献は、確実にあなたのプロジェクトへと還流します。
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
                {/* Connector Line (Desktop) */}
                <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-brand-border via-brand-accent to-brand-border z-0"></div>

                {/* Step 1 */}
                <div className="relative z-10 flex flex-col items-center group">
                    <div className="w-24 h-24 bg-brand-panel border border-brand-border rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:border-brand-accent transition-all duration-300 shadow-lg shadow-purple-500/10">
                        <HeartHandshake className="w-10 h-10 text-brand-accent" />
                    </div>
                    <div className="bg-brand-panel border border-brand-border p-8 rounded-2xl w-full hover:border-brand-border/80 transition-colors">
                        <h3 className="text-xl font-bold text-foreground text-center mb-4">1. Give (貢献)</h3>
                        <p className="text-brand-muted text-center text-sm leading-relaxed">
                            他人のIssueを解決したり、ドキュメントを翻訳したりします。AIがあなたに最適なタスクを推薦します。
                        </p>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="relative z-10 flex flex-col items-center group">
                    <div className="w-24 h-24 bg-brand-panel border border-brand-border rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:border-yellow-500 transition-all duration-300 shadow-lg shadow-yellow-500/10">
                        <Coins className="w-10 h-10 text-yellow-400" />
                    </div>
                     <div className="bg-brand-panel border border-brand-border p-8 rounded-2xl w-full hover:border-brand-border/80 transition-colors">
                        <h3 className="text-xl font-bold text-foreground text-center mb-4">2. Earn (獲得)</h3>
                        <p className="text-brand-muted text-center text-sm leading-relaxed">
                            PRがマージされると「Karma」を獲得。相手からの感謝スコアが高いほど、報酬がブーストされます。
                        </p>
                    </div>
                </div>

                {/* Step 3 */}
                <div className="relative z-10 flex flex-col items-center group">
                    <div className="w-24 h-24 bg-brand-panel border border-brand-border rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:border-green-500 transition-all duration-300 shadow-lg shadow-green-500/10">
                        <Rocket className="w-10 h-10 text-brand-success" />
                    </div>
                     <div className="bg-brand-panel border border-brand-border p-8 rounded-2xl w-full hover:border-brand-border/80 transition-colors">
                        <h3 className="text-xl font-bold text-foreground text-center mb-4">3. Take (成長)</h3>
                        <p className="text-brand-muted text-center text-sm leading-relaxed">
                            貯めたKarmaを使って、あなたのプロジェクトのバグ修正やテスト作成を依頼。開発が加速します。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default HowItWorks;
