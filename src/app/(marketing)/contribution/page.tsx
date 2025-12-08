

import React from 'react';
import { GitPullRequest, Bug, Terminal } from 'lucide-react';
import Link from 'next/link';

const Contribution: React.FC = () => {
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-panel border border-brand-border text-xs text-brand-muted mb-4">
            CONTRIBUTING.md
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Contributing to GitGivers</h1>
          <p className="text-xl text-brand-muted">
             GitGiversへの貢献に興味を持っていただきありがとうございます。<br/>
             私たちはオープンソースコミュニティの力を信じています。
          </p>
        </div>

        <div className="space-y-8">
            {/* Section 1 */}
            <section className="bg-brand-panel border border-brand-border rounded-xl p-8 hover:border-brand-accent/30 transition-colors">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Bug className="text-brand-accent"/>
                    Bug Reports
                </h2>
                <p className="text-brand-text mb-4 leading-relaxed">
                    バグを発見した場合は、GitHub Issuesで報告してください。報告の際は、以下の情報を含めるとスムーズです。
                </p>
                <ul className="list-disc list-inside text-brand-muted space-y-2 ml-4">
                    <li>発生している問題の明確な説明</li>
                    <li>再現手順（ステップバイステップ）</li>
                    <li>期待される動作と実際の動作</li>
                    <li>スクリーンショットやログ（あれば）</li>
                </ul>
            </section>

             {/* Section 2 */}
            <section className="bg-brand-panel border border-brand-border rounded-xl p-8 hover:border-brand-success/30 transition-colors">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <GitPullRequest className="text-brand-success"/>
                    Pull Request Process
                </h2>
                <p className="text-brand-text mb-4 leading-relaxed">
                    新機能の追加やバグ修正のPRは大歓迎です。以下のプロセスに従ってください。
                </p>
                <ol className="list-decimal list-inside text-brand-muted space-y-3 ml-4">
                    <li>リポジトリをForkし、ローカルにCloneします。</li>
                    <li>新しいブランチを作成します：<code className="bg-[#0d1117] border border-brand-border px-2 py-0.5 rounded text-sm text-brand-text mx-1">git checkout -b feature/amazing-feature</code></li>
                    <li>変更をコミットします。コミットメッセージは具体的にお願いします。</li>
                    <li>テストを実行し、全てパスすることを確認してください。</li>
                    <li>PRを作成し、変更内容と目的を詳細に記述してください。</li>
                </ol>
            </section>

            {/* Section 3 */}
            <section className="bg-brand-panel border border-brand-border rounded-xl p-8 hover:border-yellow-500/30 transition-colors">
                 <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <Terminal className="text-yellow-500"/>
                    Development Setup
                </h2>
                <div className="bg-[#0d1117] border border-brand-border rounded-lg p-6 font-mono text-sm text-gray-300 overflow-x-auto shadow-inner">
                    <div className="flex gap-2 mb-4">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <p className="text-brand-muted mb-1"># 依存関係のインストール</p>
                            <p className="text-brand-text">$ npm install</p>
                        </div>
                        <div>
                            <p className="text-brand-muted mb-1"># 開発サーバーの起動</p>
                            <p className="text-brand-text">$ npm run dev</p>
                        </div>
                        <div>
                            <p className="text-brand-muted mb-1"># テストの実行</p>
                            <p className="text-brand-text">$ npm test</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <div className="mt-16 text-center border-t border-brand-border pt-8">
            <p className="text-brand-muted mb-4">
                コミュニティのルールについては、ガイドラインをご確認ください。
            </p>
            <Link 
                href="/guidelines"
                className="text-brand-accent hover:underline font-medium hover:text-brand-accentHover transition-colors"
            >
                コミュニティガイドラインを確認する
            </Link>
        </div>

      </div>
    </div>
  );
};

export default Contribution;
