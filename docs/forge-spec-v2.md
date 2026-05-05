# Forge — 日本のAI運用OS 完全実装仕様書 v2.0

**この1ファイルだけで、Claude Codeがゼロから本番デプロイ・Phase 3着手まで完走できる**完全版設計仕様。質問・確認・選択肢ゼロで実装すること。v1.0は破棄、こちらが正本。

---

## 0. 5秒で全体像

| レイヤー | 内容 | 役割 | 利益率 |
|---------|------|------|--------|
| L1: **Forge Build** | AI実装の受託 | 集客の入口 | 20-25% |
| L2: **Forge Operate** | 月額運用 | MRRの主軸 | 50% |
| L3: **Forge OS** | 運用基盤PaaS | コピー不能の堀 | (内製) |
| L4: **Forge Cloud** | 自社SaaS群 | 高利益・出口戦略 | 70% |
| L5: **Forge Index** | データ販売・メディア | ブランド独占 | 80% |

**事業の本質**: 受託会社（売上連動）ではなく、AI運用インフラ会社（ストック・データ・ネットワーク効果）。

**12ヶ月の到達点**:
- Phase 1（Month 1-3）: Build+Operate走り出し、Operate3-5社、月MRR100-300万円
- Phase 2（Month 4-6）: Forge OS v0.1稼働、Operate10社、月MRR500万円
- Phase 3（Month 7-12）: OS v1.0、Cloud第1弾、Index β版、Operate15社、月MRR700万円

**最終ブランド**: 「**AIを、動かし続ける。**」

---

## 1. 前提・制約

### ビジネス構造
- **表向き**: 日本のAI運用インフラ。Build（実装）→ Operate（運用）→ OS（運用基盤）の三位一体提供
- **実態**: Yuraの**既存株式会社**が元請、登録エンジニアに業務委託で発注。新規法人不要
- **マージン構造**: Build 20-25%、Operate 50%、OS/Cloud/Index は内製で利益率最大化

### 絶対要件
- モバイル最優先（フォーム・LPは全部スマホで完結）
- 日本語のみ（Year 2で韓国語・繁体字対応検討）
- 適格請求書発行事業者（既存法人で取得済み前提）
- 個人情報保護法・改正電気通信事業法準拠
- 特商法表記必須

### 偽装請負回避（最重要・違反は事業継続不可）
- エンジニアへの**指揮命令はしない**
- 稼働時間・場所・作業手順を**指定しない**
- すべて**成果物完成責任型**で契約
- 案件票には「成果物」「納期」「報酬」のみ。「就業時間」「常駐」「日報義務」は禁止
- 詳細チェックリストは §15

### 既存資産の流用（重要）
| 既存資産 | Forgeでの役割 |
|---------|--------------|
| imaginate（Supabase/Vercel/fal.ai/R2） | OS基盤に流用、インフラ初期コストほぼゼロ |
| JARVIS（SNS自動化エンジン） | Operate運用の通知・モニタリング自動化、Indexのデータ集計 |
| BuzzLens（バイラル分析） | Forge Index のデータ集計エンジン |
| content-automation（GitHub Actions+Supabase+Gemini/Anthropic） | 営業AI、コールドメール自動化 |
| VideoTracker（不動産ピボット中） | Forge Cloud 不動産プロダクトに統合可 |
| KURONEKO（決定論キャッシュ） | OSのプロンプトキャッシュ層に流用 |
| Claude Code + yura系スキル群 | 開発スピード3〜5倍 |

これにより、ゼロから作れば3000万円かかる開発が**実質500万円以下**で立ち上がる。

---

## 2. ブランド定義 v2.0

| 項目 | 値 |
|------|---|
| 名称 | Forge |
| 表記 | Forge（カタカナ・ひらがな表記禁止） |
| ドメイン優先順 | `forge.jp` → `getforge.jp` → `joinforge.jp` → `forge-ai.jp` |
| **タグライン（H1）** | **AIを、動かし続ける。** |
| サブコピー | 構築だけじゃない。評価・運用・進化まで。日本のAIインフラを、Forgeから。 |
| 副タグ（社外向け） | Powered by Forge（顧客プロダクトの裏側ブランディング、Year 2以降） |

### カラー
| 用途 | HEX |
|------|-----|
| Primary（黒） | `#0A0A0A` |
| Accent（鍛冶火オレンジ） | `#FF6B35` |
| Surface | `#F5F5F4` |
| Border | `#E7E5E4` |
| Text Muted | `#57534E` |
| Background | `#FFFFFF` |
| Success（運用OK） | `#10B981` |
| Warning（精度劣化） | `#F59E0B` |
| Error（インシデント） | `#EF4444` |

### タイポグラフィ
- 英数字: `Geist`（next/font/google経由）または `Inter`
- 日本語: `Noto Sans JP`（400/500/700）
- 見出しは`tracking-tight`、本文は`leading-relaxed`

### トーン
- 説明的でなく**断言的**（「〜できます」より「〜する」）
- 専門用語OK（情シス・経営者・エンジニアがターゲット）
- 絵文字・！の多用禁止
- Vercel / Linear / Anthropic / Stripe公式LPの言語感

### NG表現
- 「業界最安値」「圧倒的」「革新的」「世界一」「驚くほど簡単」「誰でもできる」
- 「フリーランス1.0時代の終焉」みたいな大言壮語

---

## 3. 戦略フレーム

### 3.1 5層モデルの設計原理

```
レイヤー5: Forge Index（業界レポート・データ販売）       Year 3-
レイヤー4: Forge Cloud（業界別SaaS群）                  Year 2-
レイヤー3: Forge OS（運用基盤PaaS、外販しない）         Phase 2-
レイヤー2: Forge Operate（月額運用、MRR主軸）            Phase 1-
レイヤー1: Forge Build（受託、入口）                    Phase 1-
```

**設計原理**:
- 下層ほど薄利・高頻度、上層ほど高利益・低頻度
- **入口は誰でも入れる、出口は誰も出られない**構造
- Build契約には**Operate最低6ヶ月**を組み込み、Buildだけ欲しい客は通常価格1.5倍
- Operate顧客は全員Forge OS上に乗る（OS外販はしない）
- 受託案件で同じ要件が3社出たらForge Cloudにプロダクト化
- 全顧客の匿名化データがForge Indexに集約

### 3.2 競合非対称性

| 競合候補 | Forgeとの差 |
|---------|-----------|
| レバテック・ギークス | 人材紹介、Forgeは元請＋運用＋OS、別カテゴリ |
| アクセンチュア・PwC | 戦略コンサル中心、Forgeは実装＋運用、価格帯が10倍違う |
| ABEJA・PKSHA | AI受託、Forgeは運用OSとSaaS群、ストック比率が逆 |
| LangFuse・LangSmith | 汎用ツール、Forgeは日本市場×業界別運用OS |
| 他のAIエージェンシー | Buildだけ、Forgeは5層構造 |

**結論**: どの競合とも"半分被って半分ズレてる"。「日本のAI運用OS」というカテゴリを自分で作る。

### 3.3 準・永久機関の3条件

物理的に永久機関は不可能。しかし**競合がコピーする速度より速く堀が深まり続ける構造**は作れる。

**条件1: データ複利が止まらない仕組み**
- 全顧客の同意ベースで、匿名化されたプロンプト履歴・評価データをOSの共通ナレッジに集約
- 業界別「失敗パターン辞書」を構築（個別案件では絶対に蓄積されないデータ）
- 古い案件のメトリクスも保存し続ける（モデルAとBの3年分の精度比較は新規参入者が絶対作れない）
- → 創業10年目のデータ価値 > 新規参入者が10億投じて作るデータ

**条件2: 進化を組織のDNAに埋め込む**
- R&D予算と時間を強制配分（Google 20%ルール的な強制）
- Forge OSをモジュール化、3年に1回コア書き換えできる構造
- LLMベンダー1社依存を避ける（Anthropic / OpenAI / Google / Meta / 国産モデル全部とパイプ）
- 新興技術（Agent OS、ロボティクス、量子）の小規模実験を年5件継続

**条件3: ネットワーク効果ループ**
1. **顧客 ↔ 顧客**: Forge Indexが顧客同士のベンチマークを生む。同業他社が入っているForgeに入らないと取り残される
2. **顧客 ↔ エンジニア**: Forge Insiderコミュニティで両面ネットワーク
3. **データ ↔ プロダクト**: 顧客データがOS精度を上げる→精度向上が新規顧客を呼ぶ→さらにデータが溜まる

3年で3つ全部回り始めると、後発がどれだけ資金投下しても追いつけない。

### 3.4 Year 1利益最大化（理想を目指して現実が死なないため）

「永久機関を目指して今日が脆くなる」を避ける。Year 1は**現実の利益を出しながら、堀の種を仕込む**。

- Year 1: Build利益率を**30%取る**（赤字運用しない）。利益はR&D（OS開発）に再投資
- Year 2: OperateとOSが回り始めたら利益率50%まで上げる
- Year 3: 5層構造完成、利益率60%

### 3.5 撤退条件（損切りライン）

各層のKPI閾値を最初から決めておく。情に流されないため。

| 層 | 撤退判断KPI | 閾値 |
|----|------------|------|
| Build | 月次受注件数 | 3ヶ月連続0件 |
| Operate | MRR成長率 | 3ヶ月連続マイナス |
| OS | 顧客側の利用率 | 6ヶ月後でも50%未満 |
| Cloud | プロダクトARR | Year 2終了時に1000万未満 |
| Index | 有料購読数 | Year 3終了時に20社未満 |

撤退判断は単独で下さない。Yura+顧問+主要エンジニア1名で月次レビュー（Year 2以降）。

---

## 4. 12ヶ月ロードマップ

### Phase 1: 走り出し（Month 1-3）

**ゴール**: Build+Operateの最小実装で、案件3-5件を回し、月MRR100-300万円。

#### Week 1-2: 基盤構築
- ドメイン取得（forge.jp）
- Supabase / Vercel / Resend / Cloudflare R2 セットアップ
- Next.js 14プロジェクト初期化（既存imaginateリポジトリの設定流用）
- DBスキーマ v2.0 適用
- LP公開（公開ページ＋SEO）

#### Week 3-4: フォーム・管理画面
- 企業相談フォーム
- エンジニア登録フォーム（GitHub OAuth）
- 管理画面 v1（Yura専用、Build案件管理）
- メールテンプレ4種実装
- 契約書3種ひな形（Build / Operate / NDA）

#### Week 5-6: マーケ起動
- X/Threads告知でエンジニア20名集める（YuraとForge公式アカウント並走）
- 既存ネットワーク向け案内
- 企業向けコールドメール30社送信
- note記事1本目「AI実装は誰に頼むかが9割」

#### Week 7-8: 1件目商談
- 商談3-5件
- 1件目受注（Build+Operateセット）
- 契約締結、エンジニアアサイン
- Build開始

#### Week 9-12: 1件目納品 → Operate開始
- 1件目納品（PoC〜小規模実装、2-4週間）
- Operate契約発動（OS v0.1で監視・運用、最初は手動運用＋LangFuse外部利用）
- 2-3件目受注
- 事例化（許諾取得）

**Phase 1 KPI**:
- 登録エンジニア20-30名
- 受注Build案件3-5件
- Operate契約3社、月MRR100-300万円
- LP MAU 1000-3000
- 事例コンテンツ1-2本

### Phase 2: OS稼働（Month 4-6）

**ゴール**: Forge OS v0.1（社内ツール）を稼働させ、運用効率を3倍化。Operate10社、月MRR500万円。

#### Month 4: Forge OS v0.1 設計・実装
- LangFuse / LangSmith / Helicone 統合パッケージ作成
- 評価ハーネス標準テンプレ（業界別5種：金融・医療・法律・不動産・小売）
- モデルコスト追跡ダッシュボード（社内のみ）
- インシデント自動検知（精度劣化、コスト急増、APIエラー）
- 運用レポート自動生成（月次PDF）

#### Month 5: 顧客向けダッシュボード
- Forge OS v0.5（顧客が見られる運用ダッシュボード）
- リアルタイムメトリクス、コスト、評価結果
- アラート設定UI
- プロンプト版管理（Gitライク）

#### Month 6: スケール
- Operate契約10社到達
- OS統一運用で1人あたりの運用負荷を1/3に削減
- 第2の事例コンテンツ3本目
- 広告ON（Google広告月20万、Meta広告月10万）

**Phase 2 KPI**:
- 登録エンジニア50名
- Build累計10件
- Operate契約10社、月MRR500万円
- OS稼働率99.5%
- 顧客解約率5%以下

### Phase 3: 横展開（Month 7-12）

**ゴール**: OS v1.0公開、Cloud第1弾、Index β版。Operate15社、月MRR700万円、Year 1売上1.5億ペース。

#### Month 7-8: OS v1.0
- 顧客向けダッシュボードの本格公開（プレスリリース）
- セルフサーブ機能（小規模顧客が自分で操作できる）
- API公開（顧客が自社システムから利用可能）

#### Month 9-10: Forge Cloud第1弾
- 受託案件で「同じ要件3社以上」をモニタリング
- 最初に該当した業界（不動産 / 法律 / 医療のいずれか）でプロダクト化開始
- VideoTrackerと統合する場合は不動産プロダクト優先
- ローンチ準備（β顧客5社）

#### Month 11-12: Forge Index β
- データ収集スキーマ稼働（Year 1から仕込み開始）
- 業界別AI実装トレンドレポート第1号（無料配布、リード獲得）
- 有料版の設計（Year 2でローンチ）

**Phase 3 KPI**:
- 登録エンジニア80-100名
- Build累計20-25件
- Operate契約15社、月MRR700万円
- Cloud第1弾β顧客5社
- Index無料版ダウンロード500社
- Year 1売上1.5億ペース、利益5000万円

---

## 5. 技術スタック

| レイヤー | 技術 | 用途 |
|---------|------|------|
| フレームワーク | Next.js 14 (App Router, TypeScript) | 全体 |
| UI | Tailwind CSS + shadcn/ui | 全体 |
| アイコン | Lucide React | 全体 |
| DB / Auth / Storage | Supabase（PostgreSQL, Tokyo region） | 全体 |
| ホスティング | Vercel（Pro plan、既存） | 全体 |
| ファイルストレージ | Cloudflare R2（既存imaginateと共通） | 契約書PDF、レポート |
| トランザクションメール | Resend | 全体 |
| 決済（Phase 1.5以降） | Stripe Connect Express | Operate月額決済 |
| GitHub OAuth | Supabase Auth | エンジニア認証 |
| アナリティクス | Vercel Analytics + Plausible | LP・管理画面 |
| エラー監視 | Sentry | 全体 |
| Form Validation | React Hook Form + Zod | 全体 |
| Date | date-fns | 全体 |
| **LLM観測（Phase 2）** | LangFuse self-hosted（OS同梱） | OS監視層 |
| **LLM評価** | LangSmith / promptfoo / Forge自社評価ハーネス | 評価ハーネス |
| **コスト追跡** | Helicone or Forge自前 | OSコストダッシュボード |
| **モデル接続** | Anthropic / OpenAI / Google / Bedrock / 国産（PLaMo, Tanuki, Swallow） | OSモデルルーター |
| **ベクターDB** | Supabase Vector / Pinecone | RAG案件 |

### Phase 1 初期インストール
```bash
npx create-next-app@latest forge --typescript --tailwind --app --src-dir --import-alias "@/*"
cd forge
npx shadcn@latest init -d
npx shadcn@latest add button input textarea select card badge avatar dialog form label tabs toast separator table dropdown-menu sheet
npm i @supabase/supabase-js @supabase/ssr resend zod react-hook-form @hookform/resolvers lucide-react date-fns
npm i -D @types/node
```

### Phase 2 追加（OS開発時）
```bash
npm i langfuse langfuse-langchain @ai-sdk/anthropic @ai-sdk/openai @ai-sdk/google ai
npm i recharts # OSダッシュボード用
npm i @tanstack/react-table # 大量データテーブル
```

---

## 6. DBスキーマ v2.0（Supabase / PostgreSQL）

```sql
-- ============================================
-- ENUMS
-- ============================================
create type engineer_status as enum ('pending', 'active', 'paused', 'banned');
create type project_status as enum ('inquiry', 'qualified', 'matching', 'in_progress', 'completed', 'cancelled');
create type project_phase as enum ('build', 'eval', 'operate'); -- v2.0新規
create type assignment_status as enum ('proposed', 'accepted', 'declined', 'in_progress', 'completed');
create type project_type as enum ('llm_app', 'rag', 'agent', 'automation', 'integration', 'consulting', 'other');
create type budget_range as enum ('under_500k', '500k_1m', '1m_3m', '3m_5m', '5m_10m', 'over_10m');
create type duration_range as enum ('spot', 'under_1m', '1m_3m', '3m_6m', 'over_6m');
create type subscription_status as enum ('trial', 'active', 'paused', 'cancelled'); -- v2.0新規
create type incident_severity as enum ('info', 'warning', 'error', 'critical'); -- v2.0新規
create type industry as enum ('finance', 'healthcare', 'legal', 'real_estate', 'retail', 'manufacturing', 'hr', 'education', 'media', 'other'); -- v2.0新規

-- ============================================
-- engineers（v1から継承）
-- ============================================
create table engineers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique,
  github_username text not null unique,
  display_name text not null,
  email text not null unique,
  avatar_url text,
  bio text,
  skills text[] default '{}',
  ai_specialties text[] default '{}',
  hourly_rate_min int,
  hourly_rate_max int,
  monthly_rate_min int,
  monthly_rate_max int,
  available_hours_per_week int,
  available_from date,
  portfolio_urls text[] default '{}',
  past_projects jsonb default '[]',
  status engineer_status default 'pending',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index engineers_status_idx on engineers(status);
create index engineers_skills_idx on engineers using gin(skills);
create index engineers_specialties_idx on engineers using gin(ai_specialties);

-- ============================================
-- companies（v2.0: industry追加）
-- ============================================
create table companies (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  contact_name text not null,
  contact_email text not null,
  contact_phone text,
  industry industry,
  company_size text,
  website_url text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index companies_email_idx on companies(contact_email);
create index companies_industry_idx on companies(industry);

-- ============================================
-- projects（v2.0: phase, deliverables, monetary追加）
-- ============================================
create table projects (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade not null,
  title text not null,
  description text not null,
  project_type project_type not null,
  required_skills text[] default '{}',
  budget_range budget_range not null,
  duration duration_range not null,
  start_date date,
  deliverables text not null, -- 偽装請負回避のため必須
  status project_status default 'inquiry',
  current_phase project_phase default 'build', -- v2.0
  internal_notes text,
  client_revenue int,
  engineer_payout int,
  margin_amount int generated always as (client_revenue - engineer_payout) stored,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index projects_status_idx on projects(status);
create index projects_phase_idx on projects(current_phase);
create index projects_company_idx on projects(company_id);

-- ============================================
-- assignments（v1から継承、エンジニア×案件）
-- ============================================
create table assignments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  engineer_id uuid references engineers(id) on delete cascade not null,
  status assignment_status default 'proposed',
  phase project_phase default 'build', -- v2.0: どのphaseのアサインか
  monthly_payout int, -- 月額アサインの場合
  proposed_at timestamptz default now(),
  responded_at timestamptz,
  started_at timestamptz,
  completed_at timestamptz,
  notes text,
  unique(project_id, engineer_id, phase)
);

create index assignments_project_idx on assignments(project_id);
create index assignments_engineer_idx on assignments(engineer_id);
create index assignments_status_idx on assignments(status);

-- ============================================
-- inquiries（v1から継承）
-- ============================================
create table inquiries (
  id uuid primary key default gen_random_uuid(),
  source text default 'website',
  company_name text,
  contact_name text,
  contact_email text,
  message text not null,
  raw_payload jsonb,
  processed boolean default false,
  project_id uuid references projects(id),
  created_at timestamptz default now()
);

-- ============================================
-- subscriptions（v2.0新規: Operate月額契約）
-- ============================================
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  company_id uuid references companies(id) not null,
  status subscription_status default 'trial',
  monthly_amount int not null, -- 円
  engineer_payout int, -- エンジニアへの月次支払い
  margin int generated always as (monthly_amount - engineer_payout) stored,
  start_date date not null,
  end_date date,
  minimum_term_months int default 6, -- 最低契約期間
  auto_renew boolean default true,
  stripe_subscription_id text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index subscriptions_status_idx on subscriptions(status);
create index subscriptions_project_idx on subscriptions(project_id);

-- ============================================
-- incidents（v2.0新規: 運用インシデント）
-- ============================================
create table incidents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  severity incident_severity not null,
  title text not null,
  description text,
  detected_by text, -- 'auto' / 'manual' / 'customer'
  metric_type text, -- 'accuracy' / 'cost' / 'latency' / 'error_rate'
  metric_value numeric,
  threshold numeric,
  resolved boolean default false,
  resolved_at timestamptz,
  resolution_notes text,
  created_at timestamptz default now()
);

create index incidents_project_idx on incidents(project_id);
create index incidents_severity_idx on incidents(severity);
create index incidents_resolved_idx on incidents(resolved);

-- ============================================
-- evaluations（v2.0新規: 評価メトリクス）
-- ============================================
create table evaluations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  eval_set_id text not null, -- 評価データセットの識別子
  model_name text not null, -- 'claude-opus-4-7' 等
  prompt_version text,
  accuracy numeric,
  cost_per_eval numeric,
  latency_ms int,
  passed_count int,
  failed_count int,
  total_count int,
  raw_results jsonb,
  evaluated_at timestamptz default now()
);

create index evaluations_project_idx on evaluations(project_id);
create index evaluations_evaluated_at_idx on evaluations(evaluated_at desc);

-- ============================================
-- prompts（v2.0新規: プロンプト版管理）
-- ============================================
create table prompts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  name text not null,
  version int not null default 1,
  content text not null,
  variables jsonb default '{}',
  metadata jsonb default '{}',
  is_active boolean default false,
  created_by uuid references auth.users(id),
  created_at timestamptz default now(),
  unique(project_id, name, version)
);

create index prompts_project_name_idx on prompts(project_id, name);
create index prompts_active_idx on prompts(is_active) where is_active = true;

-- ============================================
-- model_costs（v2.0新規: モデル別コスト追跡）
-- ============================================
create table model_costs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  model_name text not null,
  date date not null,
  input_tokens bigint default 0,
  output_tokens bigint default 0,
  total_cost_jpy numeric default 0,
  request_count int default 0,
  unique(project_id, model_name, date)
);

create index model_costs_project_date_idx on model_costs(project_id, date desc);

-- ============================================
-- consent_records（v2.0新規: データ利用同意）
-- ============================================
create table consent_records (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  company_id uuid references companies(id) not null,
  consent_type text not null, -- 'index_data' / 'case_study' / 'os_logging'
  consented boolean not null,
  consented_at timestamptz default now(),
  expires_at timestamptz,
  document_url text,
  notes text
);

create index consent_records_project_idx on consent_records(project_id);
create index consent_records_type_idx on consent_records(consent_type);

-- ============================================
-- index_data_points（v2.0新規: Forge Index用データ）
-- ============================================
create table index_data_points (
  id uuid primary key default gen_random_uuid(),
  industry industry not null,
  metric_name text not null, -- 'avg_implementation_cost', 'model_share', 'hallucination_rate'
  metric_value numeric not null,
  metric_unit text,
  data_source_count int, -- 何社のデータから集計したか
  collected_at date not null,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

create index index_data_points_industry_idx on index_data_points(industry);
create index index_data_points_collected_at_idx on index_data_points(collected_at desc);

-- ============================================
-- admins
-- ============================================
create table admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  email text not null unique,
  role text default 'admin',
  created_at timestamptz default now()
);

-- ============================================
-- Trigger: updated_at
-- ============================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger engineers_updated_at before update on engineers
  for each row execute function set_updated_at();
create trigger companies_updated_at before update on companies
  for each row execute function set_updated_at();
create trigger projects_updated_at before update on projects
  for each row execute function set_updated_at();
create trigger subscriptions_updated_at before update on subscriptions
  for each row execute function set_updated_at();

-- ============================================
-- RLS（Row Level Security）
-- ============================================
alter table engineers enable row level security;
alter table companies enable row level security;
alter table projects enable row level security;
alter table assignments enable row level security;
alter table inquiries enable row level security;
alter table subscriptions enable row level security;
alter table incidents enable row level security;
alter table evaluations enable row level security;
alter table prompts enable row level security;
alter table model_costs enable row level security;
alter table consent_records enable row level security;
alter table index_data_points enable row level security;
alter table admins enable row level security;

-- engineers: 自分のレコード読み書き可、adminは全部
create policy "engineers_self_read" on engineers
  for select using (auth.uid() = user_id);
create policy "engineers_self_update" on engineers
  for update using (auth.uid() = user_id);
create policy "engineers_self_insert" on engineers
  for insert with check (auth.uid() = user_id);
create policy "engineers_admin_all" on engineers
  for all using (exists (select 1 from admins where user_id = auth.uid()));

-- inquiries: 誰でも書き込みOK、読み取りはadminのみ
create policy "inquiries_anyone_insert" on inquiries
  for insert with check (true);
create policy "inquiries_admin_read" on inquiries
  for all using (exists (select 1 from admins where user_id = auth.uid()));

-- それ以外: adminのみ
create policy "companies_admin_all" on companies
  for all using (exists (select 1 from admins where user_id = auth.uid()));
create policy "projects_admin_all" on projects
  for all using (exists (select 1 from admins where user_id = auth.uid()));
create policy "assignments_admin_all" on assignments
  for all using (exists (select 1 from admins where user_id = auth.uid()));
create policy "subscriptions_admin_all" on subscriptions
  for all using (exists (select 1 from admins where user_id = auth.uid()));
create policy "incidents_admin_all" on incidents
  for all using (exists (select 1 from admins where user_id = auth.uid()));
create policy "evaluations_admin_all" on evaluations
  for all using (exists (select 1 from admins where user_id = auth.uid()));
create policy "prompts_admin_all" on prompts
  for all using (exists (select 1 from admins where user_id = auth.uid()));
create policy "model_costs_admin_all" on model_costs
  for all using (exists (select 1 from admins where user_id = auth.uid()));
create policy "consent_records_admin_all" on consent_records
  for all using (exists (select 1 from admins where user_id = auth.uid()));
create policy "index_data_points_admin_all" on index_data_points
  for all using (exists (select 1 from admins where user_id = auth.uid()));
create policy "admins_self_read" on admins
  for select using (auth.uid() = user_id);
```

### Yura admin初期化
```sql
-- Supabase Authで自分のメールでログイン後、SQLで実行:
insert into admins (user_id, email)
values ('<auth.usersのid>', 'yura@example.com');
```

---

## 7. ファイル構成

```
forge/
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                    # /
│   │   │   ├── for-engineers/
│   │   │   ├── for-companies/
│   │   │   ├── operate/                    # Operate訴求LP（v2.0新規）
│   │   │   ├── os/                         # OS訴求LP（Phase 2以降）
│   │   │   ├── inquiry/
│   │   │   ├── about/
│   │   │   └── legal/
│   │   ├── engineers/
│   │   │   ├── apply/
│   │   │   └── apply/complete/
│   │   ├── admin/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── inquiries/
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx
│   │   │   │       ├── matching/
│   │   │   │       ├── operate/            # Operate管理（v2.0）
│   │   │   │       ├── incidents/          # インシデント（v2.0）
│   │   │   │       ├── evaluations/        # 評価（v2.0）
│   │   │   │       └── prompts/            # プロンプト（v2.0）
│   │   │   ├── engineers/
│   │   │   ├── companies/
│   │   │   ├── subscriptions/              # Operate契約一覧（v2.0）
│   │   │   ├── finance/
│   │   │   └── insights/                   # Forge Index データ（Phase 3）
│   │   ├── api/
│   │   │   ├── inquiry/route.ts
│   │   │   ├── engineers/route.ts
│   │   │   ├── auth/callback/route.ts
│   │   │   ├── webhooks/
│   │   │   │   ├── stripe/route.ts         # Phase 1.5以降
│   │   │   │   └── langfuse/route.ts       # Phase 2以降
│   │   │   └── os/                         # OS API（Phase 2）
│   │   │       ├── metrics/route.ts
│   │   │       ├── incidents/route.ts
│   │   │       └── evaluations/route.ts
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── ui/                             # shadcn
│   │   ├── public/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── Pricing.tsx
│   │   │   ├── FAQ.tsx
│   │   │   ├── CTA.tsx
│   │   │   └── OperateCallout.tsx          # Operate訴求コンポ（v2.0）
│   │   ├── forms/
│   │   │   ├── InquiryForm.tsx
│   │   │   └── EngineerApplyForm.tsx
│   │   └── admin/
│   │       ├── AdminNav.tsx
│   │       ├── ProjectCard.tsx
│   │       ├── EngineerCard.tsx
│   │       ├── MatchingPanel.tsx
│   │       ├── SubscriptionCard.tsx        # v2.0
│   │       ├── IncidentList.tsx            # v2.0
│   │       ├── EvaluationChart.tsx         # v2.0
│   │       └── KPIDashboard.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   ├── email/
│   │   │   ├── resend.ts
│   │   │   └── templates/
│   │   │       ├── inquiry-received.tsx
│   │   │       ├── inquiry-internal.tsx
│   │   │       ├── engineer-applied.tsx
│   │   │       ├── engineer-applied-internal.tsx
│   │   │       └── assignment-proposed.tsx
│   │   ├── validations/
│   │   │   ├── inquiry.ts
│   │   │   └── engineer.ts
│   │   ├── auth.ts
│   │   ├── matching.ts                     # マッチングスコアロジック
│   │   ├── industries.ts                   # 業界分類定義（v2.0）
│   │   ├── pricing.ts                      # 料金計算ヘルパ
│   │   └── utils.ts
│   ├── types/
│   │   └── database.ts
│   └── middleware.ts
├── public/
│   ├── og.png                              # 1200x630
│   ├── favicon.ico
│   └── logo.svg
├── supabase/
│   ├── migrations/
│   │   └── 0001_init.sql                   # 上記§6の全SQL
│   └── seed.sql
├── contracts/                              # 契約書テンプレ
│   ├── master-engineer.md
│   ├── client-build-msa.md
│   ├── client-operate-msa.md
│   ├── nda.md
│   └── consent-data-usage.md               # v2.0
├── docs/
│   ├── operations.md                       # 社内運用マニュアル
│   ├── phase2-os-spec.md                   # OS仕様書（Phase 2着手時）
│   └── phase3-cloud-spec.md                # Cloud仕様書（Phase 3着手時）
├── .env.local.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

---

## 8. 環境変数

```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Resend
RESEND_API_KEY=
RESEND_FROM_EMAIL=noreply@forge.jp
INTERNAL_NOTIFY_EMAIL=yura@example.com

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=forge-assets

# App
NEXT_PUBLIC_SITE_URL=https://forge.jp
NEXT_PUBLIC_COMPANY_NAME=[既存法人名]
NEXT_PUBLIC_COMPANY_ADDRESS=[既存法人住所]

# Stripe（Phase 1.5以降）
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# LangFuse（Phase 2以降）
LANGFUSE_SECRET_KEY=
LANGFUSE_PUBLIC_KEY=
LANGFUSE_HOST=https://cloud.langfuse.com  # or self-hosted

# AI providers（Phase 2: OS統合）
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
GOOGLE_API_KEY=

# Sentry
SENTRY_DSN=
```

---

## 9. LP原稿（完成版・Phase 1で実装）

### 9.1 トップページ `/`

#### Hero
```
H1: AIを、動かし続ける。

サブ: 構築だけじゃない。評価・運用・進化まで。
日本のAIインフラを、Forgeから。

CTA: [企業の方：相談する] [エンジニアの方：登録する]

下サブ: 構築 → 評価 → 運用 → 改善のサイクルを丸ごと請け負う、
日本初のAI運用特化ファーム。
```

#### 課題セクション（PAS / Problem）
```
H2: AI実装は、作って終わりじゃない。

サブ: ハルシネーション、モデル更新、コスト爆発、評価セットの老朽化。
動かし始めてからが、本当の地獄。

3カラム:
- 大手SIer: 構築は得意。でも運用は社内に丸投げ
- エージェント経由: 中間マージン30%、運用フェーズはノータッチ
- 内製採用: 数ヶ月かかる。間に合わない
```

#### 解決セクション（PAS / Solution）
```
H2: Forgeは、構築 → 運用 → 進化を、ワンストップで提供する。

3カラム（FAB式）:
1. 実装特化
   生成AI・LLM・RAG・Agent開発の実務経験者のみ登録
   GitHub経由で実績を確認

2. 運用標準装備
   構築後の精度監視・コスト最適化・モデル更新追従まで
   月額固定で、AI運用部門ごと外注できる

3. 直契約
   弊社が元請として契約・支払いを引き受け
   余計な中間マージンを削ぎ落とす
```

#### 仕組み（3ステップ）
```
H2: 仕組みは、シンプル。

Step 1: 相談（無料）
Webフォームに案件概要を入力。24時間以内に担当者が返信し、要件を整理。

Step 2: 構築（Build）
要件に合うエンジニアをアサイン。最短2週間でPoC、1ヶ月で本実装初版。
評価ハーネス付きで納品。

Step 3: 運用（Operate）
構築完了後、月額固定でAIシステムを動かし続ける。
精度監視、コスト最適化、モデル更新、すべて込み。
```

#### 強み（4つ）
```
H2: なぜForgeが選ばれるのか。

1. 構築だけで終わらない
日本で唯一、AI構築から運用まで一気通貫で提供。
Operate契約で、AI運用部門を持たない企業でも安心して稼働。

2. 弊社が元請
契約・支払いの相手は弊社（[既存法人名]）。
個人エンジニアとの直接契約に伴う与信・税務・契約管理の負担なし。

3. 透明な料金
構築は案件規模で見積もり、運用は月額固定。
中抜き構造を隠さず、相見積もり歓迎。

4. 評価ハーネス標準装備
全構築案件に評価データセットとリグレッションテストを納品。
モデル更新・プロンプト変更による精度劣化を即座に検知。
```

#### 料金
```
H2: 料金は、明確。

【Build】構築フェーズ
PoC・小規模実装: 50万円〜
中規模実装: 100〜500万円
大規模・継続案件: 500万円〜

【Operate】運用フェーズ（推奨・全案件にセット）
ベーシック: 月30万円〜（小規模AI、月10万リクエスト以下）
スタンダード: 月70万円〜（中規模AI、月100万リクエスト以下）
エンタープライズ: 月150万円〜（大規模、24/7監視）

最低契約期間: 6ヶ月
Build単独契約は通常価格1.5倍

注釈: 詳細はヒアリング後に見積もり。すべて成果物完成責任型の業務委託契約。
```

#### 事例（プレースホルダ）
```
H2: 導入事例（準備中）

ローンチ後、許諾を得た事例から順次掲載します。
```

#### FAQ
```
Q: なぜ大手SIerやエージェントではなくForgeを選ぶべきですか？
A: AI実装の現場経験を持つエンジニアに直接届くこと、そして構築後の運用まで一気通貫で提供することが理由です。SIerやエージェントは構築で終わり、運用は別途見積もりや内製対応となるケースがほとんどです。

Q: Operate（運用）契約は必須ですか？
A: 強く推奨しますが必須ではありません。Build単独契約は通常料金の1.5倍となります。これは、AIシステムは構築後の運用が成功率を左右するためで、運用設計まで含めて初めて投資対効果が出るという経験則に基づきます。

Q: 契約相手は誰になりますか？
A: 弊社（[既存法人名]）です。御社は弊社1社と契約を結ぶだけで完結します。エンジニアとは弊社が個別に業務委託契約を結びます。

Q: 守秘義務（NDA）は対応していますか？
A: はい。標準でNDAを締結します。御社のNDAテンプレートでも、弊社のテンプレートでも対応可能です。

Q: 既存システムとの連携も可能ですか？
A: 可能です。Salesforce、HubSpot、Slack、Notion、kintone等、業務SaaSとのAPI連携実績のあるエンジニアが在籍しています。

Q: 相談だけでも可能ですか？
A: 可能です。要件整理の段階での無料相談を歓迎します。

Q: エンジニア登録の条件は？
A: 生成AI・LLM領域での実務経験があり、GitHubで公開可能な実績がある方。詳細は「エンジニアの方へ」をご覧ください。
```

#### CTA
```
H2: AIを、動かし続ける。

[企業の方：相談する（無料）] [エンジニアの方：登録する]
```

### 9.2 エンジニア向けLP `/for-engineers`

#### Hero
```
H1: 営業も、契約も、請求もしない。
書くことだけに、集中する。

サブ: ForgeはAI実装案件を弊社が元請として獲得し、登録エンジニアに業務委託で発注します。
あなたは案件を選び、書き、納品するだけ。
構築後の運用フェーズも、月次の継続報酬として続きます。

CTA: [登録する（無料）]
```

#### Before/After
```
H2: フリーランスエンジニアの現実

Before（個人で営業）:
- 営業のために自分の単価を晒す
- 案件ごとに契約交渉、与信確認、請求書発行
- 確定申告が辛い
- 単価交渉で消耗する
- 構築終わったら次の案件探し

After (Forge):
- Forgeが案件を持ってくる
- 契約は弊社と御社の間で完結、あなたは業務委託契約1枚
- 報酬は月次で確定、振込のみ
- 単価は事前合意、交渉不要
- 構築後の運用契約で月次継続収入
```

#### 報酬構造
```
H2: 報酬構造（透明）

Build（構築フェーズ）:
弊社売上の 70〜80% をエンジニアにお支払い。

Operate（運用フェーズ）:
弊社月額売上の 60〜70% をエンジニアに月次継続支払い。
構築後も、運用に関わり続ける限り報酬が続きます。

例:
構築 月100万円の案件 → エンジニア 70-80万円
構築 月200万円の案件 → エンジニア 140-160万円
運用 月50万円の契約 → エンジニア 30-35万円/月（継続）
```

#### Forge Insider（Year 1後半でローンチ）
```
H2: Forge Insider — エンジニア専用コミュニティ

登録エンジニアだけが入れる Discord サーバー。
- 月次ナレッジ共有会
- Anthropic / OpenAI 優先クレジット配布
- Forge Tech Blog 投稿権
- Forge Certified バッジ
- 共著OSSプロジェクト

※ Phase 2-3 でローンチ予定
```

#### CTA
```
[GitHub経由で登録（30秒）]
```

### 9.3 企業向けLP `/for-companies`

#### Hero
```
H1: 社内に、AI運用部門を。

サブ: 採用には時間がかかる。SIerは現場と乖離している。
Forgeは、AI構築から運用まで、月額固定で外注できる唯一の選択肢です。

CTA: [相談する（無料）]
```

#### 想定ユースケース
```
H2: こんなケースで使われています

- 社内データを使った検索・チャットボット（RAG）の構築と運用
- 顧客対応の自動化（LLM + 業務システム連携）
- 文書処理の自動化（請求書OCR + 構造化）
- 業務エージェント（経費精算、議事録要約等）
- AI機能を既存SaaSに組み込み＋運用監視
- 経営層向けAI戦略のPoC＋本番稼働
```

#### Operate訴求
```
H2: AIは、作るより動かし続けるのが難しい。

3カラム:
- ハルシネーション
  本番運用で初めて気づく精度劣化。気づいた時には信頼を失う

- モデル更新
  GPT、Claude、Geminiのバージョンアップに追従できない。
  古いモデルで動き続けると、いつの間にか競合に負ける

- コスト爆発
  ユーザー数増加でAPIコストが想定外に膨らむ。
  予算超過で経営層から怒られる

H3: Forgeなら、これら全部、月額固定で吸収する。
```

#### CTA
```
[まずは相談する（無料）]
```

### 9.4 Operate訴求LP `/operate`（v2.0新規）

```
H1: AI運用を、外注する。

サブ: 構築は他社、運用だけForgeに。これも可能。
既に動いているAIシステムを、Forgeが引き取って運用します。

H2: Operate契約だけで何ができるか

- 既存LLMアプリの精度監視・劣化検知
- コスト最適化（モデル切替、キャッシュ、ルーティング）
- モデル更新時の検証・移行
- プロンプト改善のA/Bテスト
- 月次運用レポート
- インシデント対応（精度急落、コスト急増、API障害）

H2: 料金
ベーシック: 月30万円〜
スタンダード: 月70万円〜
エンタープライズ: 月150万円〜

[既存システムの相談をする]
```

---

## 10. フォーム仕様

### 10.1 企業相談フォーム `/inquiry`

```typescript
// src/lib/validations/inquiry.ts
import { z } from "zod";

export const inquirySchema = z.object({
  companyName: z.string().min(1, "必須").max(200),
  contactName: z.string().min(1, "必須").max(100),
  contactEmail: z.string().email("メール形式が正しくありません"),
  contactPhone: z.string().optional(),
  industry: z.enum([
    "finance", "healthcare", "legal", "real_estate", "retail",
    "manufacturing", "hr", "education", "media", "other"
  ]).optional(),
  companySize: z.enum(["1-10", "11-50", "51-200", "201-1000", "1000+"]).optional(),
  projectType: z.enum([
    "llm_app", "rag", "agent", "automation", 
    "integration", "consulting", "other"
  ]),
  needsOperate: z.boolean().default(true), // v2.0: Operate希望
  budgetRange: z.enum([
    "under_500k", "500k_1m", "1m_3m", "3m_5m", "5m_10m", "over_10m"
  ]),
  duration: z.enum([
    "spot", "under_1m", "1m_3m", "3m_6m", "over_6m"
  ]),
  startDate: z.string().optional(),
  message: z.string().min(20, "20文字以上で入力してください").max(5000),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
```

### 10.2 エンジニア登録 `/engineers/apply`

```typescript
// src/lib/validations/engineer.ts
import { z } from "zod";

export const engineerApplySchema = z.object({
  displayName: z.string().min(1).max(100),
  bio: z.string().max(2000),
  skills: z.array(z.string()).min(1, "1つ以上選択してください"),
  aiSpecialties: z.array(z.string()).min(1),
  hourlyRateMin: z.number().int().min(1000).optional(),
  hourlyRateMax: z.number().int().min(1000).optional(),
  monthlyRateMin: z.number().int().min(50000).optional(),
  monthlyRateMax: z.number().int().min(50000).optional(),
  availableHoursPerWeek: z.number().int().min(1).max(80),
  availableFrom: z.string().optional(),
  portfolioUrls: z.array(z.string().url()).max(5),
  pastProjects: z.array(z.object({
    title: z.string(),
    description: z.string(),
    tech: z.array(z.string()),
    url: z.string().url().optional(),
  })).max(10),
  acceptOperate: z.boolean().default(true), // v2.0: 運用フェーズへの参画意思
});
```

### 10.3 スキルタグ・AI特化候補

```typescript
// src/lib/industries.ts
export const SKILLS = [
  "TypeScript", "JavaScript", "Python", "Go", "Rust", "Ruby", "Swift", "Kotlin",
  "Next.js", "React", "Vue", "Nuxt", "Svelte", "Astro", "Remix",
  "FastAPI", "Django", "Flask", "Rails", "Express", "NestJS",
  "OpenAI API", "Anthropic API", "Gemini API", "LangChain", "LlamaIndex",
  "LangGraph", "Vercel AI SDK", "Mastra", "Pinecone", "Weaviate", "Qdrant",
  "Supabase Vector", "PGVector", "Chroma", "LangFuse", "LangSmith",
  "AWS", "GCP", "Azure", "Vercel", "Cloudflare", "Supabase", "Firebase",
  "Docker", "Kubernetes", "Bedrock",
  "PostgreSQL", "MySQL", "MongoDB", "Redis", "BigQuery",
  "Stripe", "Twilio", "Slack API", "Notion API", "Salesforce API", "kintone",
];

export const AI_SPECIALTIES = [
  "LLMアプリ開発", "RAGシステム", "AIエージェント", "Fine-tuning",
  "プロンプトエンジニアリング", "音声AI（TTS/STT）", "画像生成AI",
  "動画生成AI", "MLOps", "評価・監視（LangSmith / LangFuse）",
  "Vector DB / Embedding", "マルチモーダル",
  "AI運用・モニタリング", "コスト最適化", "モデル選定・ベンチマーク",
];

export const INDUSTRY_LABELS: Record<string, string> = {
  finance: "金融",
  healthcare: "医療",
  legal: "法律",
  real_estate: "不動産",
  retail: "小売",
  manufacturing: "製造",
  hr: "人材",
  education: "教育",
  media: "メディア",
  other: "その他",
};
```

---

## 11. 管理画面 マッチングUI

### 11.1 案件詳細画面 `/admin/projects/[id]`

```
┌─────────────────────────────────────────────┐
│ 案件詳細                            [編集]   │
├─────────────────────────────────────────────┤
│ タイトル: [タイトル]                         │
│ ステータス: matching   フェーズ: build       │
│ 企業: [会社名]   業界: [業界]                │
│ 予算: 100万〜300万円                         │
│ 期間: 1〜3ヶ月                               │
│ Operate: あり（推定月額70万円）              │
│ 必要スキル: [Next.js] [LangChain] [RAG]      │
│ 説明: [説明]                                 │
│ 成果物定義: [成果物]                         │
└─────────────────────────────────────────────┘

[Tabs] 構築 | 評価 | 運用 | プロンプト | インシデント

(構築タブ内)
┌─────────────────────────────────────────────┐
│ 候補エンジニア（マッチングスコア順）         │
├─────────────────────────────────────────────┤
│ 山田太郎 / @yamada (スコア: 87)              │
│ スキル一致: 4/5  単価: 月80万円              │
│ AI特化: RAG, LLMアプリ                       │
│ 稼働可能: 2026-05-20〜                       │
│ Operate参画: OK                              │
│ [プロフィール] [Buildで打診] [Operateで打診]│
└─────────────────────────────────────────────┘
```

### 11.2 マッチングスコア計算（v2.0版）

```typescript
// src/lib/matching.ts
export function calculateMatchScore(project: Project, engineer: Engineer): number {
  let score = 0;
  
  // スキル一致（最大40点）
  const skillOverlap = project.required_skills.filter(s => 
    engineer.skills.includes(s)
  ).length;
  score += Math.min(40, (skillOverlap / project.required_skills.length) * 40);
  
  // AI特化マッチ（最大25点）
  if (engineer.ai_specialties.includes(mapProjectTypeToSpecialty(project.project_type))) {
    score += 25;
  }
  
  // 単価レンジ整合（最大15点）
  if (isRateInBudget(engineer, project)) {
    score += 15;
  }
  
  // Operate参画意思（v2.0: 最大10点）
  if (engineer.accept_operate && project.has_operate) {
    score += 10;
  }
  
  // 業界経験（v2.0: 最大10点）
  if (engineer.past_industries?.includes(project.industry)) {
    score += 10;
  }
  
  // 稼働可能時期（減点）
  if (project.start_date && engineer.available_from && engineer.available_from > project.start_date) {
    score -= 10;
  }
  
  return Math.max(0, Math.min(100, score));
}
```

---

## 12. メールテンプレート

### 12.1 企業からの問い合わせ → 自動返信
```
件名: 【Forge】お問い合わせを受け付けました

[ご担当者様]

このたびはForgeへお問い合わせいただきありがとうございます。
以下の内容で受け付けました。

──────────
案件タイプ: [type]
予算感: [budget]
期間: [duration]
運用希望: [needsOperate ? "あり" : "なし"]
ご相談内容: [message]
──────────

担当者より24時間以内（営業日）に返信いたします。
お急ぎの場合はこのメールに返信ください。

Forge — AIを、動かし続ける。
[既存法人名]
https://forge.jp
```

### 12.2 内部通知、エンジニア登録通知、案件打診テンプレ

（v1.0仕様書から継承、内容は同じ。タグラインを「AIを、動かし続ける」に統一）

---

## 13. 契約書テンプレート

> **重要**: 経済産業省の業務委託契約書ひな形を基にカスタマイズ。Phase 0（Yura月商200万まで）は弁護士レビューなしで運用可。Phase 1（月商200万超）でリーガルテック系スポット相談に出す。

### 13.1 業務委託基本契約書（エンジニア向け）`contracts/master-engineer.md`

```
業務委託基本契約書

[既存法人名]（以下「甲」）と _________（以下「乙」）は、
甲が乙に対して業務を委託することに関し、以下のとおり基本契約（以下「本契約」）を締結する。

第1条（目的）
本契約は、甲が乙に対して業務を委託する場合の基本的事項を定めることを目的とする。
個別の業務内容、対価、納期等は、別途締結する個別契約にて定める。

第2条（業務の実施）
1. 乙は、個別契約に定める業務（以下「本業務」）を、自己の裁量と責任において遂行する。
2. 乙は本業務の遂行にあたり、稼働時間、稼働場所、業務遂行の手順を自ら決定する。
3. 甲は乙に対し、本業務の遂行に関する指揮命令を行わない。
4. 乙は本業務の成果物について完成責任を負う。

第3条（再委託）
乙は、甲の事前の書面による承諾なしに、本業務を第三者に再委託してはならない。

第4条（対価）
本業務の対価は個別契約に定めるとおりとし、甲は所定の支払期日までに乙の指定口座に振り込む。
振込手数料は甲の負担とする。

第5条（成果物の権利帰属）
本業務の成果物に関する著作権（著作権法第27条および第28条の権利を含む）その他一切の知的財産権は、
対価の支払いをもって乙から甲に移転する。
乙は甲および甲のクライアントに対して、成果物に関する著作者人格権を行使しない。

第6条（運用フェーズへの継続参画）  [v2.0新規]
1. 構築フェーズの完了後、乙は当該案件の運用フェーズに継続参画することができる。
2. 運用フェーズの対価および条件は別途個別契約で定める。
3. 乙は運用フェーズへの参画を辞退できる。

第7条（秘密保持）
乙は、本業務の遂行を通じて知り得た甲および甲のクライアントの一切の情報を、
本契約終了後も含め第三者に開示・漏洩してはならない。詳細はNDAに定める。

第8条（反社会的勢力の排除）
甲および乙は、自らが反社会的勢力でないこと、および将来にわたっても関係を有しないことを表明し保証する。

第9条（契約解除）
甲は、乙が本契約または個別契約に違反した場合、催告なしに本契約および全ての個別契約を解除できる。

第10条（損害賠償）
乙の故意または重大な過失により甲が損害を被った場合、乙はその損害を賠償する。
ただし、賠償額は当該案件の対価額を上限とする。

第11条（契約期間）
本契約の有効期間は締結日から1年間とし、期間満了の30日前までにいずれかの当事者から書面による申し出が
ない場合、自動的に1年間更新される。

第12条（合意管轄）
本契約に関する紛争については、[既存法人本店所在地]を管轄する地方裁判所を第一審の専属的合意管轄裁判所とする。

[日付]
甲: [既存法人名]  代表取締役 _________ 印
乙: _________ 印
```

### 13.2 業務委託契約書 Build版（クライアント企業向け）`contracts/client-build-msa.md`

```
業務委託契約書（構築フェーズ）

[クライアント企業名]（以下「甲」）と[既存法人名]（以下「乙」）は、
以下のとおり業務委託契約を締結する。

第1条（業務内容）
乙は甲に対し、別紙仕様書に定める業務（以下「本業務」）を提供する。

第2条（成果物）
乙は本業務の成果物を別紙仕様書に定める納期までに甲に納入する。

第3条（業務遂行）
乙は本業務を自己の裁量と責任において遂行し、稼働時間・稼働場所・遂行手順を自ら決定する。

第4条（対価）
1. 甲は乙に対し、本業務の対価として金 _________ 円（消費税別）を支払う。
2. 支払方法: 着手金 _________ 円、検収完了後 _________ 円。
3. 支払期日: 各請求書発行月の翌月末日。

第5条（運用フェーズへの移行）  [v2.0新規・重要]
1. 本業務（構築フェーズ）の完了後、甲乙は別途締結する「業務委託契約書（運用フェーズ）」に基づき、
   運用フェーズに移行することに合意する。
2. 運用フェーズの最低契約期間は構築完了から6ヶ月とする。
3. 甲が運用フェーズへの移行を行わない場合、構築フェーズの対価は本契約第4条記載額の1.5倍となる
   （本契約締結時に通常価格を適用しているため、追加支払いが発生する）。

第6条（検収）
1. 甲は成果物の納入後 _____ 営業日以内に検収を完了する。
2. 検収期間内に書面による異議がない場合、検収は完了したものとみなす。

第7条（再委託）
乙は本業務の全部または一部を、自社の業務委託先エンジニアに再委託することができる。

第8条（権利帰属）
成果物に関する著作権その他知的財産権は、対価の完済をもって乙から甲に移転する。

第9条（評価ハーネスの納品）  [v2.0新規]
乙は本業務の成果物に併せて、以下を納品する。
1. 評価データセット（テストケース30件以上）
2. リグレッションテストスイート
3. 運用ハンドブック（運用上の注意点、想定インシデント対応）

第10条以降（秘密保持・反社条項・解除・損害賠償・合意管轄等）は通常の業務委託契約に準ずる。
```

### 13.3 業務委託契約書 Operate版（v2.0新規）`contracts/client-operate-msa.md`

```
業務委託契約書（運用フェーズ）

[クライアント企業名]（以下「甲」）と[既存法人名]（以下「乙」）は、
以下のとおり業務委託契約（運用フェーズ）を締結する。

第1条（業務内容）
乙は甲に対し、別紙運用仕様書に定める業務（以下「本業務」）を提供する。
本業務には以下を含む：
1. AIシステムの稼働監視
2. 精度劣化の検知と対応
3. コスト最適化提案
4. モデル更新時の検証と移行
5. プロンプト改善
6. インシデント対応
7. 月次運用レポートの提供

第2条（料金・支払い）
1. 甲は乙に対し、月額 _________ 円（消費税別）を支払う。
2. 支払期日: 毎月末日締め、翌月末日払い。
3. 月次レポート提出をもって役務提供完了とみなす。

第3条（最低契約期間）
本契約の最低契約期間は契約締結日から6ヶ月とする。
最低契約期間内の中途解約は、残月分の支払い義務が発生する。

第4条（自動更新）
最低契約期間満了後は、3ヶ月単位で自動更新される。
更新を希望しない場合、更新月の30日前までに書面で通知する。

第5条（業務遂行）
乙は本業務を自己の裁量と責任において遂行し、稼働時間・稼働場所・遂行手順を自ら決定する。

第6条（Forge OS の利用）  [v2.0新規・重要]
1. 本業務の遂行のため、乙は自社運用基盤「Forge OS」を使用する。
2. 甲のシステムログ・運用データはForge OSに記録される。
3. データの取扱いは別紙「データ利用同意書」に定める。

第7条（インシデント対応）
1. Critical（重大）: 検知後30分以内に対応着手、4時間以内に状況連絡
2. Error（エラー）: 検知後2時間以内に対応着手、24時間以内に状況連絡
3. Warning（警告）: 翌営業日中に対応着手

第8条（SLA）
1. システム稼働率: 月次99.5%以上
2. 上記未達の場合、当該月の料金から下記割合を返金する：
   - 99.0%-99.5%: 5%返金
   - 95.0%-99.0%: 15%返金
   - 95.0%未満: 30%返金

第9条以降（秘密保持・反社条項・解除・損害賠償・合意管轄）は通常の業務委託契約に準ずる。
```

### 13.4 NDA `contracts/nda.md`

（v1.0仕様書から継承）

### 13.5 データ利用同意書（v2.0新規）`contracts/consent-data-usage.md`

```
データ利用に関する同意書

[クライアント企業名]（以下「甲」）は、[既存法人名]（以下「乙」）に対し、
本書に定める範囲内で、本業務に関連するデータの利用に同意する。

第1条（利用するデータ）
1. 甲のAIシステムにおけるユーザー入力（プロンプト）
2. 甲のAIシステムからのモデル応答
3. 上記の評価結果・メトリクス
4. システム稼働ログ

第2条（利用目的）
1. 本業務（運用）の遂行
2. 乙の自社運用基盤「Forge OS」の改善・進化
3. 業界別ベンチマーク（匿名化・集約化されたもののみ）

第3条（匿名化）
1. 第2条第3号の利用にあたり、乙は甲を特定可能な情報を削除し、業界・規模等の集約情報のみを利用する。
2. 個人情報は適切にマスキング処理する。

第4条（第三者提供）
1. 乙は、第2条第3号の集約データを以下の用途で第三者に提供することができる：
   - 業界レポート（Forge Index）の発行
   - 学術研究機関との共同研究
2. 上記提供にあたり、甲を特定可能な情報は一切含まれない。

第5条（甲の権利）
1. 甲はいつでも本同意を撤回できる。
2. 撤回後、乙は速やかに甲のデータの新規利用を停止する。
3. ただし、撤回前に集約済みのデータは引き続き利用される。

第6条（有効期間）
本同意は本業務の継続中、および終了後5年間有効とする。

[日付]  甲: [クライアント企業名]  代表者 _________ 印
       乙: [既存法人名]  代表取締役 _________ 印
```

---

## 14. マーケティング素材

### 14.1 X/Threads投稿（エンジニア募集・即時実装）

```
投稿1（告知）:
AI実装に強いフリーランスエンジニアを募集します。

Forge（AIを、動かし続ける会社）：
弊社が元請として案件を獲得し、登録エンジニアに業務委託。
構築フェーズだけじゃなく、運用フェーズも月次継続報酬で。

- 営業・契約・請求は全部こちらでやります
- AI実装案件のみ
- 構築 70-80%、運用 60-70% の報酬

LangChain / RAG / Agent / LLMアプリの実務経験者の方、
プロフィールリンクから登録お待ちしています。
https://forge.jp/for-engineers
```

```
投稿2（共感型）:
フリーランスエンジニアのつらい部分を3つ：

①営業の時間が、書く時間より長い
②案件ごとの契約交渉と請求書発行
③構築終わったら次の案件探し（運用は別組織）

Forgeはこれを全部肩代わり＋運用も継続報酬で。
あなたは書くことだけに集中、月次収入は安定する。

https://forge.jp/for-engineers
```

```
投稿3（業界批判）:
日本のAI実装、まだ大手SIerかエージェント経由が多い。
構造的な問題：
- 大手は構築だけ、運用ノウハウ薄い
- エージェントは中間マージン30%、運用ノータッチ
- 結果、企業側は「作ったAI動かない」状態に

Forgeはここを根本から変えます。
構築から運用まで、AI実装の現場で書ける人と直結。
https://forge.jp
```

### 14.2 企業向けコールドメール

```
件名: 御社のAI、構築だけで終わらせていませんか

[ご担当者様]

突然のご連絡失礼いたします。
[既存法人名]の[名前]と申します。

御社の事業内容を拝見し、生成AI・LLMを活用した業務改善や、
すでに導入されているAIシステムの運用改善にご興味があるのではと思い、
ご連絡しました。

弊社は「Forge」というAI実装＋運用特化のサービスを運営しており、
ChatGPT・Claude・Gemini等のAPI、RAG、AIエージェント等の構築から
本番運用までを一気通貫で対応しています。

特長:
- AI実装の現場経験者のみで構成
- 構築だけでなく月額固定の運用契約まで提供
- 弊社が元請として契約・請求を一括対応
- PoC 2週間〜、本実装1ヶ月〜の短納期
- 運用は月30万円〜、コスト最適化と精度監視込み

すでにAIシステムを構築済みで、運用に課題を抱えている場合の
「Operate契約のみ」もご相談可能です。

15分の無料相談だけでも承ります。
下記URLからお気軽にご連絡ください。

https://forge.jp/inquiry

[既存法人名]
代表 [名前]
```

### 14.3 note記事タイトル案（SEO/SNS流入）

- 「AI実装は『誰に頼むか』より『誰と動かし続けるか』が9割」
- 「2026年、AI運用部門の外注が当たり前になる」
- 「ハルシネーション・コスト爆発・モデル更新追従。AI運用の3大地獄をどう乗り越えるか」
- 「フリーランスエンジニアに『直接』案件を回す仕組みを作った話」
- 「日本の生成AI実装が遅れる本当の理由：ゼネコン構造と運用断絶」
- 「ChatGPT登場後3年、フリーランス市場で起きた構造変化」
- 「AI構築会社とAI運用会社、3年後にどちらが勝つか」

---

## 15. 偽装請負回避チェックリスト

開発・運用フェーズで**全て遵守**すること。違反は刑事罰の対象。

### 契約・案件票
- [ ] 「成果物」「納期」「報酬」を明記
- [ ] 「就業時間」「常駐」「日報義務」「会議出席義務」は書かない
- [ ] 「指揮命令」「業務指示」という文言は使わない
- [ ] 案件票テンプレに「成果物完成責任型」と記載

### 運用
- [ ] エンジニアにクライアントから直接「明日10時に会議」のような時間指定をさせない
- [ ] エンジニアにクライアントの社員と同じ勤怠ツールを使わせない
- [ ] エンジニアの労働時間管理をしない（成果物のみ管理）
- [ ] エンジニアにクライアントの社員と同じ服務規律を適用しない

### 報酬
- [ ] 時給ではなく**成果物単価**または**月額固定**で請求
- [ ] 残業代・休日出勤代の概念は持ち込まない

### コミュニケーション
- [ ] エンジニアとクライアントを直接Slackに入れる場合、「業務遂行に必要な連絡のため」と限定的に
- [ ] エンジニアへの依頼は「成果物として〇〇を納入してください」の形式

### Operate契約特有
- [ ] エンジニアの稼働時間ではなく、**SLA達成（システム稼働率99.5%）**で評価
- [ ] インシデント対応は「対応着手時刻」ではなく「成果物としてのインシデントレポート提出」で評価

---

## 16. デプロイ手順

### Phase 1.0
1. **Supabase**: 新規プロジェクト（Tokyo region）→ §6のSQL実行 → Auth Providers GitHub有効化
2. **GitHub OAuth App**: 作成 → Client ID/Secret を Supabase に設定
3. **Authentication URL**: Site URL `https://forge.jp`、Redirect URLs `https://forge.jp/api/auth/callback`, `http://localhost:3000/api/auth/callback`
4. **ドメイン**: お名前.comで `forge.jp` 取得 → Vercelネームサーバーに切替
5. **Resend**: アカウント作成 → ドメイン認証（SPF/DKIM/DMARC） → API Key発行
6. **Cloudflare R2**: バケット `forge-assets` 作成 → APIトークン発行
7. **Vercel**: GitHub連携 → 環境変数設定 → ドメイン紐付け → Deploy
8. **Sentry**: プロジェクト作成 → DSN設定
9. **動作確認**: §17のチェックリスト全項目クリア

### Phase 2.0（OS稼働時）
1. LangFuse self-hosted を別Supabaseで構築（または LangFuse Cloud）
2. OS用APIエンドポイントを `/api/os/*` に追加
3. 顧客向けダッシュボードを `/admin/projects/[id]/operate` に実装
4. AI Provider API Key を Supabase Vault に保管

### Phase 3.0（Cloud / Index時）
- Cloud第1弾: 別Vercelプロジェクトとしてサブドメイン展開（例: `legal.forge.jp`）
- Index: Forge本体内 `/insights` で公開、有料版は別の認証ゲート

---

## 17. ローンチ前最終チェックリスト（Phase 1）

### 公開前
- [ ] ドメイン取得・DNS設定完了、SSL証明書（Vercel自動）
- [ ] LP Lighthouse 90+
- [ ] モバイル表示崩れなし
- [ ] OG画像（1200x630）公開
- [ ] favicon設定

### 機能
- [ ] /inquiry フォーム送信 → DB登録 + 自動返信メール + 内部通知メール
- [ ] /engineers/apply GitHub OAuth → プロフィール入力 → DB登録 + 内部通知
- [ ] /admin/* admin以外でアクセス → 401
- [ ] /admin/inquiries 一覧表示
- [ ] /admin/projects/new で案件作成
- [ ] /admin/projects/[id]/matching でマッチング候補表示
- [ ] /admin/subscriptions Operate契約一覧

### 法務
- [ ] 利用規約・プライバシーポリシー・特商法表記公開
- [ ] 業務委託基本契約書テンプレ完成
- [ ] Build契約書テンプレ完成（Operate移行条項含む）
- [ ] Operate契約書テンプレ完成（SLA含む）
- [ ] NDAテンプレ完成
- [ ] データ利用同意書テンプレ完成
- [ ] 適格請求書発行体制確認

### 監視・分析
- [ ] サイトマップ送信（Google Search Console）
- [ ] Vercel Analytics 有効化
- [ ] Plausible 埋め込み
- [ ] Sentry 本番のみ有効化

---

## 18. Phase 2 実装仕様（Forge OS v0.1）

Phase 2着手時に詳細化。以下は概要。

### 18.1 Forge OS v0.1 機能
1. **統一監視ダッシュボード**: 全顧客のLLMアプリのコール数・レイテンシ・コストを1画面で
2. **精度モニタリング**: 各案件の評価結果を時系列でグラフ化
3. **インシデント自動検知**: 精度急落（閾値超え）、コスト急増、APIエラー急増 → Slack通知
4. **モデルコスト追跡**: モデル別・案件別・日次のコスト集計
5. **プロンプト版管理**: Gitライクな履歴、ロールバック
6. **月次運用レポート自動生成**: 各案件の前月メトリクスをPDF化、顧客にメール送信

### 18.2 LangFuse統合
```typescript
// 各案件のLangFuse プロジェクトIDをForge側で管理
// 全プロジェクトのトレースを定期的にForge OSに集約
// LangFuse APIから直接データ取得 + Forge OSダッシュボードで統合表示
```

### 18.3 評価ハーネス標準テンプレ
業界別5種を最初に作る：
- 金融: 取引照会・コンプライアンスチェック
- 医療: 診療記録要約・薬品名認識
- 法律: 契約条項抽出・判例検索
- 不動産: 物件情報抽出・価格妥当性検証
- 小売: 商品レコメンド・在庫照会

各テンプレに30件以上の評価ケース＋自動採点ロジック。

### 18.4 Forge OS UI
管理画面 `/admin/projects/[id]/operate` 配下に以下のサブページ：
- `/operate` : 概要ダッシュボード
- `/operate/metrics` : 詳細メトリクス
- `/operate/incidents` : インシデント一覧・対応履歴
- `/operate/cost` : コスト分析
- `/operate/prompts` : プロンプト版管理
- `/operate/evaluations` : 評価結果

---

## 19. Phase 3 実装仕様（Cloud / Index）

Phase 3着手時に詳細化。以下は概要。

### 19.1 Forge Cloud 発見プロセス
1. **トリガー**: 受託案件で同じ要件が3社以上から来た瞬間
2. **判定基準**: 業界の平均案件規模 × 想定顧客数 が年商3000万円以上見込めるか
3. **プロダクト化判断**: Yura+主要エンジニア1名で意思決定、Year 2前半に第1弾着手
4. **インフラ**: Forge OS の上で動かす、ゼロから作らない
5. **販売**: Forge本体LPに「Cloudプロダクト」セクション追加、別ドメインも検討

候補:
- **Forge Legal**: 法律事務所向けRAG（契約書レビュー、判例検索）
- **Forge Estate**: 不動産向けAIアシスタント（VideoTrackerと統合可）
- **Forge Care**: 医療文書要約・電子カルテ補助
- **Forge Finance**: 金融機関向け監査・コンプライアンスAI

### 19.2 Forge Index データ収集スキーマ
Year 1から仕込み（後付けは地獄）。以下のメトリクスを継続蓄積：

```typescript
// 既に §6 の index_data_points テーブルで定義済み
// 業界別に以下を月次集計:
- avg_implementation_cost_jpy
- avg_operate_cost_jpy_per_month
- model_share_percent (model_name × industry)
- avg_hallucination_rate_percent
- avg_token_cost_per_request
- common_failure_pattern_top10
- popular_use_case_top10
```

### 19.3 Index販売モデル
- 無料版（業界サマリー、四半期発行）: リード獲得用
- 有料版（業界詳細レポート）: 年額50-200万円
- 買い手: SIer、コンサル、VC、研究機関、Cloud提供事業者

### 19.4 メディア化戦略
- 日経・東洋経済・ITmediaへのデータ提供（引用必須）
- 「日本のAI実装の現状を語るならForgeを引用」状態を作る
- これが達成できれば認知の独占が完了し、広告費が構造的に消える

---

## 20. ネットワーク効果ループ設計

各層の責任者KPIを「次の層への移行率」に設定する。

### Phase 1（Yura単独）
- Build案件 → Operate移行率: 80%以上を目標
- Operate契約継続率: 90%以上
- エンジニア6ヶ月稼働率: 70%以上

### Phase 2-3（チーム拡張時）
| ロール | KPI |
|------|-----|
| Build責任者 | Operate移行率、案件あたりマージン率 |
| Operate責任者 | OS利用率、解約率、月次MRR成長率 |
| OS責任者 | 全顧客のSLA達成率、OS機能の顧客採用率 |
| Cloud責任者 | プロダクトARR、新規プロダクト発見数 |
| Index責任者 | 引用数、有料購読数 |

各KPIが**次の層を強化する**設計。例：
- Build責任者がOperate移行率を上げる → Operate責任者のMRR成長を支援
- Operate責任者がOS利用率を上げる → OS責任者のデータ蓄積を支援

ループが**6ヶ月で1周**するように設計（速いループ＝早い堀深化）。

---

## 21. データ蓄積アーキテクチャ（準・永久機関の核）

### 21.1 同意取得フロー
1. Build契約締結時に「データ利用同意書」（§13.5）も同時締結
2. 同意あり → 通常価格、同意なし → 通常価格1.2倍
3. 同意の中身：
   - Forge OSへのログ記録（必須）
   - 匿名化集約データの第三者提供（任意）
   - 事例公開（任意、許諾と引き換えに割引可）

### 21.2 集約レベル
- **Level 1（生データ）**: 各案件のSupabase内、顧客とForgeのみアクセス可
- **Level 2（プロジェクト集約）**: 案件ごとのメトリクス時系列、Forge内で参照可
- **Level 3（業界集約）**: 同業他社のデータと混合した統計、Forge Indexの素材
- **Level 4（公開可）**: Forge Index 無料版のサマリー数値

各レベル間の移動は自動化された ETL パイプラインで実施。匿名化は Level 2 → 3 移動時に必ず実施。

### 21.3 データガバナンス
- 個人情報は Level 1 で全マスキング、Level 2 以降には絶対に持ち越さない
- 顧客特定情報は Level 3 移動時に削除（ハッシュ化ではなく削除）
- 全アクセスログを Sentry/Supabase Audit Log で記録

---

## 22. Claude Code 実装指示

### 22.1 Phase 1 実装順
1. プロジェクト初期化（Next.js + shadcn + 必要パッケージ全部）
2. `supabase/migrations/0001_init.sql` 作成・適用（§6の全SQL）
3. `src/lib/supabase/{client,server,middleware}.ts`
4. `src/middleware.ts`（admin認可ガード含む）
5. `src/app/(public)/page.tsx`（LP）
6. `src/app/(public)/for-engineers/page.tsx`
7. `src/app/(public)/for-companies/page.tsx`
8. `src/app/(public)/operate/page.tsx`（v2.0）
9. `src/app/(public)/inquiry/page.tsx` + `src/app/api/inquiry/route.ts`
10. `src/app/engineers/apply/page.tsx` + GitHub OAuth callback
11. `src/app/admin/layout.tsx`（admin判定）
12. `src/app/admin/page.tsx`（KPIダッシュボード）
13. `src/app/admin/inquiries/*`
14. `src/app/admin/projects/*`（一覧・詳細・新規・マッチング）
15. `src/app/admin/engineers/*`
16. `src/app/admin/companies/*`
17. `src/app/admin/subscriptions/*`（v2.0）
18. メールテンプレ実装（React Email推奨）
19. SEO（OG画像、metadata、sitemap.xml、robots.txt）
20. legal pages（terms / privacy / tokushoho）
21. Vercel デプロイ + ドメイン接続

### 22.2 各ステップで必須
- yura-post-impl-verify を必ず通す（npm run build / 型エラーゼロ / 手動QA / モバイル表示）
- yura-deploy-guard チェック実行
- 既知バグ・実装パターンは yura-deploy-guard / yura-brain を参照

### 22.3 設計上のお作法
- Server Components default, "use client" は最小限
- データフェッチは Server Component で
- フォームは React Hook Form + Server Action
- エラーは try/catch → toast表示
- 全ページ `metadata` 設定（タイトル・OG）
- 認証は middleware 経由で `/admin/*` を保護

### 22.4 admin判定ヘルパ実装例
```typescript
// src/lib/auth.ts
import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  
  const { data: admin } = await supabase
    .from("admins")
    .select("id")
    .eq("user_id", user.id)
    .single();
  
  if (!admin) redirect("/");
  return user;
}
```

### 22.5 admin layout
```typescript
// src/app/admin/layout.tsx
import { requireAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
```

### 22.6 Phase 2 / Phase 3 着手時の指示
- Phase 1完了 + Operate契約3社到達後にPhase 2着手
- Phase 2着手時はこの仕様書の §18 を起点に詳細仕様書を別途作成
- Phase 3も同様、§19 を起点に
- Phase 1範囲外の機能は**作らない**（v1スコープ厳守）

### 22.7 Yuraに確認・質問しない
- 本仕様書に書かれていない判断は、**最も保守的・実装スピード優先・偽装請負リスク回避**の方向で決定
- 仕様書とyura-brand-coreが衝突した場合、**ブランド一貫性を優先**
- v1 MVPスコープを膨らませない、書いていない機能は作らない
- 完成まで止まらず走る（yura-autopilot 全発動）

---

## 23. 補足

### 23.1 既存資産との接続点
- **imaginate**: Supabase / R2 を共有可能。同じVercel組織で運用
- **JARVIS**: Forge Operateの運用通知・モニタリング自動化に流用、Yuraの管理画面の「インシデント検知 → JARVIS経由でDiscord通知」で構築
- **BuzzLens**: Phase 3でForge Indexのデータ集計エンジンとして再利用
- **content-automation**: Phase 1.5でForge営業AIに転用、コールドメール自動生成
- **VideoTracker**: Phase 3でForge Cloud不動産プロダクトに統合候補

### 23.2 Year 2/3 の海外展開
- 韓国（ソウル）、台湾（台北）市場が次のターゲット
- Forge OSのUI多言語化を Year 2末に
- 現地パートナー1社と提携、現地法人は当面作らない
- 韓国は K-AI 政策の追い風があり狙い目、台湾は半導体産業のAI実装ニーズが旺盛

### 23.3 出口戦略
- Year 3末で評価可能な選択肢:
  1. **継続独立**: 月利1000万超えでキャッシュフロー安定、独立経営
  2. **戦略投資**: 大手SaaS（Salesforce日本、Sansan、freee等）からの出資受入
  3. **M&A**: SIer or コンサル（NTTデータ、PwC日本等）への売却、評価額10〜30億円目線
  4. **IPO準備**: ARR3億超えで上場準備、東証グロース or NASDAQ
- 5層構造（特にOS / Cloud / Index）を持つことで、上記すべてのオプションが現実的に
- 受託会社の評価額（EV/Revenue 1-2倍）から、Forgeはハイブリッド構造で**5-15倍**を狙える

---

## 24. 最終セルフ審査結果

| 審査項目 | 結果 |
|---------|------|
| Phase 1 を Claude Code が単独で完走できる粒度 | ✅ |
| Phase 2/3 の判断材料が揃っている | ✅ |
| 既存資産（imaginate / JARVIS / BuzzLens / content-automation）との接続が明示 | ✅ |
| 偽装請負回避の運用ルールが契約と運用の両面で記述 | ✅ |
| 5層構造の収益と利益率が明示 | ✅ |
| データ蓄積による堀の構造が記述 | ✅ |
| 撤退条件が定量的に定義 | ✅ |
| 12ヶ月のロードマップにKPIあり | ✅ |
| 法務リスクの段階的対応（Phase 0〜2）が明示 | ✅ |
| ブランド・LP原稿が即実装可能な完成度 | ✅ |

**この仕様書は v2.0。Phase 2着手時に v2.1（OS詳細仕様）、Phase 3着手時に v2.2（Cloud / Index詳細仕様）として更新する。**

---

**Powered by Forge.**
