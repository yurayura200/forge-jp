import Link from "next/link";
import { ArrowRight, Check, Activity, BarChart3, Zap } from "lucide-react";
import { SubscribeForm } from "./_components/SubscribeForm";

export const metadata = {
  title: "API Gateway — Forge",
  description:
    "Forge AI Gateway。LLM API を観測・運用・コスト追跡。Anthropic 互換、月¥0〜。",
};

const TIERS = [
  {
    tier: "free" as const,
    name: "Free",
    price: 0,
    quota: 1000,
    cta: "アカウント作成",
    features: [
      "月 1,000 リクエスト",
      "観測ダッシュボード",
      "基本ロギング",
      "コミュニティサポート",
    ],
  },
  {
    tier: "starter" as const,
    name: "Starter",
    price: 980,
    quota: 50000,
    cta: "Starter で始める",
    features: [
      "月 50,000 リクエスト",
      "email サポート",
      "コスト追跡",
      "使用量ダッシュボード",
    ],
  },
  {
    tier: "growth" as const,
    name: "Growth",
    price: 4980,
    quota: 500000,
    cta: "Growth で始める",
    features: [
      "月 500,000 リクエスト",
      "優先サポート",
      "チームメンバー追加",
      "監視アラート（Slack/メール）",
    ],
    featured: true,
  },
  {
    tier: "scale" as const,
    name: "Scale",
    price: 19800,
    quota: 5000000,
    cta: "Scale で始める",
    features: [
      "月 5,000,000 リクエスト",
      "SLA 99.5%",
      "専任 Slack チャネル",
      "カスタム警告ルール",
    ],
  },
];

export default function ApiAccessPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-forge-border bg-forge-surface">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #0a0a0a 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="container py-24 md:py-32">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-forge-ember/20 bg-forge-ember/5 px-3 py-1.5 text-xs font-medium text-forge-ember">
              API Gateway
            </p>
            <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              LLM API を、
              <br />
              <span className="bg-gradient-to-r from-forge-black via-forge-ember to-forge-black bg-clip-text text-transparent">
                可視化する
              </span>
              。
            </h1>
            <p className="mt-8 text-lg md:text-xl text-forge-muted leading-relaxed">
              Anthropic / OpenAI への呼び出しを Forge 経由にするだけで、
              <br />
              使用量・コスト・エラーを <strong className="text-forge-black">リアルタイムで観測</strong>。
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                href="#pricing"
                className="group inline-flex items-center justify-center gap-2 rounded-md bg-forge-black px-8 py-4 text-white font-medium hover:bg-forge-ember transition-all"
              >
                料金プランを見る
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <a
                href="#how"
                className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-forge-border bg-white/80 backdrop-blur px-8 py-4 font-medium hover:border-forge-black transition-all"
              >
                使い方
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-white">
        <div className="container py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-forge-ember">使い方</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
              既存コードの URL を 1 行変えるだけ。
            </h2>
            <p className="mt-4 text-lg text-forge-muted">
              Anthropic SDK の base_url を Forge に向けて、API key を Forge 発行のものに差し替えるだけ。
            </p>
          </div>
          <div className="mt-12 rounded-lg border border-forge-border bg-forge-black overflow-hidden">
            <div className="px-5 py-3 border-b border-white/10 text-xs text-white/60">
              Python 例
            </div>
            <pre className="px-5 py-6 text-sm text-white/90 overflow-x-auto">
{`from anthropic import Anthropic

client = Anthropic(
    base_url="https://forge.komugi-ai.jp/api/v1",
    api_key="forge_live_xxxxxxxxxxxxxxx",  # Forge 発行
)

resp = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello"}],
)`}
            </pre>
          </div>
          <p className="mt-4 text-sm text-forge-muted">
            ※ 顧客が登録した Anthropic API キーで Forge が中継。LLM 利用料は顧客から Anthropic へ直接請求。
          </p>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Activity,
                title: "リアルタイム観測",
                body: "全 API call をログ化。error / latency / token 使用量を1画面で。",
              },
              {
                icon: BarChart3,
                title: "コスト追跡",
                body: "プロバイダ実費を即時可視化。予算超過アラートで請求事故を防ぐ。",
              },
              {
                icon: Zap,
                title: "ゼロレイテンシ実装",
                body: "オーバーヘッドは 数十ms 程度。本番でそのまま使える。",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-forge-border bg-forge-surface p-6"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-forge-ember/10 text-forge-ember">
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-base font-bold">{item.title}</p>
                <p className="mt-2 text-sm text-forge-muted leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-forge-border bg-forge-surface">
        <div className="container py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-forge-ember">料金</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
              シンプルな月額固定。
            </h2>
            <p className="mt-3 text-forge-muted">
              LLM 実費は別途プロバイダから請求されます。Forge は gateway 機能のみ請求します。
            </p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-4">
            {TIERS.map((t) => (
              <div
                key={t.tier}
                className={`relative rounded-2xl p-7 transition ${
                  t.featured
                    ? "border-2 border-forge-ember bg-white shadow-lg"
                    : "border border-forge-border bg-white"
                }`}
              >
                {t.featured && (
                  <div className="absolute -top-3 left-7 bg-forge-ember text-white text-xs font-medium px-3 py-1 rounded-full">
                    ⭐ 推奨
                  </div>
                )}
                <p className="text-xs font-medium text-forge-ember">{t.name}</p>
                <p className="mt-2 text-3xl font-bold tabular-nums">
                  ¥{t.price.toLocaleString()}
                  <span className="text-sm font-normal text-forge-muted">/月</span>
                </p>
                <p className="mt-1 text-xs text-forge-muted tabular-nums">
                  {t.quota.toLocaleString()} requests/月
                </p>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-forge-ember" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <SubscribeForm tier={t.tier} cta={t.cta} featured={!!t.featured} />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-xl border border-forge-border bg-white p-6 md:p-8">
            <p className="text-sm font-medium text-forge-ember">Enterprise</p>
            <p className="mt-2 text-xl font-bold">無制限・SLA 99.9% / on-premise 対応</p>
            <p className="mt-2 text-sm text-forge-muted">
              年間契約・カスタム要件対応。詳細はお問い合わせください。
            </p>
            <Link
              href="/inquiry"
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-forge-black hover:text-forge-ember"
            >
              お問い合わせ
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
