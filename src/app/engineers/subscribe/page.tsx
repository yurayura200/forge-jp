import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Star, Check, AlertTriangle } from "lucide-react";
import { createServerClient, createServiceRoleClient } from "@/lib/supabase/server";
import { SubscribeButton } from "./_components/SubscribeButton";

export const metadata = {
  title: "Premium 登録 — Forge Engineers",
  robots: { index: false, follow: false },
};

export default async function EngineerSubscribePage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/engineers/apply");
  }

  // 登録済みエンジニアか確認
  const { data: engineer } = await supabase
    .from("engineers")
    .select("id, display_name, status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!engineer) {
    redirect("/engineers/apply");
  }

  // 既に Premium か
  const adminSb = createServiceRoleClient();
  const { data: existingSub } = await adminSb
    .from("engineer_premium_subscriptions")
    .select("status, current_period_end, cancel_at_period_end")
    .eq("engineer_id", engineer.id)
    .maybeSingle();

  const isActive = existingSub?.status === "active";

  return (
    <section className="bg-forge-surface min-h-screen">
      <div className="container py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10 text-center">
            <Star className="mx-auto h-10 w-10 text-forge-ember" />
            <h1 className="mt-4 text-3xl md:text-4xl font-bold tracking-tight">
              Premium プラン
            </h1>
            <p className="mt-3 text-sm text-forge-muted">
              月 ¥3,000 で AI 案件を最速取得。
            </p>
          </div>

          {isActive ? (
            <div className="rounded-2xl border-2 border-forge-ember bg-white p-8 text-center">
              <Check className="mx-auto h-10 w-10 text-forge-ember" />
              <h2 className="mt-4 text-2xl font-bold">既に Premium 加入中</h2>
              <p className="mt-3 text-sm text-forge-muted">
                次回更新日：{existingSub?.current_period_end ? new Date(existingSub.current_period_end).toLocaleDateString("ja-JP") : "—"}
              </p>
              {existingSub?.cancel_at_period_end && (
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-amber-700">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  解約予約済み（期間終了で停止）
                </p>
              )}
              <Link
                href="/engineers/apply"
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-md border-2 border-forge-border bg-white px-6 py-3 text-sm font-medium hover:border-forge-black transition"
              >
                プロフィールへ戻る
              </Link>
            </div>
          ) : (
            <div className="relative rounded-2xl border-2 border-forge-ember p-8 bg-gradient-to-br from-orange-50 to-white shadow-lg">
              <div className="absolute -top-3 left-8 bg-forge-ember text-white text-xs font-medium px-3 py-1 rounded-full">
                ⭐ 推奨
              </div>
              <p className="text-xs font-medium text-forge-ember">PREMIUM</p>
              <p className="mt-2 text-3xl font-bold tabular-nums">
                ¥3,000
                <span className="text-sm font-normal text-forge-muted">/月</span>
              </p>
              <p className="mt-1 text-sm text-forge-muted">いつでも解約可能</p>

              <ul className="mt-7 space-y-3 text-sm">
                {[
                  "新着案件の即時通知（メール + SMS）",
                  "企業へ直接 DM 送信権",
                  "プロフィール優先表示（検索結果上位）",
                  "実績バッジ（Forge 認定）",
                  "Premium 限定の Slack コミュニティ",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-forge-ember" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <SubscribeButton />
              </div>

              <p className="mt-4 text-xs text-forge-muted text-center">
                Stripe で安全に決済。クレジットカード情報は弊社サーバーに保存されません。
              </p>
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              href="/engineers"
              className="inline-flex items-center gap-1.5 text-sm text-forge-muted hover:text-forge-black transition"
            >
              ← Engineers トップへ
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
