-- ============================================
-- Forge v2.1: Engineer Premium subscription
-- ============================================
-- Engineer 月額 Premium プラン（¥3,000/月）の管理用テーブルを追加。
-- engineers テーブル本体には触れず、1:1 紐付けの専用テーブルで分離する。

create type engineer_premium_status as enum (
  'inactive',     -- 未加入
  'active',       -- 有料中
  'past_due',     -- 支払い失敗
  'cancelled',    -- 解約予約
  'expired'       -- 期間終了
);

create table engineer_premium_subscriptions (
  id uuid primary key default gen_random_uuid(),
  engineer_id uuid references engineers(id) on delete cascade unique not null,
  stripe_customer_id text not null,
  stripe_subscription_id text unique,
  status engineer_premium_status default 'inactive' not null,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean default false,
  cancelled_at timestamptz,
  -- 履歴メモ（解約理由など）
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index engineer_premium_status_idx on engineer_premium_subscriptions(status);
create index engineer_premium_stripe_sub_idx on engineer_premium_subscriptions(stripe_subscription_id);
create index engineer_premium_stripe_cust_idx on engineer_premium_subscriptions(stripe_customer_id);

-- 集計用ビュー：active premium engineer を一覧
create view active_premium_engineers as
select
  e.id as engineer_id,
  e.display_name,
  e.github_username,
  e.email,
  s.stripe_subscription_id,
  s.current_period_end,
  s.created_at as subscribed_at
from engineers e
inner join engineer_premium_subscriptions s on s.engineer_id = e.id
where s.status = 'active';

-- updated_at trigger
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger engineer_premium_updated_at
  before update on engineer_premium_subscriptions
  for each row
  execute function set_updated_at();

-- RLS: engineer は自分のだけ見える、admin は全部見える（service_role 経由）
alter table engineer_premium_subscriptions enable row level security;

create policy "engineer reads own premium" on engineer_premium_subscriptions
  for select
  using (
    engineer_id in (
      select id from engineers where user_id = auth.uid()
    )
  );

-- service_role は full access（webhook / admin から書き込み）
-- (anon/authenticated には write 権限を与えない)
