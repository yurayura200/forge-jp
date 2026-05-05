import { createServerClient } from "@/lib/supabase/server";
import { formatJPY, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  trial: "トライアル",
  active: "稼働中",
  paused: "一時停止",
  cancelled: "解約",
};

export default async function SubscriptionsPage() {
  const supabase = await createServerClient();
  const { data: rows } = await supabase
    .from("subscriptions")
    .select(
      "id, status, monthly_amount, engineer_payout, margin, start_date, end_date, projects(title), companies(company_name)"
    )
    .order("created_at", { ascending: false })
    .limit(200);

  const totalMRR = (rows || [])
    .filter((r) => r.status === "active")
    .reduce((sum, r) => sum + (r.monthly_amount || 0), 0);
  const totalMargin = (rows || [])
    .filter((r) => r.status === "active")
    .reduce((sum, r) => sum + (r.margin || 0), 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Operate契約</h1>
        <p className="text-sm text-forge-muted mt-1">月次売上の継続収入</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-8">
        <div className="rounded-lg border border-forge-border bg-white p-6">
          <p className="text-xs font-medium text-forge-muted">月次売上合計（アクティブ契約）</p>
          <p className="mt-2 text-3xl font-bold text-forge-ember">{formatJPY(totalMRR)}</p>
        </div>
        <div className="rounded-lg border border-forge-border bg-white p-6">
          <p className="text-xs font-medium text-forge-muted">月次マージン合計</p>
          <p className="mt-2 text-3xl font-bold">{formatJPY(totalMargin)}</p>
        </div>
      </div>

      <div className="rounded-lg border border-forge-border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-forge-surface">
            <tr className="text-left text-xs text-forge-muted">
              <th className="px-4 py-3 font-medium">案件</th>
              <th className="px-4 py-3 font-medium">クライアント</th>
              <th className="px-4 py-3 font-medium">ステータス</th>
              <th className="px-4 py-3 font-medium">開始</th>
              <th className="px-4 py-3 font-medium text-right">月額</th>
              <th className="px-4 py-3 font-medium text-right">マージン</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forge-border">
            {(rows || []).map((row) => {
              const project = Array.isArray(row.projects)
                ? row.projects[0]
                : (row.projects as { title?: string } | null);
              const company = Array.isArray(row.companies)
                ? row.companies[0]
                : (row.companies as { company_name?: string } | null);
              return (
                <tr key={row.id}>
                  <td className="px-4 py-3 font-medium">{project?.title || "-"}</td>
                  <td className="px-4 py-3">{company?.company_name || "-"}</td>
                  <td className="px-4 py-3 text-xs">{STATUS_LABEL[row.status] || row.status}</td>
                  <td className="px-4 py-3 text-xs text-forge-muted">{formatDate(row.start_date)}</td>
                  <td className="px-4 py-3 text-right">{formatJPY(row.monthly_amount)}</td>
                  <td className="px-4 py-3 text-right text-forge-ember">
                    {row.margin ? formatJPY(row.margin) : "-"}
                  </td>
                </tr>
              );
            })}
            {(rows || []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-forge-muted">
                  Operate契約はまだありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
