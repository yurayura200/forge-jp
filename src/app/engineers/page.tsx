import Link from "next/link";
import { ArrowRight, Github, Briefcase, Star, Zap, Lock } from "lucide-react";

// 招待制ページ：検索エンジンには載せない
export const metadata = {
  title: "Forge Engineers — 招待制",
  description: "Forge 登録エンジニア専用の入口。",
  robots: { index: false, follow: false },
};

export default function EngineersLandingPage() {
  return (
    <>
      {/* Hero */}
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
        <div className="container py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-forge-ember/20 bg-forge-ember/5 px-3 py-1.5 text-xs font-medium text-forge-ember">
              <Lock className="h-3 w-3" />
              招待制 / Invite Only
            </p>
            <h1 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]">
              AI 案件を、
              <br />
              <span className="bg-gradient-to-r from-forge-black via-forge-ember to-forge-black bg-clip-text text-transparent">
                取りに行かなくていい
              </span>
              。
            </h1>
            <p className="mt-8 text-lg md:text-xl text-forge-muted leading-relaxed">
              AI 実装の需要が、対応できるエンジニアの数を圧倒的に超えている今、
              <br />
              Forge には案件側からの問い合わせが集まっている。
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                href="/engineers/apply"
                className="group inline-flex items-center justify-center gap-2 rounded-md bg-forge-black px-8 py-4 text-white font-medium hover:bg-forge-ember transition-all hover:scale-[1.02]"
              >
                <Github className="h-4 w-4" />
                登録する（無料）
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/engineers/subscribe"
                className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-forge-ember bg-white px-8 py-4 font-medium text-forge-ember hover:bg-forge-ember hover:text-white transition-all"
              >
                <Star className="h-4 w-4" />
                Premium 詳細（¥3,000/月）
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why */}
      <section className="bg-white">
        <div className="container py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-forge-ember">背景</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
              いま、AI エンジニアは圧倒的に足りない。
            </h2>
            <p className="mt-4 text-lg text-forge-muted">
              企業から「AI 入れたいのに対応できる会社が見つからない」という相談が止まらない。
              実装できる人さえいれば、案件は無限に湧く。
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Briefcase,
                title: "営業しなくていい",
                body: "Forge が企業から案件を受注。要件・予算・期間が固まった状態でエンジニア側に提示。",
              },
              {
                icon: Zap,
                title: "即着手できる",
                body: "受注済み案件のみが流れてくる。提案書・見積もり・契約は Forge 側で完結。",
              },
              {
                icon: Star,
                title: "Premium で優先配信",
                body: "月 ¥3,000 で新着案件の最速通知・直接 DM 機能・実績バッジが付く。",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-forge-border bg-gradient-to-br from-forge-surface to-white p-6"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-forge-ember/10 text-forge-ember">
                  <item.icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-lg font-bold">{item.title}</p>
                <p className="mt-2 text-sm text-forge-muted leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="border-t border-forge-border bg-forge-surface">
        <div className="container py-20">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-forge-ember">プラン</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
              プランは 2 つだけ。
            </h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-forge-border bg-white p-8">
              <p className="text-xs font-medium text-forge-muted">FREE</p>
              <p className="mt-2 text-2xl font-bold">無料登録</p>
              <p className="mt-1 text-sm text-forge-muted">案件にアクセスできる基本プラン</p>
              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-forge-ember">✓</span>
                  プロフィール公開
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-forge-ember">✓</span>
                  案件一覧の閲覧
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-forge-ember">✓</span>
                  Forge からのオファー受信（マッチング）
                </li>
                <li className="flex items-start gap-2 text-forge-muted">
                  <span>—</span>
                  新着通知は週次バッチ
                </li>
              </ul>
              <Link
                href="/engineers/apply"
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-md border-2 border-forge-border bg-white px-6 py-3 font-medium hover:border-forge-black transition"
              >
                登録する
              </Link>
            </div>
            <div className="relative rounded-2xl border-2 border-forge-ember p-8 bg-gradient-to-br from-orange-50 to-white shadow-lg">
              <div className="absolute -top-3 left-8 bg-forge-ember text-white text-xs font-medium px-3 py-1 rounded-full">
                ⭐ 推奨
              </div>
              <p className="text-xs font-medium text-forge-ember">PREMIUM</p>
              <p className="mt-2 text-2xl font-bold">月 ¥3,000</p>
              <p className="mt-1 text-sm text-forge-muted">優先配信 + 直接アプローチ</p>
              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-forge-ember">✓</span>
                  無料プランの全機能
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-forge-ember">✓</span>
                  新着案件の即時通知（メール + SMS）
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-forge-ember">✓</span>
                  企業へ直接 DM 送信権
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-forge-ember">✓</span>
                  プロフィール優先表示
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-forge-ember">✓</span>
                  実績バッジ（Forge 認定）
                </li>
              </ul>
              <Link
                href="/engineers/subscribe"
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-md bg-forge-ember px-6 py-3 text-white font-medium hover:bg-forge-black transition"
              >
                Premium に登録
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <p className="mt-6 text-sm text-forge-muted">
            ※ 案件成立時の Forge 手数料はクライアント請求額の 25–35%。
            手数料は明細を提示し、エンジニア取り分は事前合意した金額をそのまま支払う。
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-forge-border bg-forge-black text-white">
        <div className="container py-20 text-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            まずは登録しておく。
          </h2>
          <p className="mt-4 text-white/70">
            無料登録は 1 分。案件が来たタイミングで判断すればいい。
          </p>
          <Link
            href="/engineers/apply"
            className="mt-10 inline-flex items-center justify-center gap-2 rounded-md bg-forge-ember px-8 py-4 text-white font-medium hover:bg-white hover:text-forge-black transition"
          >
            <Github className="h-4 w-4" />
            GitHub で登録する
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
