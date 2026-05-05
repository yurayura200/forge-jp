-- ============================================
-- Forge v2.0 Initial Schema
-- ============================================

-- ENUMS
create type engineer_status as enum ('pending', 'active', 'paused', 'banned');
create type project_status as enum ('inquiry', 'qualified', 'matching', 'in_progress', 'completed', 'cancelled');
create type project_phase as enum ('build', 'eval', 'operate');
create type assignment_status as enum ('proposed', 'accepted', 'declined', 'in_progress', 'completed');
create type project_type as enum ('llm_app', 'rag', 'agent', 'automation', 'integration', 'consulting', 'other');
create type budget_range as enum ('under_500k', '500k_1m', '1m_3m', '3m_5m', '5m_10m', 'over_10m');
create type duration_range as enum ('spot', 'under_1m', '1m_3m', '3m_6m', 'over_6m');
create type subscription_status as enum ('trial', 'active', 'paused', 'cancelled');
create type incident_severity as enum ('info', 'warning', 'error', 'critical');
create type industry as enum ('finance', 'healthcare', 'legal', 'real_estate', 'retail', 'manufacturing', 'hr', 'education', 'media', 'other');

-- engineers
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
  past_industries industry[] default '{}',
  accept_operate boolean default true,
  status engineer_status default 'pending',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index engineers_status_idx on engineers(status);
create index engineers_skills_idx on engineers using gin(skills);
create index engineers_specialties_idx on engineers using gin(ai_specialties);

-- companies
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

-- projects
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
  deliverables text not null,
  status project_status default 'inquiry',
  current_phase project_phase default 'build',
  has_operate boolean default true,
  internal_notes text,
  client_revenue int,
  engineer_payout int,
  margin_amount int generated always as (coalesce(client_revenue, 0) - coalesce(engineer_payout, 0)) stored,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index projects_status_idx on projects(status);
create index projects_phase_idx on projects(current_phase);
create index projects_company_idx on projects(company_id);

-- assignments
create table assignments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  engineer_id uuid references engineers(id) on delete cascade not null,
  status assignment_status default 'proposed',
  phase project_phase default 'build',
  monthly_payout int,
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

-- inquiries
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

create index inquiries_processed_idx on inquiries(processed);
create index inquiries_created_at_idx on inquiries(created_at desc);

-- subscriptions (Operate契約)
create table subscriptions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  company_id uuid references companies(id) not null,
  status subscription_status default 'trial',
  monthly_amount int not null,
  engineer_payout int,
  margin int generated always as (coalesce(monthly_amount, 0) - coalesce(engineer_payout, 0)) stored,
  start_date date not null,
  end_date date,
  minimum_term_months int default 6,
  auto_renew boolean default true,
  stripe_subscription_id text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index subscriptions_status_idx on subscriptions(status);
create index subscriptions_project_idx on subscriptions(project_id);

-- incidents (運用インシデント)
create table incidents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  severity incident_severity not null,
  title text not null,
  description text,
  detected_by text,
  metric_type text,
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

-- evaluations
create table evaluations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  eval_set_id text not null,
  model_name text not null,
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

-- prompts (プロンプト版管理)
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

-- model_costs
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

-- consent_records
create table consent_records (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  company_id uuid references companies(id) not null,
  consent_type text not null,
  consented boolean not null,
  consented_at timestamptz default now(),
  expires_at timestamptz,
  document_url text,
  notes text
);

create index consent_records_project_idx on consent_records(project_id);
create index consent_records_type_idx on consent_records(consent_type);

-- index_data_points
create table index_data_points (
  id uuid primary key default gen_random_uuid(),
  industry industry not null,
  metric_name text not null,
  metric_value numeric not null,
  metric_unit text,
  data_source_count int,
  collected_at date not null,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

create index index_data_points_industry_idx on index_data_points(industry);
create index index_data_points_collected_at_idx on index_data_points(collected_at desc);

-- admins
create table admins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade unique not null,
  email text not null unique,
  role text default 'admin',
  created_at timestamptz default now()
);

-- updated_at trigger
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

-- RLS enable
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

-- engineers policies
create policy "engineers_self_read" on engineers
  for select using (auth.uid() = user_id);
create policy "engineers_self_update" on engineers
  for update using (auth.uid() = user_id);
create policy "engineers_self_insert" on engineers
  for insert with check (auth.uid() = user_id);
create policy "engineers_admin_all" on engineers
  for all using (exists (select 1 from admins where user_id = auth.uid()));

-- inquiries policies (誰でも書き込みOK、読み取りはadminのみ)
create policy "inquiries_anyone_insert" on inquiries
  for insert with check (true);
create policy "inquiries_admin_read" on inquiries
  for select using (exists (select 1 from admins where user_id = auth.uid()));
create policy "inquiries_admin_update" on inquiries
  for update using (exists (select 1 from admins where user_id = auth.uid()));

-- admin only tables
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
