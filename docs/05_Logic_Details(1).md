# **5\. 機能詳細・ロジック設計 (Logic Details)**

## **5.1. GitHub連携ポリシー & 公開制御**

### **5.1.1. リポジトリの登録制限**

* **ルール**: GitHub APIにより、対象リポジトリの visibility が public であることを確認できた場合のみ登録可能。  
* **強制非公開化**: Webhook (repository event) で privatized を検知した場合、即座に isPublicOnGitHub を false に更新し、GitKarma上の検索結果から除外する。

### **5.1.2. Issueの管理・削除**

* **Assign制御**: 1つのIssueに対する assignee は1名のみ。GitHub側でAssignが発生すると、GitKarma上では「募集中」リストから消える。  
* **自動削除**: IssueがClosedになった場合、GitKarmaのDBから該当Issueレコードを削除（物理削除 または archived フラグによる論理削除）し、長期保存しない。

## **5.2. Karma (報酬) ロジック**

### **5.2.1. Karma付与タイミング**

* 原則として **Issue Closed時** にまとめて計算・付与する。  
* 毎日のログインボーナス等は設けない（評価の変動やインフレを避けるため）。

### **5.2.2. コアコンセプト: "Don't Code Alone"**

GitKarmaは「既に成熟した人気リポジトリ」よりも、\*\*「まだ発見されていないが、熱心に開発されているリポジトリ（0 Starの原石）」\*\*を救うことを重視する。 したがって、Karmaの算出においても **「不人気（Low Stars）」かつ「高頻度（High Activity）」** であるほど価値が高いと判定する。

### **5.2.3. 付与対象と計算式**

Issue I がCloseされた際のKarma付与ロジック：  
**A. Assignee (解決担当者) への報酬** Assigneeは、そのIssueに設定された報酬総額を**独占して受け取る**。

1. **基本報酬 (K\_{base})**: Issueの難易度等に基づくベース値。  
2. **発見係数 (M\_{discovery})**: リポジトリの成熟度に応じた倍率。  
   * **Star数が少ないほど高い**（例: 0 starなら 2.0倍, 1000 starsなら 1.0倍）。  
   * **更新頻度が高いほど高い**（直近のCommit頻度等で補正）。  
   * *「誰も知らないが活発なリポジトリ」のIssueを解決することが、最も稼げるアクションとなる。*  
3. **Boostボーナス (\\sum K\_{boost})**: このIssueに対してユーザーから投資されたKarma総量。

**B. その他の貢献者への報酬 (Participation Reward)** Assignされていないが、コメントやレビューで貢献したユーザーへの報酬は、上記 Karma\_{Total} とは**別枠**で付与する。

* **仕組み**: Action Based Karma  
* **内容**: コメント1回につき N ポイント、PRレビュー1回につき M ポイントなど、アクションベースの少額固定給を与える（上限あり）。

## **5.3. おすすめ表示 (Discovery) ロジック**

### **5.3.1. レコメンドアルゴリズム**

「埋もれたリポジトリの発見」を促進するため、単に人気があるものではなく、以下の基準でスコアリングを行い、一覧の表示順位（Recommendation Order）を決定する。

1. **Popularity (分母)**: GitHub Stars数など。  
   * **低いほどスコアが高くなる**（未発見のリポジトリを優先）。  
2. **Activity (分子)**: 直近1ヶ月のCommit数やIssue更新頻度。  
   * 更新が止まっているリポジトリは、いくら無名でもおすすめしない。  
   * \*\*「現在進行系で孤独に頑張っている」\*\*リポジトリを救い上げる。  
3. **BoostWeight (分子)**: Issueに投資されたKarma量。  
   * ユーザーが「これを見てくれ！」とBoostした意思を反映。

### **5.3.2. Boostの返却**

* Issueが（解決されずに）削除された場合や、ユーザーがBoostを取り消した場合：  
  * 未使用分（解決に使われなかった分）として返却するロジックを検討する。  
  * **初期実装**: シンプルに「Issue Open中ならいつでもキャンセル可能、全額返却」とするか、「解決報酬として確定した後は返却不可」とする。

## **5.4. 状態遷移 (Issue Lifecycle)**

`stateDiagram-v2`  
    `[*] --> Unregistered`  
      
    `Unregistered --> Registered: Ownerが "@gitkarma" 記述`  
      
    `state Registered {`  
        `[*] --> Open`  
        `Open --> Boosted: UserがKarma投入`  
        `Boosted --> Open: Boost取消`  
    `}`

    `Registered --> Assigned: GitHubでAssign発生`  
    `Assigned --> Registered: Assign解除`  
      
    `Assigned --> Closed: Issue Closed (GitHub)`  
    `Registered --> Closed: Issue Closed (GitHub)`  
      
    `Closed --> [*]: DBから削除 / Karma付与完了`  
