type MatchEngineer = {
  skills: string[];
  ai_specialties: string[];
  monthly_rate_min: number | null;
  monthly_rate_max: number | null;
  available_from: string | null;
  past_industries: string[] | null;
  accept_operate: boolean | null;
};

type MatchProject = {
  required_skills: string[];
  project_type: string;
  budget_range: string;
  start_date: string | null;
  has_operate: boolean | null;
  industry?: string | null;
};

const PROJECT_TYPE_TO_SPECIALTY: Record<string, string> = {
  llm_app: "LLMアプリ開発",
  rag: "RAGシステム",
  agent: "AIエージェント",
  automation: "AI運用・モニタリング",
  integration: "LLMアプリ開発",
  consulting: "モデル選定・ベンチマーク",
  other: "LLMアプリ開発",
};

const BUDGET_TO_MONTHLY_MAX: Record<string, number> = {
  under_500k: 400000,
  "500k_1m": 800000,
  "1m_3m": 1500000,
  "3m_5m": 2500000,
  "5m_10m": 4000000,
  over_10m: 6000000,
};

export function calculateMatchScore(
  project: MatchProject,
  engineer: MatchEngineer
): number {
  let score = 0;

  // Skill overlap (max 40)
  if (project.required_skills.length > 0) {
    const overlap = project.required_skills.filter((s) =>
      engineer.skills.includes(s)
    ).length;
    score += Math.min(40, (overlap / project.required_skills.length) * 40);
  }

  // AI specialty match (max 25)
  const expectedSpecialty = PROJECT_TYPE_TO_SPECIALTY[project.project_type];
  if (expectedSpecialty && engineer.ai_specialties.includes(expectedSpecialty)) {
    score += 25;
  }

  // Rate within budget (max 15)
  const budgetMax = BUDGET_TO_MONTHLY_MAX[project.budget_range];
  if (budgetMax && engineer.monthly_rate_min) {
    if (engineer.monthly_rate_min <= budgetMax) {
      score += 15;
    } else if (engineer.monthly_rate_min <= budgetMax * 1.2) {
      score += 7;
    }
  }

  // Operate willingness (max 10)
  if (engineer.accept_operate && project.has_operate) {
    score += 10;
  }

  // Industry experience (max 10)
  if (
    project.industry &&
    engineer.past_industries &&
    engineer.past_industries.includes(project.industry)
  ) {
    score += 10;
  }

  // Availability penalty
  if (project.start_date && engineer.available_from) {
    if (engineer.available_from > project.start_date) {
      score -= 10;
    }
  }

  return Math.max(0, Math.min(100, Math.round(score)));
}
