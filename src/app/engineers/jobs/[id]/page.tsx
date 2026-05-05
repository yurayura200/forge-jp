import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, Briefcase, Calendar, Coins, Clock, Mail } from "lucide-react";
import { createServerClient, createServiceRoleClient } from "@/lib/supabase/server";

export const metadata = {
  title: "案件詳細 — Forge Engineers",
  robots: { index: false, follow: false },
};

const PROJECT_TYPE_LABELS: Record<string, string> = {
  llm_app: "LLM活用アプリ",
  rag: "RAG構築",
  agent: "AIエージェント",
  automation: "業務自動化",
  integration: "AI連携",
  consulting: "コンサル",
  other: "その他",
};

const BUDGET_LABELS: Record<string, string> = {
  under_500k: "〜50万円",
  "500k_1m": "50万〜100万円",
  "1m_3m": "100万〜300万円",
  "3m_5m": "300万〜500万円",
  "5m_10m": "500万〜1000万円",
  over_10m: "1000万円〜",
};

const DURATION_LABELS: Record<string, string> = {
  spot: "スポット",
  under_1m: "1ヶ月以内",
  "1m_3m": "1〜3ヶ月",
  "3m_6m": "3〜6ヶ月",
  over_6m: "6ヶ月以上",
};

export default async function JobDetailPage({
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
    .select("id, status")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!engineer) redirect("/engineers/apply");

  const adminSb = createServiceRoleClient();
  const { data: project } = await adminSb
    .from("projects")
    .select(
      `
      id, title, description, project_type, required_skills, budget_range, duration,
      start_date, current_phase, has_operate, deliverables, status, created_at,
      companies(company_name, industry)
    `
    )
    .eq("id", id)
    .in("status", ["qualified", "matching"])
    .maybeSingle();

  if (!project) notFound();

  const company = Array.isArray(project.companies)
    ? project.companies[0]
    : project.companies;

  return (
    <section className="bg-forge-surface min-h-screen">
      <div className="container py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/engineers/jobs"
            className="inline-flex items-center gap-1.5 text-sm text-forge-muted hover:text-forge-black transition"
          >
            <ArrowLeft className="h-4 w-4" />
            案件一覧へ戻る
          </Link>

          <div className="mt-6 rounded-xl border border-forge-border bg-white p-6 md:p-10">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded bg-forge-ember/10 px-2 py-0.5 font-medium text-forge-ember">
                {PROJECT_TYPE_LABELS[project.project_type] || project.project_type}
              </span>
              {project.has_operate && (
                <span className="rounded bg-emerald-50 px-2 py-0.5 text-emerald-700">
                  Operate（運用）あり
                </span>
              )}
              {project.status === "matching" && (
                <span className="rounded bg-orange-50 px-2 py-0.5 text-orange-700 animate-pulse">
                  応募受付中
                </span>
              )}
            </div>
            <h1 className="mt-4 text-2xl md:text-3xl font-bold tracking-tight">
              {project.title}
            </h1>
            <p className="mt-2 text-sm text-forge-muted">
              {company?.company_name || "—"} · 投稿{" "}
              {new Date(project.created_at).toLocaleDateString("ja-JP")}
            </p>

            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-forge-border p-4">
                <dt className="flex items-center gap-2 text-xs font-medium text-forge-muted">
                  <Coins className="h-3.5 w-3.5 text-forge-ember" />
                  予算
                </dt>
                <dd className="mt-2 text-lg font-bold tabular-nums">
                  {BUDGET_LABELS[project.budget_range] || project.budget_range}
                </dd>
              </div>
              <div className="rounded-lg border border-forge-border p-4">
                <dt className="flex items-center gap-2 text-xs font-medium text-forge-muted">
                  <Clock className="h-3.5 w-3.5 text-forge-ember" />
                  期間
                </dt>
                <dd className="mt-2 text-lg font-bold">
                  {DURATION_LABELS[project.duration] || project.duration}
                </dd>
              </div>
              <div className="rounded-lg border border-forge-border p-4">
                <dt className="flex items-center gap-2 text-xs font-medium text-forge-muted">
                  <Calendar className="h-3.5 w-3.5 text-forge-ember" />
                  希望開始
                </dt>
                <dd className="mt-2 text-lg font-bold">
                  {project.start_date || "—"}
                </dd>
              </div>
              <div className="rounded-lg border border-forge-border p-4">
                <dt className="flex items-center gap-2 text-xs font-medium text-forge-muted">
                  <Briefcase className="h-3.5 w-3.5 text-forge-ember" />
                  フェーズ
                </dt>
                <dd className="mt-2 text-lg font-bold">{project.current_phase}</dd>
              </div>
            </dl>

            <div className="mt-8">
              <h2 className="text-base font-bold">プロジェクト概要</h2>
              <p className="mt-3 whitespace-pre-wrap text-sm text-forge-muted leading-relaxed">
                {project.description}
              </p>
            </div>

            {project.deliverables && (
              <div className="mt-8">
                <h2 className="text-base font-bold">納品物 / 成果物</h2>
                <p className="mt-3 whitespace-pre-wrap text-sm text-forge-muted leading-relaxed">
                  {project.deliverables}
                </p>
              </div>
            )}

            {project.required_skills && project.required_skills.length > 0 && (
              <div className="mt-8">
                <h2 className="text-base font-bold">求められるスキル</h2>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.required_skills.map((s: string) => (
                    <span
                      key={s}
                      className="rounded-full border border-forge-border bg-forge-surface px-3 py-1 text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 rounded-xl border-2 border-forge-ember bg-gradient-to-br from-orange-50 to-white p-6 md:p-8">
            <p className="text-sm font-bold flex items-center gap-2">
              <Mail className="h-4 w-4 text-forge-ember" />
              この案件に応募する
            </p>
            <p className="mt-2 text-sm text-forge-muted">
              応募意思のあるエンジニアは下記からご連絡ください。Forge 運営が要件と
              ご経験の合致を確認し、企業との直接面談をセッティングします。
            </p>
            <a
              href={`mailto:info@komugi-ai.jp?subject=${encodeURIComponent(`【応募】${project.title}（案件 ID: ${project.id.slice(0, 8)}）`)}&body=${encodeURIComponent("お世話になっております。\n\n標題の案件に応募させていただきます。\n\n■ 自己紹介\n（簡単な経歴）\n\n■ 関連実績\n（GitHub URL / 過去案件）\n\n■ 稼働可能時間\n\n■ ご質問\n\n以上、よろしくお願いいたします。")}`}
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-forge-ember px-6 py-3 font-medium text-white hover:bg-forge-black transition"
            >
              応募メールを送る
              <ArrowLeft className="h-4 w-4 rotate-180" />
            </a>
            <p className="mt-3 text-xs text-forge-muted">
              ※ Premium プラン（¥3,000/月）なら、企業へ直接 DM 送信権が付きます。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
