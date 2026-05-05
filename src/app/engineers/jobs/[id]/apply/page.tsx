import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createServerClient, createServiceRoleClient } from "@/lib/supabase/server";
import { ApplyForm } from "./_components/ApplyForm";

export const metadata = {
  title: "案件に応募 — Forge Engineers",
  robots: { index: false, follow: false },
};

const BUDGET_LABELS: Record<string, string> = {
  under_500k: "〜50万円",
  "500k_1m": "50万〜100万円",
  "1m_3m": "100万〜300万円",
  "3m_5m": "300万〜500万円",
  "5m_10m": "500万〜1000万円",
  over_10m: "1000万円〜",
};

export default async function JobApplyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/engineers/apply");

  const { data: engineer } = await supabase
    .from("engineers")
    .select("id, status, display_name")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!engineer) redirect("/engineers/apply");

  const adminSb = createServiceRoleClient();
  const { data: project } = await adminSb
    .from("projects")
    .select(
      `id, title, project_type, budget_range, duration, current_phase, status,
       companies(company_name)`
    )
    .eq("id", id)
    .in("status", ["qualified", "matching"])
    .maybeSingle();

  if (!project) notFound();

  // 既に応募済みか確認
  const { data: existing } = await adminSb
    .from("assignments")
    .select("id, status, cover_letter, proposed_payout, proposed_at")
    .eq("project_id", id)
    .eq("engineer_id", engineer.id)
    .eq("phase", project.current_phase)
    .maybeSingle();

  const company = Array.isArray(project.companies)
    ? project.companies[0]
    : project.companies;

  return (
    <section className="bg-forge-surface min-h-screen">
      <div className="container py-12 md:py-16">
        <div className="max-w-2xl mx-auto">
          <Link
            href={`/engineers/jobs/${id}`}
            className="inline-flex items-center gap-1.5 text-sm text-forge-muted hover:text-forge-black transition"
          >
            <ArrowLeft className="h-4 w-4" />
            案件詳細へ戻る
          </Link>

          <div className="mt-6 rounded-xl border border-forge-border bg-white p-6 md:p-10">
            <p className="text-xs font-medium text-forge-ember">Apply</p>
            <h1 className="mt-2 text-2xl md:text-3xl font-bold tracking-tight">
              この案件に応募する
            </h1>
            <p className="mt-2 text-sm text-forge-muted">
              <strong>{project.title}</strong>
              {company?.company_name && ` · ${company.company_name}`}
            </p>
            <p className="mt-1 text-xs text-forge-muted">
              予算：{BUDGET_LABELS[project.budget_range] || project.budget_range}
            </p>

            <div className="mt-8">
              {existing ? (
                <div className="rounded-lg border border-forge-border bg-forge-surface p-5">
                  <p className="text-sm font-medium">
                    既に応募済み（ステータス：
                    <span className="text-forge-ember">{existing.status}</span>）
                  </p>
                  <p className="mt-2 text-xs text-forge-muted">
                    応募日：{new Date(existing.proposed_at).toLocaleString("ja-JP")}
                  </p>
                  {existing.proposed_payout && (
                    <p className="mt-1 text-xs text-forge-muted tabular-nums">
                      希望報酬：¥{existing.proposed_payout.toLocaleString()}
                    </p>
                  )}
                  {existing.cover_letter && (
                    <p className="mt-3 whitespace-pre-wrap text-sm text-forge-muted leading-relaxed">
                      {existing.cover_letter}
                    </p>
                  )}
                </div>
              ) : (
                <ApplyForm
                  projectId={id}
                  phase={project.current_phase}
                  engineerName={engineer.display_name}
                />
              )}
            </div>
          </div>

          <p className="mt-6 text-xs text-forge-muted text-center">
            ※ 応募内容は Forge 運営にのみ共有されます。企業へは Yura が要件と
            ご経験の合致を確認した上でご紹介します。
          </p>
        </div>
      </div>
    </section>
  );
}
