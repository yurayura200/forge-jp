-- ============================================
-- Forge v2.2: API Platform (BYOK Gateway)
-- ============================================
-- Forge を「日本の AI 運用インフラ」として API 化。
--
-- アーキテクチャ：BYOK（Bring Your Own Key）gateway モデル
-- - 顧客は自分の Anthropic / OpenAI API キーを Forge に保管
-- - Forge は gateway として中継し、ログ・監視・コスト追跡・アラートを提供
-- - 顧客は LLM 実費を直接 provider に支払い、Forge には gateway fee（月額固定）を払う
-- - Forge は LLM コストを背負わないため、margin はほぼ 100%
--
-- 料金モデル（4 tier）
-- Free:    ¥0      /  1,000 logged requests/月
-- Starter: ¥980    / 50,000 requests/月
-- Growth:  ¥4,980  / 500,000 requests/月
-- Scale:   ¥19,800 / 5,000,000 requests/月

create type api_plan_tier as enum ('free', 'starter', 'growth', 'scale', 'enterprise');
create type api_key_status as enum ('active', 'revoked', 'expired');
create type llm_provider as enum ('anthropic', 'openai', 'google', 'other');

-- マスタ：プラン定義
create table api_plans (
  tier api_plan_tier primary key,
  display_name text not null,
  monthly_jpy int not null,
  monthly_request_quota int not null,
  -- Stripe Price ID（free 以外で必須）
  stripe_price_id text,
  features text[] default '{}',
  active boolean default true,
  created_at timestamptz default now()
);

insert into api_plans (tier, display_name, monthly_jpy, monthly_request_quota, features) values
  ('free',       'Free',       0,       1000,    array['observability ダッシュボード', '基本ロギング']),
  ('starter',    'Starter',    980,     50000,   array['email サポート', '使用量ダッシュボード', 'コスト追跡']),
  ('growth',     'Growth',     4980,    500000,  array['優先サポート', 'チームメンバー', '監視アラート']),
  ('scale',      'Scale',      19800,   5000000, array['SLA 99.5%', '専任 Slack', 'カスタム警告ルール']),
  ('enterprise', 'Enterprise', 0,       0,       array['SLA 99.9%', 'on-premise 対応', '個別契約']);

-- 顧客
create table api_customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique,
  email text not null unique,
  company_name text,
  display_name text,
  -- Stripe
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  current_plan api_plan_tier default 'free' not null,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index api_customers_email_idx on api_customers(email);
create index api_customers_plan_idx on api_customers(current_plan);

-- 顧客が設定する upstream provider key（暗号化保管）
create table customer_provider_keys (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references api_customers(id) on delete cascade not null,
  provider llm_provider not null,
  -- 暗号化された key（pgp_sym_encrypt で encryption_key を使用）
  encrypted_key bytea not null,
  -- 表示用：先頭 8 文字 + 末尾 4 文字
  key_preview text,
  display_name text default 'Default',
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (customer_id, provider, display_name)
);

create index customer_provider_keys_idx on customer_provider_keys(customer_id, provider);

-- Forge 発行の API key（顧客が gateway 叩く用）
create table api_keys (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references api_customers(id) on delete cascade not null,
  key_prefix text not null,            -- "forge_live_xxxxxxxx" の prefix 部分
  key_hash text not null unique,       -- SHA-256 ハッシュ（生 key は保存しない）
  display_name text default 'Default',
  status api_key_status default 'active',
  last_used_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz default now(),
  revoked_at timestamptz
);

create index api_keys_customer_idx on api_keys(customer_id);
create index api_keys_status_idx on api_keys(status);
create index api_keys_hash_idx on api_keys(key_hash);

-- 使用ログ（毎リクエスト）
create table api_usage_logs (
  id bigserial primary key,
  customer_id uuid references api_customers(id) on delete cascade not null,
  api_key_id uuid references api_keys(id) on delete set null,
  provider llm_provider,
  model text,
  endpoint text not null,
  method text default 'POST',
  status_code int,
  input_tokens int,
  output_tokens int,
  -- LLM 実費（参考値、provider 直接請求のため Forge 側課金には使わない）
  upstream_cost_jpy_x10000 int,
  duration_ms int,
  error text,
  created_at timestamptz default now()
);

create index api_usage_customer_idx on api_usage_logs(customer_id, created_at desc);
create index api_usage_created_idx on api_usage_logs(created_at desc);

-- 月次集計ビュー（quota 判定用）
create or replace view api_usage_current_month as
select
  customer_id,
  count(*) filter (where status_code between 200 and 299) as success_calls,
  count(*) as total_calls,
  coalesce(sum(input_tokens), 0) as input_tokens,
  coalesce(sum(output_tokens), 0) as output_tokens,
  coalesce(sum(upstream_cost_jpy_x10000), 0) as upstream_cost_jpy_x10000
from api_usage_logs
where created_at >= date_trunc('month', now() at time zone 'Asia/Tokyo')
group by customer_id;

create trigger api_customers_updated_at
  before update on api_customers
  for each row
  execute function set_updated_at();

create trigger customer_provider_keys_updated_at
  before update on customer_provider_keys
  for each row
  execute function set_updated_at();

alter table api_customers enable row level security;
alter table api_keys enable row level security;
alter table api_usage_logs enable row level security;
alter table customer_provider_keys enable row level security;

create policy "customer reads own" on api_customers
  for select using (user_id = auth.uid());

create policy "customer reads own provider keys" on customer_provider_keys
  for select using (
    customer_id in (select id from api_customers where user_id = auth.uid())
  );

create policy "customer reads own keys" on api_keys
  for select using (
    customer_id in (select id from api_customers where user_id = auth.uid())
  );

create policy "customer reads own usage" on api_usage_logs
  for select using (
    customer_id in (select id from api_customers where user_id = auth.uid())
  );

-- service_role bypasses RLS automatically
