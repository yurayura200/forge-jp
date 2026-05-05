import Link from "next/link";
import { createServerClient } from "@/lib/supabase/server";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function InquiriesPage() {
  const supabase = await createServerClient();
  const { data: rows } = await supabase
    .from("inquiries")
    .select("id, company_name, contact_name, contact_email, processed, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">問い合わせ</h1>
          <p className="text-sm text-forge-muted mt-1">最新100件を表示</p>
        </div>
      </div>

      <div className="rounded-lg border border-forge-border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-forge-surface">
            <tr className="text-left text-xs text-forge-muted">
              <th className="px-4 py-3 font-medium">受信日時</th>
              <th className="px-4 py-3 font-medium">会社</th>
              <th className="px-4 py-3 font-medium">担当者</th>
              <th className="px-4 py-3 font-medium">メール</th>
              <th className="px-4 py-3 font-medium">状態</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forge-border">
            {(rows || []).map((row) => (
              <tr key={row.id} className={row.processed ? "" : "bg-amber-50/50"}>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-forge-muted">
                  {formatDateTime(row.created_at)}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/inquiries/${row.id}`}
                    className="font-medium hover:text-forge-ember"
                  >
                    {row.company_name || "-"}
                  </Link>
                </td>
                <td className="px-4 py-3">{row.contact_name || "-"}</td>
                <td className="px-4 py-3 text-forge-muted">{row.contact_email || "-"}</td>
                <td className="px-4 py-3">
                  {row.processed ? (
                    <span className="text-xs text-forge-muted">処理済み</span>
                  ) : (
                    <span className="text-xs font-medium text-forge-ember">未処理</span>
                  )}
                </td>
              </tr>
            ))}
            {(rows || []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-forge-muted">
                  問い合わせはまだありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
