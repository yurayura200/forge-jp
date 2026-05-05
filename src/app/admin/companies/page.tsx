import { createServerClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/utils";
import { INDUSTRY_LABELS } from "@/lib/industries";

export const dynamic = "force-dynamic";

export default async function CompaniesPage() {
  const supabase = await createServerClient();
  const { data: rows } = await supabase
    .from("companies")
    .select("id, company_name, contact_name, contact_email, industry, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight mb-6">クライアント企業</h1>

      <div className="rounded-lg border border-forge-border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-forge-surface">
            <tr className="text-left text-xs text-forge-muted">
              <th className="px-4 py-3 font-medium">登録日</th>
              <th className="px-4 py-3 font-medium">会社</th>
              <th className="px-4 py-3 font-medium">担当者</th>
              <th className="px-4 py-3 font-medium">メール</th>
              <th className="px-4 py-3 font-medium">業界</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-forge-border">
            {(rows || []).map((row) => (
              <tr key={row.id}>
                <td className="px-4 py-3 whitespace-nowrap text-xs text-forge-muted">
                  {formatDate(row.created_at)}
                </td>
                <td className="px-4 py-3 font-medium">{row.company_name}</td>
                <td className="px-4 py-3">{row.contact_name}</td>
                <td className="px-4 py-3 text-forge-muted text-xs">{row.contact_email}</td>
                <td className="px-4 py-3 text-xs">
                  {row.industry ? INDUSTRY_LABELS[row.industry as keyof typeof INDUSTRY_LABELS] || row.industry : "-"}
                </td>
              </tr>
            ))}
            {(rows || []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-forge-muted">
                  まだクライアント企業はありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
