import { createServerClient } from "@/lib/supabase/server";
import { formatJPY } from "@/lib/utils";
import { Inbox, Users, Briefcase, Repeat } from "lucide-react";

export const dynamic = "force-dynamic";

async function getStats() {
  const supabase = await createServerClient();

  const [pendingInquiries, activeEngineers, inProgressProjects, activeSubscriptions] =
    await Promise.all([
      supabase
        .from("inquiries")
        .select("id", { count: "exact", head: true })
        .eq("processed", false),
      supabase
        .from("engineers")
        .select("id", { count: "exact", head: true })
        .eq("status", "active"),
      supabase
        .from("projects")
        .select("id", { count: "exact", head: true })
        .eq("status", "in_progress"),
      supabase.from("subscriptions").select("monthly_amount").eq("status", "active"),
    ]);

  const mrr = (activeSubscriptions.data || []).reduce(
    (sum, s) => sum + (s.monthly_amount || 0),
    0
  );

  return {
    pendingInquiries: pendingInquiries.count ?? 0,
    activeEngineers: activeEngineers.count ?? 0,
    inProgressProjects: inProgressProjects.count ?? 0,
    activeSubscriptionsCount: activeSubscriptions.data?.length ?? 0,
    mrr,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "未処理の問い合わせ", value: stats.pendingInquiries, icon: Inbox, accent: true },
    { label: "アクティブエンジニア", value: stats.activeEngineers, icon: Users },
    { label: "進行中の案件", value: stats.inProgressProjects, icon: Briefcase },
    { label: "Operate契約数", value: stats.activeSubscriptionsCount, icon: Repeat },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-1">ダッシュボード</h1>
      <p className="text-sm text-forge-muted mb-8">主要KPIをひと目で確認</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`rounded-lg border bg-white p-6 ${
              c.accent && c.value > 0 ? "border-forge-ember" : "border-forge-border"
            }`}
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-forge-muted">{c.label}</p>
              <c.icon className="h-4 w-4 text-forge-muted" />
            </div>
            <p className="mt-3 text-3xl font-bold tracking-tight">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-forge-border bg-white p-6">
        <p className="text-xs font-medium text-forge-muted">月次経常収益（MRR）</p>
        <p className="mt-2 text-4xl font-bold tracking-tight text-forge-ember">
          {formatJPY(stats.mrr)}
        </p>
      </div>
    </div>
  );
}
