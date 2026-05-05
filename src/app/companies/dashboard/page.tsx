import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerClient, createServiceRoleClient } from "@/lib/supabase/server";
import { ApiKeySection } from "./_components/ApiKeySection";
import { ProviderKeySection } from "./_components/ProviderKeySection";
import { Activity, BarChart3, Key, AlertTriangle } from "lucide-react";

export const metadata = {
  title: "Dashboard — Forge API",
  robots: { index: false, follow: false },
};

export default async function CompanyDashboardPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/companies/login");
  }

  const adminSb = createServiceRoleClient();

  // 既存の api_customers を引く（webhook で email ベースで作成済みのはず）
  let { data: customer } = await adminSb
    .from("api_customers")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  // user_id 未紐付けなら email でマッチして紐付け
  if (!customer && user.email) {
    const { data: byEmail } = await adminSb
      .from("api_customers")
      .select("*")
      .eq("email", user.email)
      .maybeSingle();
    if (byEmail) {
      await adminSb
        .from("api_customers")
        .update({ user_id: user.id })
        .eq("id", byEmail.id);
      customer = { ...byEmail, user_id: user.id };
    }
  }

  // それでも無ければ free プランで作成
  if (!customer && user.email) {
    const { data: created } = await adminSb
      .from("api_customers")
      .insert({
        user_id: user.id,
        email: user.email,
        current_plan: "free",
      })
      .select("*")
      .single();
    customer = created;
  }

  if (!customer) {
    return (
      <div className="container py-24">
        <p className="text-forge-muted">アカウント情報の取得に失敗しました。</p>
      </div>
    );
  }

  const [{ data: plan }, { data: apiKeys }, { data: providerKeys }, { data: usage }] =
    await Promise.all([
      adminSb
        .from("api_plans")
        .select("display_name, monthly_jpy, monthly_request_quota")
        .eq("tier", customer.current_plan)
        .maybeSingle(),
      adminSb
        .from("api_keys")
        .select("id, key_prefix, display_name, status, last_used_at, created_at")
        .eq("customer_id", customer.id)
        .order("created_at", { ascending: false }),
      adminSb
        .from("customer_provider_keys")
        .select("id, provider, key_preview, display_name, created_at")
        .eq("customer_id", customer.id)
        .order("created_at", { ascending: false }),
      adminSb
        .from("api_usage_current_month")
        .select("total_calls, success_calls, input_tokens, output_tokens")
        .eq("customer_id", customer.id)
        .maybeSingle(),
    ]);

  const totalCalls = usage?.total_calls ?? 0;
  const quota = plan?.monthly_request_quota ?? 0;
  const usagePercent = quota > 0 ? Math.min(100, (totalCalls / quota) * 100) : 0;
  const overQuota = quota > 0 && totalCalls >= quota;

  return (
    <section className="bg-forge-surface min-h-screen">
      <div className="container py-12 md:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-forge-ember">Dashboard</p>
              <h1 className="mt-2 text-3xl md:text-4xl font-bold tracking-tight">
                {customer.company_name || customer.email}
              </h1>
              <p className="mt-2 text-sm text-forge-muted">
                現在のプラン：<strong>{plan?.display_name || customer.current_plan}</strong>
                （月 ¥{(plan?.monthly_jpy ?? 0).toLocaleString()}）
              </p>
            </div>
            <Link
              href="/api-access#pricing"
              className="text-sm text-forge-ember hover:underline"
            >
              プラン変更 →
            </Link>
          </div>

          {/* Usage */}
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-forge-border bg-white p-5">
              <div className="flex items-center gap-2 text-forge-muted text-xs">
                <Activity className="h-4 w-4" />
                今月の API call
              </div>
              <p className="mt-3 text-3xl font-bold tabular-nums">
                {totalCalls.toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-forge-muted tabular-nums">
                / {quota.toLocaleString()}
              </p>
              <div className="mt-3 h-2 rounded-full bg-forge-surface overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    overQuota ? "bg-red-500" : "bg-forge-ember"
                  }`}
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
            </div>
            <div className="rounded-xl border border-forge-border bg-white p-5">
              <div className="flex items-center gap-2 text-forge-muted text-xs">
                <BarChart3 className="h-4 w-4" />
                Token 消費
              </div>
              <p className="mt-3 text-3xl font-bold tabular-nums">
                {((usage?.input_tokens ?? 0) + (usage?.output_tokens ?? 0)).toLocaleString()}
              </p>
              <p className="mt-1 text-xs text-forge-muted">
                in: {(usage?.input_tokens ?? 0).toLocaleString()} / out: {(usage?.output_tokens ?? 0).toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-forge-border bg-white p-5">
              <div className="flex items-center gap-2 text-forge-muted text-xs">
                <Key className="h-4 w-4" />
                Active API Keys
              </div>
              <p className="mt-3 text-3xl font-bold tabular-nums">
                {(apiKeys || []).filter((k) => k.status === "active").length}
              </p>
            </div>
          </div>

          {overQuota && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-red-600" />
              <div className="text-sm">
                <p className="font-medium text-red-800">月間 quota を超過しています</p>
                <p className="mt-1 text-red-700">
                  追加リクエストは 429 で拒否されます。
                  <Link
                    href="/api-access#pricing"
                    className="underline font-medium ml-1"
                  >
                    プランをアップグレード
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* API keys */}
          <ApiKeySection
            customerId={customer.id}
            initialKeys={apiKeys || []}
          />

          {/* Provider keys */}
          <ProviderKeySection
            customerId={customer.id}
            initialKeys={providerKeys || []}
          />

          {/* Endpoint reference */}
          <div className="mt-10 rounded-xl border border-forge-border bg-white p-6">
            <p className="text-sm font-semibold">エンドポイント</p>
            <p className="mt-1 text-xs text-forge-muted">
              既存の Anthropic SDK の base_url をこちらに変更してください。
            </p>
            <code className="mt-3 block bg-forge-black text-white px-4 py-3 rounded text-sm">
              POST https://forge.komugi-ai.jp/api/v1/messages
            </code>
            <p className="mt-3 text-xs text-forge-muted">
              ヘッダー: <code>Authorization: Bearer forge_live_xxx</code>{" "}
              + <code>anthropic-version: 2023-06-01</code>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
