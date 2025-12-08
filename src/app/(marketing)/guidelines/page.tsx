

import React from 'react';
import { Heart, AlertTriangle, CheckCircle, Calculator, Zap, Star, Clock } from 'lucide-react';

const Guidelines: React.FC = () => {
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-panel border border-brand-border text-xs text-brand-muted mb-4">
            Community Standards
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">コミュニティガイドライン</h1>
          <p className="text-xl text-brand-muted">GitGiversは、「技術」と「優しさ」の循環を目指しています。</p>
        </div>

        <div className="space-y-8">
          {/* Principle 1 */}
          <div className="bg-brand-panel border border-brand-border rounded-xl p-8 hover:border-brand-accent/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-brand-panel rounded-lg border border-brand-border text-brand-accent">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">Be Kind, Be Constructive.</h3>
                <p className="text-brand-text leading-relaxed">
                  コードの向こう側には人間がいます。レビューコメントは常に建設的であるべきです。
                  「ここがダメ」ではなく「こうすればもっと良くなる」と提案しましょう。
                  AIによるKindness Scoreが低いユーザーは、マッチングで不利になります。
                </p>
              </div>
            </div>
          </div>

          {/* Principle 2 */}
          <div className="bg-brand-panel border border-brand-border rounded-xl p-8 hover:border-brand-accent/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-brand-panel rounded-lg border border-brand-border text-brand-success">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">Quality over Quantity.</h3>
                <p className="text-brand-text leading-relaxed">
                  Karma稼ぎのための微細な修正（typo修正のみの大量PRなど）は推奨されません。
                  本質的な課題解決にKarmaは多く配分されます。スパム行為は即座にBAN対象となります。
                </p>
              </div>
            </div>
          </div>

          {/* Principle 3 */}
          <div className="bg-brand-panel border border-brand-border rounded-xl p-8 hover:border-brand-accent/50 transition-colors">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-brand-panel rounded-lg border border-brand-border text-yellow-500">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-3">Respect the Time.</h3>
                <p className="text-brand-text leading-relaxed">
                  アサインされたタスクを放置することは、依頼者の時間を奪うことです。
                  着手が遅れる場合は早めに連絡するか、アサインを解除してください。
                  無言での放置（Ghosting）は、プラットフォーム上で最も重いペナルティが課されます。
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Karma Mechanics Section */}
        <div className="mt-24">
            <div className="flex items-center justify-center gap-3 mb-8">
                <Calculator className="w-6 h-6 text-brand-accent" />
                <h2 className="text-3xl font-bold text-foreground text-center">Karmaの算出ロジック</h2>
            </div>
            
            <p className="text-brand-muted text-center max-w-2xl mx-auto mb-12">
                Karmaは単なるポイントではありません。あなたの貢献がどれだけの価値を生み出したかを測る指標です。以下の4つの軸で評価されます。
            </p>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-background border border-brand-border p-6 rounded-xl hover:border-brand-accent/30 transition-colors">
                    <h3 className="text-brand-accent font-bold mb-3 flex items-center gap-2 text-lg">
                        <Zap className="w-5 h-5" />
                        1. Issue Complexity
                    </h3>
                    <p className="text-brand-muted text-sm leading-relaxed">
                        アルゴリズムがIssueの内容を解析し、Base Karmaを算出します。簡単なバグ修正から、アーキテクチャの変更まで、難易度（Story Points）に応じた適正な対価が設定されます。
                    </p>
                </div>
                <div className="bg-background border border-brand-border p-6 rounded-xl hover:border-brand-success/30 transition-colors">
                    <h3 className="text-brand-success font-bold mb-3 flex items-center gap-2 text-lg">
                        <CheckCircle className="w-5 h-5" />
                        2. Code Quality
                    </h3>
                    <p className="text-brand-muted text-sm leading-relaxed">
                        テストカバレッジの向上、Lintエラーの不在、可読性の高さ。AIとメンテナによるレビューで、高品質なコードには最大1.5倍のボーナスが付与されます。
                    </p>
                </div>
                <div className="bg-background border border-brand-border p-6 rounded-xl hover:border-yellow-500/30 transition-colors">
                    <h3 className="text-yellow-500 font-bold mb-3 flex items-center gap-2 text-lg">
                        <Star className="w-5 h-5" />
                        3. Reviewer Feedback
                    </h3>
                    <p className="text-brand-muted text-sm leading-relaxed">
                         マージ後のメンテナからのフィードバック。「助かった」「素晴らしい実装だ」という定性的な評価や、感謝の言葉が直接Karmaに反映されます。
                    </p>
                </div>
                <div className="bg-background border border-brand-border p-6 rounded-xl hover:border-blue-500/30 transition-colors">
                    <h3 className="text-blue-500 font-bold mb-3 flex items-center gap-2 text-lg">
                         <Clock className="w-5 h-5" />
                        4. Responsiveness
                    </h3>
                    <p className="text-brand-muted text-sm leading-relaxed">
                        アサインからPR作成までのスピード、レビュー指摘へのレスポンス速度。スムーズなコミュニケーションは、プロフェッショナルな信頼の証として評価されます。
                    </p>
                </div>
            </div>
        </div>

        <div className="mt-16 p-6 bg-brand-accent/10 border border-brand-accent/20 rounded-xl text-center">
          <p className="text-brand-text text-sm">
            違反報告やサポートが必要な場合は、
            <button className="text-brand-accent hover:underline font-bold mx-1">
              Support Team
            </button>
            までご連絡ください。
          </p>
        </div>
      </div>
    </div>
  );
};

export default Guidelines;
