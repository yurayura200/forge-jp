import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import { formatJPY, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Params = { id: string };

export default async function EngineerDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const supabase = await createServerClient();
  const { data: eng } = await supabase
    .from("engineers")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!eng) notFound();

  return (
    <div>
      <Link
        href="/admin/engineers"
        className="text-sm text-forge-muted hover:text-forge-black"
      >
        ← 一覧に戻る
      </Link>

      <div className="mt-6 flex items-start gap-4">
        {eng.avatar_url ? (
          <Image
            src={eng.avatar_url}
            alt={eng.display_name}
            width={64}
            height={64}
            className="rounded-full"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-forge-surface" />
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{eng.display_name}</h1>
          <a
            href={`https://github.com/${eng.github_username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-forge-muted hover:text-forge-black"
          >
            @{eng.github_username}
          </a>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {eng.bio && (
            <div className="rounded-lg border border-forge-border bg-white p-6">
              <h2 className="font-semibold mb-3">自己紹介</h2>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{eng.bio}</p>
            </div>
          )}

          <div className="rounded-lg border border-forge-border bg-white p-6">
            <h2 className="font-semibold mb-3">スキル</h2>
            <div className="flex flex-wrap gap-1">
              {(eng.skills || []).map((s: string) => (
                <span
                  key={s}
                  className="text-xs bg-forge-surface border border-forge-border rounded px-2 py-1"
                >
                  {s}
                </span>
              ))}
            </div>
            <h2 className="font-semibold mt-6 mb-3">AI特化領域</h2>
            <div className="flex flex-wrap gap-1">
              {(eng.ai_specialties || []).map((s: string) => (
                <span
                  key={s}
                  className="text-xs bg-forge-ember/10 text-forge-ember border border-forge-ember/30 rounded px-2 py-1"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {eng.past_projects && Array.isArray(eng.past_projects) && eng.past_projects.length > 0 && (
            <div className="rounded-lg border border-forge-border bg-white p-6">
              <h2 className="font-semibold mb-3">過去プロジェクト</h2>
              <ul className="space-y-4">
                {(eng.past_projects as Array<{ title: string; description?: string; url?: string }>).map(
                  (p, i) => (
                    <li key={i} className="border-l-2 border-forge-border pl-3">
                      <p className="font-medium text-sm">{p.title}</p>
                      {p.description && (
                        <p className="text-xs text-forge-muted mt-1 leading-relaxed">
                          {p.description}
                        </p>
                      )}
                      {p.url && (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-forge-ember hover:underline"
                        >
                          {p.url}
                        </a>
                      )}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>

        <div className="rounded-lg border border-forge-border bg-white p-6 h-fit">
          <h2 className="font-semibold mb-4">プロフィール</h2>
          <dl className="space-y-3 text-sm">
            <Row label="ステータス" value={eng.status} />
            <Row label="メール" value={eng.email} />
            <Row
              label="月額単価"
              value={
                eng.monthly_rate_min && eng.monthly_rate_max
                  ? `${formatJPY(eng.monthly_rate_min)}〜${formatJPY(eng.monthly_rate_max)}`
                  : "-"
              }
            />
            <Row label="週稼働" value={eng.available_hours_per_week ? `${eng.available_hours_per_week}時間` : "-"} />
            <Row
              label="開始可能"
              value={eng.available_from ? formatDate(eng.available_from) : "-"}
            />
            <Row label="運用OK" value={eng.accept_operate ? "はい" : "いいえ"} />
          </dl>
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
