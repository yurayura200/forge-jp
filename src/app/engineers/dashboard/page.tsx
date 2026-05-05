import Link from "next/link";
import { redirect } from "next/navigation";
import { Briefcase, ArrowRight, Star, Clock } from "lucide-react";
import { createServerClient, createServiceRoleClient } from "@/lib/supabase/server";

export const metadata = {
  title: "ダッシュボード — Forge Engineers",
  robots: { index: false, follow: false },
};

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  proposed: { label: "審査中", cls: "bg-orange-50 text-orange-700" },
  accepted: { label: "採用", cls: "bg-emerald-50 text-emerald-700" },
  declined: { label: "不採用", cls: "bg-stone-100 text-stone-600" },
  in_progress: { label: "進行中", cls: "bg-blue-50 text-blue-700" },
  completed: { label: "完了", cls: "bg-stone-100 text-stone-600" },
};

export default async function EngineerDashboardPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/engineers/apply");

  const { data: engineer } = await supabase
    .from("engineers")
    .select("id, display_name, status, github_username")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!engineer) redirect("/engineers/apply");

  const adminSb = createServiceRoleClient();

  const [{ data: applications }, { data: premium }] = await Promise.all([
    adminSb
      .from("project_applications")
      .select("*")
      .eq("engineer_id", engineer.id)
      .order("proposed_at", { ascending: false })
      .limit(20),
    adminSb
      .from("engineer_premium_subscriptions")
      .select("status, current_period_end")
      .eq("engineer_id", engineer.id)
      .maybeSingle(),
  ]);

  const apps = applications || [];
  const isPremium = premium?.status === "active";

  return (
    <section className="bg-forge-surface min-h-screen">
      <div className="container py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-forge-ember">Engineer Dashboard</p>
              <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
                {engineer.display_name}
              </h1>
              <p className="mt-2 text-sm text-forge-muted">
                @{engineer.github_username} · 審査ステータス：
                <span className="font-medium ml-1">{engineer.status}</span>
                {isPremium && (
                  <span className="ml-3 inline-flex items-center gap-1 rounded bg-forge-ember/10 px-2 py-0.5 text-xs font-medium text-forge-ember">
                    <Star className="h-3 w-3" />
                    Premium
                  </span>
                )}
              </p>
            </div>
            <Link
              href="/engineers/jobs"
              className="hidden md:inline-flex items-center gap-2 rounded-md bg-forge-black px-4 py-2 text-sm font-medium text-white hover:bg-forge-ember transition"
            >
              案件一覧
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {!isPremium && (
            <div className="mt-6 rounded-xl border border-forge-ember/30 bg-orange-50/50 p-4 flex items-start gap-3">
              <Star className="h-5 w-5 shrink-0 text-forge-ember mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Premium プランで案件獲得を加速</p>
                <p className="mt-1 text-xs text-forge-muted">
                  月 ¥3,000 で新着案件即時通知 + 優先表示 + 直接 DM 権利。
                </p>
              </div>
              <Link
                href="/engineers/subscribe"
                className="shrink-0 inline-flex items-center gap-1 rounded-md bg-forge-ember px-3 py-1.5 text-xs font-medium text-white hover:bg-forge-black transition"
              >
                登録
              </Link>
            </div>
          )}

          <div className="mt-10">
            <h2 className="text-xl font-semibold">応募中の案件</h2>
            {apps.length === 0 ? (
              <div className="mt-4 rounded-xl border border-forge-border bg-white p-10 text-center">
                <Briefcase className="mx-auto h-10 w-10 text-forge-muted" />
                <p className="mt-4 text-sm text-forge-muted">
                  まだ応募中の案件はありません。
                </p>
                <Link
                  href="/engineers/jobs"
                  className="mt-5 inline-flex items-center gap-2 rounded-md bg-forge-black px-5 py-2.5 text-sm font-medium text-white hover:bg-forge-ember transition"
                >
                  案件を探す
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {apps.map((a) => {
                  const s = STATUS_LABELS[a.status] || {
                    label: a.status,
                    cls: "bg-stone-100 text-stone-600",
                  };
                  return (
                    <Link
                      key={a.assignment_id}
                      href={`/engineers/jobs/${a.project_id}`}
                      className="block rounded-xl border border-forge-border bg-white p-5 transition hover:border-forge-ember/40"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className={`rounded px-2 py-0.5 text-xs font-medium ${s.cls}`}
                            >
                              {s.label}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs text-forge-muted">
                              <Clock className="h-3 w-3" />
                              {new Date(a.proposed_at).toLocaleDateString("ja-JP")}
                            </span>
                          </div>
                          <p className="mt-2 font-bold">{a.project_title}</p>
                          <p className="mt-1 text-xs text-forge-muted tabular-nums">
                            希望 ¥
                            {(a.proposed_payout || 0).toLocaleString()}
                            {a.monthly_payout && a.monthly_payout !== a.proposed_payout && (
                              <span className="ml-2 text-forge-ember">
                                → 採用 ¥{a.monthly_payout.toLocaleString()}
                              </span>
                            )}
                          </p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-forge-muted shrink-0" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
