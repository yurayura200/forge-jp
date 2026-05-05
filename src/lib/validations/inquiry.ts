import { z } from "zod";

export const PROJECT_TYPES = [
  "llm_app",
  "rag",
  "agent",
  "automation",
  "integration",
  "consulting",
  "other",
] as const;

export const PROJECT_TYPE_LABELS: Record<(typeof PROJECT_TYPES)[number], string> = {
  llm_app: "LLM活用アプリ開発",
  rag: "RAGシステム構築",
  agent: "AIエージェント開発",
  automation: "業務自動化",
  integration: "既存システムとのAI連携",
  consulting: "AIコンサルティング",
  other: "その他",
};

export const BUDGET_RANGES = [
  "under_500k",
  "500k_1m",
  "1m_3m",
  "3m_5m",
  "5m_10m",
  "over_10m",
] as const;

export const BUDGET_LABELS: Record<(typeof BUDGET_RANGES)[number], string> = {
  under_500k: "〜50万円",
  "500k_1m": "50万〜100万円",
  "1m_3m": "100万〜300万円",
  "3m_5m": "300万〜500万円",
  "5m_10m": "500万〜1000万円",
  over_10m: "1000万円以上",
};

export const DURATIONS = ["spot", "under_1m", "1m_3m", "3m_6m", "over_6m"] as const;

export const DURATION_LABELS: Record<(typeof DURATIONS)[number], string> = {
  spot: "スポット",
  under_1m: "1ヶ月以内",
  "1m_3m": "1〜3ヶ月",
  "3m_6m": "3〜6ヶ月",
  over_6m: "6ヶ月以上",
};

export const COMPANY_SIZES = ["1-10", "11-50", "51-200", "201-1000", "1000+"] as const;

export const inquirySchema = z.object({
  companyName: z.string().min(1, "会社名は必須です").max(200),
  contactName: z.string().min(1, "ご担当者名は必須です").max(100),
  contactEmail: z.string().email("メール形式が正しくありません"),
  contactPhone: z.string().max(50).optional().or(z.literal("")),
  industry: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z
      .enum([
        "finance",
        "healthcare",
        "legal",
        "real_estate",
        "retail",
        "manufacturing",
        "hr",
        "education",
        "media",
        "other",
      ])
      .optional()
  ),
  companySize: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.enum(COMPANY_SIZES).optional()
  ),
  projectType: z.enum(PROJECT_TYPES),
  needsOperate: z.boolean().default(true),
  budgetRange: z.enum(BUDGET_RANGES),
  duration: z.enum(DURATIONS),
  startDate: z.string().optional().or(z.literal("")),
  message: z.string().min(20, "20文字以上で入力してください").max(5000),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
