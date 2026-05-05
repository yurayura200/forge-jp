import { createServerClient } from "@/lib/supabase/server";
import { formatJPY } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function FinancePage() {
  const supabase = await createServerClient();

  const [projectsRes, subscriptionsRes] = await Promise.all([
    supabase.from("projects").select("client_revenue, engineer_payout, margin_amount, status"),
    supabase
      .from("subscriptions")
      .select("monthly_amount, engineer_payout, margin, status"),
  ]);

  const projects = projectsRes.data || [];
  const subs = subscriptionsRes.data || [];

  const buildRevenue = projects
    .filter((p) => p.status === "completed" || p.status === "in_progress")
    .reduce((s, p) => s + (p.client_revenue || 0), 0);

  const buildMargin = projects
    .filter((p) => p.status === "completed" || p.status === "in_progress")
    .reduce((s, p) => s + (p.margin_amount || 0), 0);

  const operateMRR = subs
    .filter((s) => s.status === "active")
    .reduce((sum, s) => sum + (s.monthly_amount || 0), 0);

  const operateMargin = subs
    .filter((s) => s.status === "active")
    .reduce((sum, s) => sum + (s.margin || 0), 0);

  const arr = operateMRR * 12;

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-1">財務サマリー</h1>
      <p className="text-sm text-forge-muted mb-8">Build / Operate を分けた損益概況</p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-forge-border bg-white p-6">
          <p className="text-xs font-medium text-forge-muted">Build売上累計</p>
          <p className="mt-2 text-3xl font-bold">{formatJPY(buildRevenue)}</p>
          <p className="mt-1 text-xs text-forge-muted">
            うちマージン: {formatJPY(buildMargin)}
          </p>
        </div>
        <div className="rounded-lg border-2 border-forge-ember bg-white p-6">
          <p className="text-xs font-medium text-forge-ember">Operate MRR</p>
          <p className="mt-2 text-3xl font-bold text-forge-ember">{formatJPY(operateMRR)}</p>
          <p className="mt-1 text-xs text-forge-muted">
            うちマージン: {formatJPY(operateMargin)} / ARR: {formatJPY(arr)}
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-lg border border-dashed border-forge-border bg-white p-10 text-center">
        <p className="text-sm text-forge-muted">
          月次推移グラフ・コホート分析・エンジニア別支払一覧は Phase 2 で実装予定。
          Phase 1 はこのKPIサマリーのみ。
        </p>
      </div>
    </div>
  );
}
