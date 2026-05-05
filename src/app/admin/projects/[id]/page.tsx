import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { formatJPY, formatDate } from "@/lib/utils";
import { calculateMatchScore } from "@/lib/matching";

export const dynamic = "force-dynamic";

type Params = { id: string };

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const supabase = await createServerClient();

  const { data: project } = await supabase
    .from("projects")
    .select("*, companies(company_name, industry)")
    .eq("id", id)
    .maybeSingle();

  if (!project) notFound();

  // Find candidate engineers
  const { data: engineers } = await supabase
    .from("engineers")
    .select(
      "id, display_name, github_username, skills, ai_specialties, monthly_rate_min, monthly_rate_max, available_from, past_industries, accept_operate"
    )
    .eq("status", "active");

  const company = Array.isArray(project.companies)
    ? project.companies[0]
    : (project.companies as { company_name?: string; industry?: string } | null);

  const ranked = (engineers || [])
    .map((eng) => ({
      eng,
      score: calculateMatchScore(
        {
          required_skills: project.required_skills || [],
          project_type: project.project_type,
          budget_range: project.budget_range,
          start_date: project.start_date,
          has_operate: project.has_operate,
          industry: company?.industry || null,
        },
        eng
      ),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return (
    <div>
      <Link href="/admin/projects" className="text-sm text-forge-muted hover:text-forge-black">
        ← 一覧に戻る
      </Link>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">{project.title}</h1>
      <p className="text-sm text-forge-muted mt-1">{company?.company_name || "-"}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-lg border border-forge-border bg-white p-6">
          <h2 className="font-semibold mb-3">概要</h2>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{project.description}</p>
          <h3 className="font-semibold mt-6 mb-3">納品物</h3>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{project.deliverables}</p>
        </div>

        <div className="rounded-lg border border-forge-border bg-white p-6">
          <h2 className="font-semibold mb-4">条件</h2>
          <dl className="space-y-3 text-sm">
            <Row label="ステータス" value={project.status} />
            <Row label="フェーズ" value={project.current_phase} />
            <Row label="案件タイプ" value={project.project_type} />
            <Row label="予算" value={project.budget_range} />
            <Row label="期間" value={project.duration} />
            <Row
              label="開始日"
              value={project.start_date ? formatDate(project.start_date) : "-"}
            />
            <Row
              label="運用希望"
              value={project.has_operate ? "あり" : "なし"}
            />
            <Row
              label="クライアント売上"
              value={project.client_revenue ? formatJPY(project.client_revenue) : "-"}
            />
            <Row
              label="エンジニア支払"
              value={project.engineer_payout ? formatJPY(project.engineer_payout) : "-"}
            />
            <Row
              label="マージン"
              value={project.margin_amount ? formatJPY(project.margin_amount) : "-"}
            />
          </dl>
          {project.required_skills && project.required_skills.length > 0 && (
            <>
              <h3 className="font-semibold mt-6 mb-3">必要スキル</h3>
              <div className="flex flex-wrap gap-1">
                {project.required_skills.map((s: string) => (
                  <span
                    key={s}
                    className="text-xs bg-forge-surface border border-forge-border rounded px-2 py-0.5"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">マッチング候補</h2>
        <div className="rounded-lg border border-forge-border bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-forge-surface">
              <tr className="text-left text-xs text-forge-muted">
                <th className="px-4 py-3 font-medium">スコア</th>
                <th className="px-4 py-3 font-medium">エンジニア</th>
                <th className="px-4 py-3 font-medium">スキル</th>
                <th className="px-4 py-3 font-medium">単価/月</th>
                <th className="px-4 py-3 font-medium">運用OK</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-forge-border">
              {ranked.map(({ eng, score }) => (
                <tr key={eng.id}>
                  <td className="px-4 py-3 font-bold text-forge-ember">{score}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/engineers/${eng.id}`}
                      className="font-medium hover:text-forge-ember"
                    >
                      {eng.display_name}
                    </Link>
                    <span className="ml-2 text-xs text-forge-muted">@{eng.github_username}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-forge-muted">
                    {(eng.skills || []).slice(0, 4).join(", ")}
                    {(eng.skills || []).length > 4 && ` +${(eng.skills || []).length - 4}`}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {eng.monthly_rate_min && eng.monthly_rate_max
                      ? `${formatJPY(eng.monthly_rate_min)}〜${formatJPY(eng.monthly_rate_max)}`
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-xs">{eng.accept_operate ? "✓" : "-"}</td>
                </tr>
              ))}
              {ranked.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-sm text-forge-muted">
                    候補がいません。エンジニアの登録・審査状況を確認してください。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-forge-muted">{label}</dt>
      <dd className="font-medium text-right">{value || "-"}</dd>
    </div>
  );
}
