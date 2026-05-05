import { z } from "zod";

export const engineerApplySchema = z.object({
  displayName: z.string().min(1, "表示名は必須です").max(100),
  bio: z.string().max(2000).optional().or(z.literal("")),
  skills: z.array(z.string()).min(1, "スキルを1つ以上選択してください"),
  aiSpecialties: z.array(z.string()).min(1, "AI特化領域を1つ以上選択してください"),
  hourlyRateMin: z.number().int().min(1000).optional(),
  hourlyRateMax: z.number().int().min(1000).optional(),
  monthlyRateMin: z.number().int().min(50000).optional(),
  monthlyRateMax: z.number().int().min(50000).optional(),
  availableHoursPerWeek: z.number().int().min(1).max(80),
  availableFrom: z.string().optional().or(z.literal("")),
  portfolioUrls: z.array(z.string().url("URL形式が正しくありません")).max(5).default([]),
  pastProjects: z
    .array(
      z.object({
        title: z.string().min(1).max(200),
        description: z.string().max(1000),
        tech: z.array(z.string()).default([]),
        url: z.string().url().optional().or(z.literal("")),
      })
    )
    .max(10)
    .default([]),
  acceptOperate: z.boolean().default(true),
});

export type EngineerApplyInput = z.infer<typeof engineerApplySchema>;
