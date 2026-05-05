-- ============================================
-- Forge v2.3: Assignment apply fields
-- ============================================
-- エンジニアが in-app で案件に応募できるよう、bid/cover_letter フィールドを追加。

alter table assignments
  add column if not exists cover_letter text,
  add column if not exists proposed_payout int,
  add column if not exists proposed_hours_per_week int;

-- 応募一覧用 view（admin が project ごとに応募者を見る）
create or replace view project_applications as
select
  a.id as assignment_id,
  a.project_id,
  a.engineer_id,
  a.status,
  a.phase,
  a.cover_letter,
  a.proposed_payout,
  a.proposed_hours_per_week,
  a.monthly_payout,
  a.proposed_at,
  a.responded_at,
  e.display_name as engineer_name,
  e.github_username,
  e.email as engineer_email,
  e.skills as engineer_skills,
  e.ai_specialties,
  e.hourly_rate_min,
  e.hourly_rate_max,
  e.monthly_rate_min,
  e.monthly_rate_max,
  e.portfolio_urls,
  p.title as project_title,
  p.budget_range,
  p.duration,
  p.status as project_status
from assignments a
inner join engineers e on e.id = a.engineer_id
inner join projects p on p.id = a.project_id;
