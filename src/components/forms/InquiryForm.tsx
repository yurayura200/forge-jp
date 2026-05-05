"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  inquirySchema,
  type InquiryInput,
  PROJECT_TYPES,
  PROJECT_TYPE_LABELS,
  BUDGET_RANGES,
  BUDGET_LABELS,
  DURATIONS,
  DURATION_LABELS,
  COMPANY_SIZES,
} from "@/lib/validations/inquiry";
import { INDUSTRIES, INDUSTRY_LABELS } from "@/lib/industries";

const labelClass = "block text-sm font-medium mb-2";
const inputClass =
  "w-full rounded-md border border-forge-border bg-white px-3 py-2.5 text-sm focus:border-forge-ember focus:outline-none focus:ring-1 focus:ring-forge-ember";
const errorClass = "mt-1 text-xs text-red-600";

export function InquiryForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      needsOperate: true,
    },
  });

  async function onSubmit(values: InquiryInput) {
    setServerError(null);
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setServerError(body.error || "送信に失敗しました。時間をおいて再度お試しください。");
        return;
      }
      router.push("/inquiry/complete");
    } catch {
      setServerError("ネットワークエラーが発生しました。");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>
            会社名 <span className="text-red-600">*</span>
          </label>
          <input className={inputClass} {...register("companyName")} />
          {errors.companyName && <p className={errorClass}>{errors.companyName.message}</p>}
        </div>
        <div>
          <label className={labelClass}>
            ご担当者名 <span className="text-red-600">*</span>
          </label>
          <input className={inputClass} {...register("contactName")} />
          {errors.contactName && <p className={errorClass}>{errors.contactName.message}</p>}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>
            メールアドレス <span className="text-red-600">*</span>
          </label>
          <input
            type="email"
            className={inputClass}
            {...register("contactEmail")}
            autoComplete="email"
          />
          {errors.contactEmail && <p className={errorClass}>{errors.contactEmail.message}</p>}
        </div>
        <div>
          <label className={labelClass}>電話番号</label>
          <input className={inputClass} {...register("contactPhone")} autoComplete="tel" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>業界</label>
          <select className={inputClass} {...register("industry")} defaultValue="">
            <option value="">選択してください</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>
                {INDUSTRY_LABELS[ind]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>従業員規模</label>
          <select className={inputClass} {...register("companySize")} defaultValue="">
            <option value="">選択してください</option>
            {COMPANY_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}名
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>
          案件タイプ <span className="text-red-600">*</span>
        </label>
        <select className={inputClass} {...register("projectType")} defaultValue="">
          <option value="" disabled>
            選択してください
          </option>
          {PROJECT_TYPES.map((type) => (
            <option key={type} value={type}>
              {PROJECT_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
        {errors.projectType && <p className={errorClass}>{errors.projectType.message}</p>}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelClass}>
            予算感 <span className="text-red-600">*</span>
          </label>
          <select className={inputClass} {...register("budgetRange")} defaultValue="">
            <option value="" disabled>
              選択してください
            </option>
            {BUDGET_RANGES.map((b) => (
              <option key={b} value={b}>
                {BUDGET_LABELS[b]}
              </option>
            ))}
          </select>
          {errors.budgetRange && <p className={errorClass}>{errors.budgetRange.message}</p>}
        </div>
        <div>
          <label className={labelClass}>
            期間 <span className="text-red-600">*</span>
          </label>
          <select className={inputClass} {...register("duration")} defaultValue="">
            <option value="" disabled>
              選択してください
            </option>
            {DURATIONS.map((d) => (
              <option key={d} value={d}>
                {DURATION_LABELS[d]}
              </option>
            ))}
          </select>
          {errors.duration && <p className={errorClass}>{errors.duration.message}</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>開始希望時期</label>
        <input type="date" className={inputClass} {...register("startDate")} />
      </div>

      <div className="rounded-lg border border-forge-border bg-forge-surface p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-forge-border text-forge-ember focus:ring-forge-ember"
            {...register("needsOperate")}
          />
          <div className="text-sm">
            <p className="font-medium">運用フェーズ（Operate）も希望する</p>
            <p className="mt-1 text-forge-muted">
              構築後の運用（精度監視、コスト最適化、モデル更新追従）を月額固定で。Operate無しはBuild価格1.5倍。
            </p>
          </div>
        </label>
      </div>

      <div>
        <label className={labelClass}>
          ご相談内容 <span className="text-red-600">*</span>
        </label>
        <textarea
          rows={6}
          className={inputClass}
          placeholder="現状の課題、実現したいこと、想定するシステム規模、関連する既存システムなどをお書きください（20文字以上）"
          {...register("message")}
        />
        {errors.message && <p className={errorClass}>{errors.message.message}</p>}
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
        {isSubmitting ? "送信中..." : "送信する"}
      </button>
      <p className="text-xs text-forge-muted text-center">
        送信いただいた情報はプライバシーポリシーに従って取り扱います。
      </p>
    </form>
  );
}
