# Forge

**AIを、動かし続ける。**

日本のAI実装エージェンシー。AI構築から運用まで、一気通貫で提供する。

---

## このリポジトリの状態（Phase 1 MVP）

Yura が Claude.ai 上で v2.0 仕様書（`docs/forge-spec-v2.md` を別途参照）に基づいてスキャフォールドしたプロジェクト。Claude Code で続きを実装することを想定している。

### 出来上がっているもの

**インフラ・設定**
- Next.js 14.2 (App Router) + TypeScript strict + Tailwind v3.4 + shadcn/ui 互換構成
- 環境変数雛形 (`.env.local.example`)
- Supabase 完全スキーマ（13テーブル + RLS + ENUM + trigger）
- middleware（セッション自動リフレッシュ）

**公開サイト（フル実装）**
- `/` トップ LP（Hero / Problem / Solution / HowItWorks / Strengths / Pricing / FAQ / CTA）
- `/for-companies` 企業向け LP
- `/for-engineers` エンジニア向け LP
- `/operate` 運用サービス LP
- `/about` 会社情報
- `/legal/{terms,privacy,tokushoho}` 法的ページ
- `/inquiry` 問い合わせフォーム + 完了画面
- `/engineers/apply` GitHub OAuth → プロフィール登録 → 完了画面

**API**
- `POST /api/inquiry` 問い合わせ受信（Supabase 保存 + Resend 二通送信）
- `POST /api/engineers` エンジニア登録（auth 必須、user_metadata から GitHub 名取得）
- `GET  /api/auth/callback` OAuth コード→セッション交換

**管理画面**（`requireAdmin` で保護）
- ダッシュボード（KPI: 未処理問い合わせ・アクティブエンジニア・進行中案件・MRR）
- 問い合わせ一覧／詳細
- 案件一覧／詳細（マッチングスコアパネル付き）／新規作成（プレースホルダ）
- エンジニア一覧／詳細
- クライアント企業一覧
- Operate 契約一覧（MRR・マージン集計付き）
- 財務サマリー（Build売上 / Operate MRR・ARR）

**契約書テンプレ（`contracts/`）**
- `master-engineer.md` エンジニア向け業務委託基本契約
- `client-build-msa.md` クライアント Build 契約
- `client-operate-msa.md` クライアント Operate 契約
- `nda.md` NDA
- `consent-data-usage.md` 外部AIサービス利用同意書

### まだ無いもの（Claude Code で追加）

1. **shadcn/ui コンポーネント本体**
   ```bash
   npx shadcn@latest add button input textarea select card badge avatar dialog form label tabs toast separator table dropdown-menu sheet
   ```
   現状は素の `<button>` `<input>` 等を Tailwind で組んでいる。shadcn を入れたら順次置き換えても良い。

2. **管理画面の編集 UI**
   - エンジニアの審査ステータス変更（pending→active）
   - 問い合わせ→案件への変換アクション
   - 案件の編集フォーム
   - 候補エンジニアへのアサイン送信

3. **OG 画像** (`public/og.png`) と favicon

4. **Phase 2 以降の機能**
   - Stripe Connect（請求自動化）
   - LangFuse / Helicone（評価・監視）
   - Forge OS（プロンプト版管理 / モデル切替 / コスト最適化）
   - Forge Index データ収集パイプライン

仕様書 v2.0 に詳細あり。

---

## セットアップ手順

### 1. 依存インストール
```bash
npm install
```

### 2. shadcn コンポーネント追加
```bash
npx shadcn@latest add button input textarea select card badge avatar dialog form label tabs toast separator table dropdown-menu sheet
```

### 3. 環境変数
```bash
cp .env.local.example .env.local
```

最低限埋めるもの:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `INTERNAL_NOTIFY_EMAIL`（運営側通知の送信先）
- `NEXT_PUBLIC_COMPANY_NAME`（既存法人名）
- `NEXT_PUBLIC_COMPANY_ADDRESS`（既存法人住所）
- `NEXT_PUBLIC_SITE_URL`（本番ドメイン）

### 4. Supabase

#### 4-1. プロジェクト作成
- Region: Tokyo（ap-northeast-1）
- 新規 Supabase プロジェクトを作成

#### 4-2. マイグレーション適用
```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

または管理画面 SQL Editor で `supabase/migrations/0001_init.sql` を貼り付けて実行。

#### 4-3. GitHub OAuth 設定
1. Supabase Dashboard → Authentication → Providers → GitHub を有効化
2. GitHub 側で OAuth App を作成
   - Authorization callback URL: `https://<your-supabase-project>.supabase.co/auth/v1/callback`
3. Client ID / Secret を Supabase に貼り付け
4. Site URL に本番 URL を設定、Redirect URL に開発・本番両方を追加

#### 4-4. 自分を admin にする
```sql
-- まず一度 GitHub でログインして auth.users にレコードを作る
-- その後、SQL Editor で：
insert into admins (user_id, email, role)
select id, email, 'admin'
from auth.users
where email = 'あなたのメール';
```

### 5. Resend
1. Resend アカウント作成
2. ドメイン認証（forge.jp 等）
3. `RESEND_API_KEY` を取得して .env.local に設定

### 6. 起動
```bash
npm run dev
```

→ http://localhost:3000

### 7. 型チェック・ビルド確認
```bash
npm run typecheck
npm run build
```

### 8. デプロイ
```bash
# Vercel
vercel --prod
```

Vercel 環境変数に `.env.local` の中身を全部投入。Region は Tokyo (`hnd1`)。

---

## ディレクトリ構造

```
forge/
├── src/
│   ├── app/
│   │   ├── (public)/              # 公開ページ（共通レイアウト）
│   │   │   ├── page.tsx           # トップ LP
│   │   │   ├── for-companies/
│   │   │   ├── for-engineers/
│   │   │   ├── operate/
│   │   │   ├── about/
│   │   │   ├── inquiry/
│   │   │   └── legal/
│   │   ├── engineers/apply/       # GitHub OAuth → 登録
│   │   ├── admin/                 # 管理画面（requireAdmin）
│   │   ├── api/
│   │   │   ├── inquiry/
│   │   │   ├── engineers/
│   │   │   └── auth/callback/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── not-found.tsx
│   ├── components/
│   │   ├── public/                # Header, Footer
│   │   ├── forms/                 # InquiryForm, EngineerApplyForm
│   │   ├── admin/                 # AdminNav
│   │   └── ui/                    # shadcn が入る場所
│   ├── lib/
│   │   ├── supabase/              # client / server / middleware
│   │   ├── validations/           # zod schemas
│   │   ├── email/                 # resend client + templates
│   │   ├── auth.ts                # requireAdmin / requireUser
│   │   ├── utils.ts               # cn / formatJPY / formatDate
│   │   ├── industries.ts          # SKILLS / AI_SPECIALTIES / INDUSTRY_LABELS
│   │   └── matching.ts            # calculateMatchScore
│   ├── middleware.ts
│   └── types/
├── supabase/
│   └── migrations/
│       └── 0001_init.sql
├── contracts/                     # 契約書テンプレ（5本）
├── public/                        # OG 画像等
└── docs/                          # 仕様書（forge-spec-v2.md）
```

---

## 重要ポイント（実装時に外さないこと）

### 1. 偽装請負の回避
- すべての契約は **成果物完成型** または **業務遂行に対する成果報酬型**
- 業務時間・業務場所・業務遂行方法に関する具体的指示はしない
- エンジニアが他案件と並行受託することを契約上明示
- これは `master-engineer.md` 第4条で担保している

### 2. ブランド規約
- 英語表記のみ（カタカナ「フォージ」は使わない）
- カラー: forge.black `#0A0A0A` / forge.ember `#FF6B35` / forge.surface `#F5F5F4`
- Geist + Noto Sans JP
- 「！」「✨」等の煽り表記は使わない（Vercel / Linear / Anthropic 系の宣言調）
- タグライン: 「AIを、動かし続ける。」

### 3. Build 単独の場合は 1.5x
LP の料金セクション、Operate ページ、Build MSA 第6条で明示済み。Operate 契約とのバンドルを基本としている。

### 4. RLS のポイント
- `engineers`: 本人だけが自分のレコードを読み書き、admin は全権
- `inquiries`: 誰でも insert 可（公開フォーム）、読み取りは admin のみ
- その他のテーブル: admin のみアクセス可
- service role を使うのは API ルートで「公開フォームから insert」「auth ユーザーが自分の engineers レコードを作る」場面のみ

### 5. メール送信
- Resend が未設定でも送信処理は失敗しない（`sendEmail` で握りつぶす）
- 問い合わせ・登録は **Supabase 保存が成功すれば成功** 扱い

---

## 仕様書

詳細仕様は `docs/forge-spec-v2.md` を参照。Yura が Claude.ai 上で作成した v2.0 仕様書には以下が含まれる：
- 5層エコシステム（Build / Operate / Forge OS / Forge Cloud / Forge Index）
- 12ヶ月ロードマップ
- マーケ戦略（90% 待ちにする 12 ヶ月プレイブック）
- 競合分析・ポジショニング
- DB スキーマ詳細
- 全 LP コピー
- 契約書全文

仕様書はこのリポジトリには含まれていない場合がある。Yura に確認すること。

---

## 何から始めるか（Claude Code 着手順）

```bash
# 1. 依存インストール + shadcn 追加
npm install
npx shadcn@latest add button input textarea select card badge avatar dialog form label tabs toast separator table dropdown-menu sheet

# 2. 型チェックでミスがないか確認
npm run typecheck

# 3. .env.local 設定 → Supabase migration 適用 → GitHub OAuth 設定 → admin 投入

# 4. dev 起動して動作確認
npm run dev

# 5. ビルド確認
npm run build
```

ここまで通ったら次のタスク（優先順）：

1. `public/og.png` と favicon 追加
2. 問い合わせ詳細画面に「案件に変換」ボタンと変換 API
3. エンジニア審査の状態変更 UI（pending → active）
4. 案件作成フォームの本実装（`/admin/projects/new`）
5. メール通知のテンプレ磨き込み
6. Vercel デプロイ
