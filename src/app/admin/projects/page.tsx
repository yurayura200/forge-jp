import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { formatJPY, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_LABELS: Record<string, string> = {
  inquiry: "問い合わせ",
  qualified: "適格化済み",
  matching: "マッチング中",
  in_progress: "進行中",
  completed: "完了",
  cancelled: "中止",
};

const PHASE_LABELS: Record<string, string> = {
  build: "Build",
  eval: "Eval",
  operate: "Operate",
};

export default async function ProjectsPage() {
  const supabase = await createServerClient();
  const { data: rows } = await supabase
    .from("projects")
    .select("id, title, status, current_phase, client_revenue, created_at, companies(company_name)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">案件</h1>
          <p className="text-sm text-forge-muted mt-1">最新100件を表示</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-md bg-forge-black px-4 py-2 text-white text-sm font-medium hover:bg-forge-ember transition"
        >
          新規作成
        </Link>
      </div>

      <div className="rounded-lg border border-forge-border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-forge-surface">
            <tr className="text-left text-xs text-forge-muted">
              <th className="px-4 py-3 font-medium">作成日</th>
              <th className="px-4 py-3 font-medium">タイトル</th>
              <th className="px-4 py-3 font-medium">クライアント</th>
              <th className="px-4 py-3 font-medium">フェーズ</th>
              <th className="px-4 py-3 font-medium">ステータス</th>
              <th className="px-4 py-3 font-medium text-right">売上</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forge-border">
            {(rows || []).map((row) => {
              const company = Array.isArray(row.companies)
                ? row.companies[0]?.company_name
                : (row.companies as { company_name?: string } | null)?.company_name;
              return (
                <tr key={row.id}>
                  <td className="px-4 py-3 whitespace-nowrap text-xs text-forge-muted">
                    {formatDate(row.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/projects/${row.id}`}
                      className="font-medium hover:text-forge-ember"
                    >
                      {row.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{company || "-"}</td>
                  <td className="px-4 py-3">{PHASE_LABELS[row.current_phase] || row.current_phase}</td>
                  <td className="px-4 py-3">{STATUS_LABELS[row.status] || row.status}</td>
                  <td className="px-4 py-3 text-right">
                    {row.client_revenue ? formatJPY(row.client_revenue) : "-"}
                  </td>
                </tr>
              );
            })}
            {(rows || []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-forge-muted">
                  案件はまだありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
