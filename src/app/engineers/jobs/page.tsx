import Link from "next/link";
import { redirect } from "next/navigation";
import { Briefcase, ArrowRight, Calendar, Coins, Clock, Hammer, Activity } from "lucide-react";
import { createServerClient, createServiceRoleClient } from "@/lib/supabase/server";

export const metadata = {
  title: "案件一覧 — Forge Engineers",
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

const PHASE_ICON: Record<string, typeof Hammer> = {
  build: Hammer,
  eval: Activity,
  operate: Activity,
};

export default async function EngineerJobsPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/engineers/apply");
  }

  // 登録済みエンジニアか確認
  const { data: engineer } = await supabase
    .from("engineers")
    .select("id, status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!engineer) {
    redirect("/engineers/apply");
  }

  // 公開案件 = qualified（Yura 承認済み） or matching（応募受付中）
  const adminSb = createServiceRoleClient();
  const { data: projects } = await adminSb
    .from("projects")
    .select(
      `
      id, title, description, project_type, required_skills, budget_range, duration,
      start_date, current_phase, has_operate, status, created_at,
      companies(company_name, industry)
    `
    )
    .in("status", ["qualified", "matching"])
    .order("created_at", { ascending: false })
    .limit(50);

  const list = projects || [];

  return (
    <section className="bg-forge-surface min-h-screen">
      <div className="container py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-forge-ember">Jobs</p>
              <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
                公開案件
              </h1>
              <p className="mt-2 text-sm text-forge-muted">
                Forge が受注した AI 実装案件。気になる案件があれば応募できます。
              </p>
            </div>
            <Link
              href="/engineers/subscribe"
              className="hidden md:inline-flex text-sm text-forge-ember hover:underline"
            >
              ⭐ Premium で優先応募 →
            </Link>
          </div>

          {list.length === 0 ? (
            <div className="mt-10 rounded-xl border border-forge-border bg-white p-10 text-center">
              <Briefcase className="mx-auto h-10 w-10 text-forge-muted" />
              <p className="mt-4 text-base font-medium">現在公開中の案件はありません</p>
              <p className="mt-2 text-sm text-forge-muted">
                新着案件は登録メールアドレスへ通知します。
                <br />
                Premium プランなら即時通知 + 直接 DM 送信権が付きます。
              </p>
            </div>
          ) : (
            <div className="mt-10 space-y-4">
              {list.map((p) => {
                const company = Array.isArray(p.companies)
                  ? p.companies[0]
                  : p.companies;
                const PhaseIcon = PHASE_ICON[p.current_phase] || Briefcase;
                return (
                  <article
                    key={p.id}
                    className="rounded-xl border border-forge-border bg-white p-6 transition hover:border-forge-ember/40 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="rounded bg-forge-ember/10 px-2 py-0.5 font-medium text-forge-ember">
                            {PROJECT_TYPE_LABELS[p.project_type] || p.project_type}
                          </span>
                          {p.has_operate && (
                            <span className="rounded bg-emerald-50 px-2 py-0.5 text-emerald-700">
                              Operate あり
                            </span>
                          )}
                          {p.status === "matching" && (
                            <span className="rounded bg-orange-50 px-2 py-0.5 text-orange-700 animate-pulse">
                              応募受付中
                            </span>
                          )}
                        </div>
                        <h2 className="mt-3 text-lg md:text-xl font-bold tracking-tight">
                          {p.title}
                        </h2>
                        <p className="mt-1 text-xs text-forge-muted">
                          {company?.company_name || "—"} · 投稿{" "}
                          {new Date(p.created_at).toLocaleDateString("ja-JP")}
                        </p>
                        <p className="mt-3 text-sm text-forge-muted leading-relaxed line-clamp-3">
                          {p.description}
                        </p>

                        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-forge-muted">
                          <span className="inline-flex items-center gap-1.5">
                            <Coins className="h-3.5 w-3.5 text-forge-ember" />
                            {BUDGET_LABELS[p.budget_range] || p.budget_range}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5 text-forge-ember" />
                            {DURATION_LABELS[p.duration] || p.duration}
                          </span>
                          {p.start_date && (
                            <span className="inline-flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5 text-forge-ember" />
                              開始 {p.start_date}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1.5">
                            <PhaseIcon className="h-3.5 w-3.5 text-forge-ember" />
                            {p.current_phase}
                          </span>
                        </div>

                        {p.required_skills && p.required_skills.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {p.required_skills.slice(0, 6).map((s: string) => (
                              <span
                                key={s}
                                className="rounded border border-forge-border bg-forge-surface px-2 py-0.5 text-xs"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <Link
                        href={`/engineers/jobs/${p.id}`}
                        className="shrink-0 inline-flex items-center gap-1.5 rounded-md bg-forge-black px-4 py-2 text-sm font-medium text-white hover:bg-forge-ember transition"
                      >
                        詳細
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
