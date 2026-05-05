"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { engineerApplySchema, type EngineerApplyInput } from "@/lib/validations/engineer";
import { SKILLS, AI_SPECIALTIES } from "@/lib/industries";

const labelClass = "block text-sm font-medium mb-2";
const inputClass =
  "w-full rounded-md border border-forge-border bg-white px-3 py-2.5 text-sm focus:border-forge-ember focus:outline-none focus:ring-1 focus:ring-forge-ember";
const errorClass = "mt-1 text-xs text-red-600";

type Props = {
  defaultDisplayName?: string;
};

export function EngineerApplyForm({ defaultDisplayName = "" }: Props) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EngineerApplyInput>({
    resolver: zodResolver(engineerApplySchema),
    defaultValues: {
      displayName: defaultDisplayName,
      skills: [],
      aiSpecialties: [],
      portfolioUrls: [],
      pastProjects: [],
      acceptOperate: true,
      availableHoursPerWeek: 30,
    },
  });

  const portfolioFields = useFieldArray({
    control,
    name: "portfolioUrls" as never,
  });

  const projectFields = useFieldArray({
    control,
    name: "pastProjects",
  });

  async function onSubmit(values: EngineerApplyInput) {
    setServerError(null);
    try {
      const res = await fetch("/api/engineers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setServerError(body.error || "登録に失敗しました。時間をおいて再度お試しください。");
        return;
      }
      router.push("/engineers/apply/complete");
    } catch {
      setServerError("ネットワークエラーが発生しました。");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic */}
      <div>
        <label className={labelClass}>
          表示名 <span className="text-red-600">*</span>
        </label>
        <input className={inputClass} {...register("displayName")} />
        {errors.displayName && <p className={errorClass}>{errors.displayName.message}</p>}
      </div>

      <div>
        <label className={labelClass}>自己紹介</label>
        <textarea
          rows={4}
          className={inputClass}
          placeholder="経歴、得意領域、関心のあるテーマなど"
          {...register("bio")}
        />
      </div>

      {/* Skills */}
      <Controller
        name="skills"
        control={control}
        render={({ field }) => (
          <div>
            <label className={labelClass}>
              スキル（複数選択） <span className="text-red-600">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((skill) => {
                const selected = field.value.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => {
                      const next = selected
                        ? field.value.filter((s) => s !== skill)
                        : [...field.value, skill];
                      field.onChange(next);
                    }}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium border transition ${
                      selected
                        ? "bg-forge-black text-white border-forge-black"
                        : "bg-white text-forge-muted border-forge-border hover:border-forge-black"
                    }`}
                  >
                    {skill}
                  </button>
                );
              })}
            </div>
            {errors.skills && <p className={errorClass}>{errors.skills.message}</p>}
          </div>
        )}
      />

      {/* AI specialties */}
      <Controller
        name="aiSpecialties"
        control={control}
        render={({ field }) => (
          <div>
            <label className={labelClass}>
              AI特化領域 <span className="text-red-600">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {AI_SPECIALTIES.map((spec) => {
                const selected = field.value.includes(spec);
                return (
                  <button
                    key={spec}
                    type="button"
                    onClick={() => {
                      const next = selected
                        ? field.value.filter((s) => s !== spec)
                        : [...field.value, spec];
                      field.onChange(next);
                    }}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium border transition ${
                      selected
                        ? "bg-forge-ember text-white border-forge-ember"
                        : "bg-white text-forge-muted border-forge-border hover:border-forge-black"
                    }`}
                  >
                    {spec}
                  </button>
                );
              })}
            </div>
            {errors.aiSpecialties && <p className={errorClass}>{errors.aiSpecialties.message}</p>}
          </div>
        )}
      />

      {/* Rate */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>月額単価 最低（円）</label>
          <input
            type="number"
            className={inputClass}
            placeholder="例: 800000"
            {...register("monthlyRateMin", { valueAsNumber: true })}
          />
        </div>
        <div>
          <label className={labelClass}>月額単価 最高（円）</label>
          <input
            type="number"
            className={inputClass}
            placeholder="例: 1500000"
            {...register("monthlyRateMax", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>
            週稼働可能時間 <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            className={inputClass}
            {...register("availableHoursPerWeek", { valueAsNumber: true })}
          />
          {errors.availableHoursPerWeek && (
            <p className={errorClass}>{errors.availableHoursPerWeek.message}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>稼働開始可能日</label>
          <input type="date" className={inputClass} {...register("availableFrom")} />
        </div>
      </div>

      {/* Portfolio URLs */}
      <div>
        <label className={labelClass}>ポートフォリオURL（最大5件）</label>
        <div className="space-y-2">
          {portfolioFields.fields.map((f, idx) => (
            <div key={f.id} className="flex gap-2">
              <input
                type="url"
                className={inputClass}
                placeholder="https://..."
                {...register(`portfolioUrls.${idx}` as const)}
              />
              <button
                type="button"
                onClick={() => portfolioFields.remove(idx)}
                className="rounded-md border border-forge-border px-3 py-2 text-forge-muted hover:bg-forge-surface"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
          {portfolioFields.fields.length < 5 && (
            <button
              type="button"
              onClick={() => portfolioFields.append("")}
              className="inline-flex items-center gap-1 text-sm text-forge-ember hover:underline"
            >
              <Plus className="h-4 w-4" />
              URLを追加
            </button>
          )}
        </div>
      </div>

      {/* Past projects */}
      <div>
        <label className={labelClass}>過去のプロジェクト（最大10件）</label>
        <div className="space-y-4">
          {projectFields.fields.map((f, idx) => (
            <div key={f.id} className="rounded-md border border-forge-border p-4 space-y-3">
              <div className="flex items-start gap-2">
                <input
                  className={inputClass}
                  placeholder="プロジェクトタイトル"
                  {...register(`pastProjects.${idx}.title` as const)}
                />
                <button
                  type="button"
                  onClick={() => projectFields.remove(idx)}
                  className="rounded-md border border-forge-border px-3 py-2 text-forge-muted hover:bg-forge-surface"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <textarea
                rows={2}
                className={inputClass}
                placeholder="概要"
                {...register(`pastProjects.${idx}.description` as const)}
              />
              <input
                type="url"
                className={inputClass}
                placeholder="URL（任意）"
                {...register(`pastProjects.${idx}.url` as const)}
              />
            </div>
          ))}
          {projectFields.fields.length < 10 && (
            <button
              type="button"
              onClick={() =>
                projectFields.append({ title: "", description: "", tech: [], url: "" })
              }
              className="inline-flex items-center gap-1 text-sm text-forge-ember hover:underline"
            >
              <Plus className="h-4 w-4" />
              プロジェクトを追加
            </button>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-forge-border bg-forge-surface p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-forge-border text-forge-ember focus:ring-forge-ember"
            {...register("acceptOperate")}
          />
          <div className="text-sm">
            <p className="font-medium">運用フェーズ案件への参画も希望する</p>
            <p className="mt-1 text-forge-muted">
              構築フェーズ後の月額運用に継続して参画。月次継続報酬を得られます。
            </p>
          </div>
        </label>
      </div>

      {serverError && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-forge-black px-6 py-3.5 text-white font-medium hover:bg-forge-ember transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "送信中..." : "登録する"}
      </button>
    </form>
  );
}
