

import React from 'react';
import { Terminal, Gift, Zap, Shield, ChevronRight } from 'lucide-react';

const DocSection: React.FC<{ title: string; children: React.ReactNode; icon?: React.ReactNode }> = ({ title, children, icon }) => (
  <div className="mb-12 border border-brand-border bg-brand-panel/50 rounded-xl p-8 backdrop-blur-sm">
    <div className="flex items-center gap-3 mb-6 border-b border-brand-border pb-4">
      {icon && <div className="text-brand-accent">{icon}</div>}
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
    </div>
    <div className="text-brand-text space-y-4 leading-relaxed">
      {children}
    </div>
  </div>
);

const CodeBlock: React.FC<{ code: string }> = ({ code }) => (
  <div className="bg-background border border-brand-border rounded-lg p-4 font-mono text-sm text-gray-300 my-4 overflow-x-auto">
    <div className="flex gap-2 mb-2">
      <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
      <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
    </div>
    <pre>{code}</pre>
  </div>
);

const Documentation: React.FC = () => {
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-panel border border-brand-border text-xs text-brand-muted mb-4">
            Documentation v1.0
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">GitGivers Documentation</h1>
          <p className="text-xl text-brand-muted">エコシステムの仕組みと、CLIツールの使用方法について</p>
        </div>

        <DocSection title="Getting Started" icon={<Zap className="w-6 h-6" />}>
          <p>
            GitGiversを使い始めるには、まずGitHubアカウントでログインし、CLIツールをインストールすることをお勧めします。
            CLIを使用することで、ターミナルから直接Issueの検索やマッチングを行うことができます。
          </p>
          <CodeBlock code="$ npm install -g gitgivers-cli" />
          <CodeBlock code="$ gitgivers login" />
        </DocSection>

        <DocSection title="The Karma Cycle" icon={<Gift className="w-6 h-6" />}>
          <p>
            GitGiversの経済圏は「Give」から始まります。新規ユーザーはデポジットとして、まず他のプロジェクトへの貢献を行う必要があります。
          </p>
          <ul className="list-disc pl-5 space-y-2 mt-4 text-brand-muted">
            <li><strong className="text-foreground">Karmaの獲得:</strong> 誰かのIssueを解決し、PRがマージされるとKarmaが付与されます。</li>
            <li><strong className="text-foreground">Karmaの消費:</strong> 自分のプロジェクトのIssueにKarmaを設定し、解決を依頼できます。</li>
            <li><strong className="text-foreground">レート:</strong> Issueの難易度（Story Points）と放置期間によってKarmaレートは変動します（Dynamic Pricing）。</li>
          </ul>
        </DocSection>

        <DocSection title="CLI Commands" icon={<Terminal className="w-6 h-6" />}>
          <p>主なコマンド一覧です。</p>
          
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-foreground font-bold flex items-center gap-2"><ChevronRight className="w-4 h-4 text-brand-accent"/> マッチングを探す</h3>
              <p className="text-sm text-brand-muted mt-1">あなたのスキルスタックに基づいて、最適なIssueを提案します。</p>
              <CodeBlock code="$ gitgivers find --lang typescript --level easy" />
            </div>

            <div>
              <h3 className="text-foreground font-bold flex items-center gap-2"><ChevronRight className="w-4 h-4 text-brand-accent"/> 依頼を出す</h3>
              <p className="text-sm text-brand-muted mt-1">現在のリポジトリのIssueをGitGiversに登録します。</p>
              <CodeBlock code="$ gitgivers request --issue 42 --karma 100" />
            </div>

            <div>
              <h3 className="text-foreground font-bold flex items-center gap-2"><ChevronRight className="w-4 h-4 text-brand-accent"/> ステータス確認</h3>
              <p className="text-sm text-brand-muted mt-1">現在の保有Karmaと、進行中のタスクを確認します。</p>
              <CodeBlock code="$ gitgivers status" />
            </div>
          </div>
        </DocSection>

        <DocSection title="Trust & Safety" icon={<Shield className="w-6 h-6" />}>
          <p>
            健全なコミュニティを維持するために、いくつかの自動化された仕組みがあります。
          </p>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="bg-brand-panel p-4 rounded-lg border border-brand-border">
              <h4 className="font-bold text-foreground mb-2">Ghost Buster</h4>
              <p className="text-sm text-brand-muted">
                アサイン後、48時間以上アクティビティがない場合、自動的にアサインが解除され、信頼スコアが低下します。
              </p>
            </div>
            <div className="bg-brand-panel p-4 rounded-lg border border-brand-border">
              <h4 className="font-bold text-foreground mb-2">Kindness Score</h4>
              <p className="text-sm text-brand-muted">
                PRレビュー時のコメントのトーンをAIが解析。攻撃的な言動はKarma没収の対象となります。
              </p>
            </div>
          </div>
        </DocSection>
      </div>
    </div>
  );
};

export default Documentation;
