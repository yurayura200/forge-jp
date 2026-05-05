import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUS_LABEL: Record<string, string> = {
  pending: "審査中",
  active: "アクティブ",
  paused: "停止中",
  banned: "BAN",
};

export default async function EngineersPage() {
  const supabase = await createServerClient();
  const { data: rows } = await supabase
    .from("engineers")
    .select("id, display_name, github_username, status, ai_specialties, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">エンジニア</h1>
        <p className="text-sm text-forge-muted mt-1">最新200件を表示</p>
      </div>

      <div className="rounded-lg border border-forge-border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-forge-surface">
            <tr className="text-left text-xs text-forge-muted">
              <th className="px-4 py-3 font-medium">登録日</th>
              <th className="px-4 py-3 font-medium">名前</th>
              <th className="px-4 py-3 font-medium">GitHub</th>
              <th className="px-4 py-3 font-medium">専門領域</th>
              <th className="px-4 py-3 font-medium">ステータス</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forge-border">
            {(rows || []).map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-forge-muted">
                  {formatDate(row.created_at)}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/engineers/${row.id}`}
                    className="font-medium hover:text-forge-ember"
                  >
                    {row.display_name}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <a
                    href={`https://github.com/${row.github_username}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-forge-muted hover:text-forge-black"
                  >
                    @{row.github_username}
                  </a>
                </td>
                <td className="px-4 py-3 text-xs text-forge-muted">
                  {(row.ai_specialties || []).slice(0, 3).join(", ")}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      row.status === "active"
                        ? "text-xs font-medium text-emerald-700"
                        : row.status === "pending"
                          ? "text-xs font-medium text-forge-ember"
                          : "text-xs text-forge-muted"
                    }
                  >
                    {STATUS_LABEL[row.status] || row.status}
                  </span>
                </td>
              </tr>
            ))}
            {(rows || []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-forge-muted">
                  登録エンジニアはまだいません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
