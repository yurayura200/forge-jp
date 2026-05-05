import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";
import {
  PROJECT_TYPE_LABELS,
  BUDGET_LABELS,
  DURATION_LABELS,
} from "@/lib/validations/inquiry";
import { INDUSTRY_LABELS } from "@/lib/industries";

export const dynamic = "force-dynamic";

type Params = { id: string };

type RawPayload = {
  industry?: keyof typeof INDUSTRY_LABELS;
  companySize?: string;
  projectType?: keyof typeof PROJECT_TYPE_LABELS;
  budgetRange?: keyof typeof BUDGET_LABELS;
  duration?: keyof typeof DURATION_LABELS;
  startDate?: string;
  needsOperate?: boolean;
  contactPhone?: string;
};

export default async function InquiryDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const supabase = await createServerClient();
  const { data: row } = await supabase
    .from("inquiries")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!row) notFound();
  const raw = (row.raw_payload || {}) as RawPayload;

  return (
    <div>
      <Link
        href="/admin/inquiries"
        className="text-sm text-forge-muted hover:text-forge-black"
      >
        ← 一覧に戻る
      </Link>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">問い合わせ詳細</h1>
      <p className="text-sm text-forge-muted mt-1">{formatDateTime(row.created_at)}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-lg border border-forge-border bg-white p-6">
          <h2 className="font-semibold mb-4">ご相談内容</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{row.message}</p>
        </div>

        <div className="rounded-lg border border-forge-border bg-white p-6">
          <h2 className="font-semibold mb-4">基本情報</h2>
          <dl className="space-y-3 text-sm">
            <Row label="会社" value={row.company_name} />
            <Row label="担当" value={row.contact_name} />
            <Row label="メール" value={row.contact_email} />
            <Row label="電話" value={raw.contactPhone} />
            <Row label="業界" value={raw.industry ? INDUSTRY_LABELS[raw.industry] : null} />
            <Row label="規模" value={raw.companySize} />
            <Row
              label="案件タイプ"
              value={raw.projectType ? PROJECT_TYPE_LABELS[raw.projectType] : null}
            />
            <Row
              label="予算"
              value={raw.budgetRange ? BUDGET_LABELS[raw.budgetRange] : null}
            />
            <Row
              label="期間"
              value={raw.duration ? DURATION_LABELS[raw.duration] : null}
            />
            <Row label="開始希望" value={raw.startDate} />
            <Row
              label="運用希望"
              value={raw.needsOperate === undefined ? null : raw.needsOperate ? "あり" : "なし"}
            />
          </dl>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-forge-muted">{label}</dt>
      <dd className="font-medium text-right">{value || "-"}</dd>
    </div>
  );
}
