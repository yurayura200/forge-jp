import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Activity,
  Zap,
  Hammer,
  LineChart,
  CheckCircle2,
  Quote,
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* gradient + grain background */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-br from-forge-surface via-white to-orange-50"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #0a0a0a 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        {/* ember glow accent */}
        <div
          aria-hidden
          className="absolute right-0 top-0 -z-10 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/3 rounded-full bg-forge-ember/10 blur-3xl"
        />

        <div className="container py-24 md:py-36">
          <div className="max-w-3xl animate-fade-in-up">
            <p className="inline-flex items-center gap-2 rounded-full border border-forge-ember/20 bg-forge-ember/5 px-3 py-1.5 text-xs font-medium text-forge-ember">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-forge-ember opacity-75 animate-ember-pulse" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-forge-ember" />
              </span>
              日本のAI運用インフラ
            </p>
            <h1 className="mt-6 text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              AIを、
              <br className="md:hidden" />
              <span className="bg-gradient-to-r from-forge-black via-forge-ember to-forge-black bg-clip-text text-transparent">
                動かし続ける
              </span>
              。
            </h1>
            <p className="mt-8 text-lg md:text-xl text-forge-muted leading-relaxed">
              「AI を導入したいのに、対応してくれる会社が見つからない」。
              <br />
              そんな企業のために、構築から運用まで <strong className="text-forge-black">私たちが全部引き受ける</strong>。
            </p>
            <div className="mt-12 flex flex-col sm:flex-row gap-3">
              <Link
                href="/inquiry"
                className="group inline-flex items-center justify-center gap-2 rounded-md bg-forge-black px-8 py-4 text-white font-medium hover:bg-forge-ember transition-all hover:scale-[1.02] hover:shadow-xl"
              >
                無料で相談する
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/for-companies"
                className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-forge-border bg-white/80 backdrop-blur px-8 py-4 font-medium hover:border-forge-black transition-all"
              >
                サービス詳細を見る
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-forge-muted">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-forge-ember" />
                適格請求書発行事業者
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-forge-ember" />
                NDA 標準対応
              </span>
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-forge-ember" />
                構築から運用までワンストップ
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-t border-forge-border bg-white">
        <div className="container py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-forge-ember">問題</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
              AI を入れたいのに、頼める相手がいない。
            </h2>
            <p className="mt-4 text-lg text-forge-muted">
              問い合わせても返事が来ない。見積もりだけで数ヶ月。
              <br />
              入れた後の運用は誰も面倒を見てくれない。
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "大手 SIer に依頼した",
                body: "構築は終わった。でも運用は社内に丸投げ。誰も触れず、3ヶ月で停止。",
                pain: "運用が続かない",
              },
              {
                title: "問い合わせても進まない",
                body: "AI 専門の会社に連絡しても返事が遅い、対応できないと断られる。要件が固まらないまま時間だけ過ぎる。",
                pain: "対応してくれる会社がない",
              },
              {
                title: "内製で採用した",
                body: "AI エンジニア採用は半年〜1年。事業速度に間に合わない。",
                pain: "採用に時間",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-xl border border-forge-border bg-gradient-to-br from-forge-surface to-white p-6 transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <p className="inline-block rounded bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                  ❌ {item.pain}
                </p>
                <p className="mt-4 text-base font-bold">{item.title}</p>
                <p className="mt-2 text-sm text-forge-muted leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution: 3-phase visual flow */}
      <section className="border-t border-forge-border bg-forge-black text-white relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
        <div className="container py-24 relative">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-forge-ember">解決策</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
              Forge は <span className="text-forge-ember">構築 → 運用 → 進化</span> を、
              <br />
              ワンストップで提供する。
            </h2>
          </div>

          {/* Phase flow diagram */}
          <div className="mt-16 grid gap-4 md:grid-cols-3 items-stretch relative">
            {[
              {
                icon: Hammer,
                phase: "Phase 1",
                title: "Build",
                subtitle: "実装",
                body: "要件定義 → アーキテクチャ → 開発 → デプロイ。最短2週間でPoC、1ヶ月で本実装初版。",
              },
              {
                icon: LineChart,
                phase: "Phase 2",
                title: "Eval",
                subtitle: "評価",
                body: "精度・コスト・レイテンシの継続評価。リグレッションテスト標準装備。",
              },
              {
                icon: Activity,
                phase: "Phase 3",
                title: "Operate",
                subtitle: "運用",
                body: "月額固定で運用代行。モデル切替・コスト最適化・改善サイクル丸投げ。",
              },
            ].map((item, i) => (
              <div
                key={item.phase}
                className="relative rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent p-7 backdrop-blur transition-all hover:border-forge-ember/50 hover:bg-white/[0.07]"
              >
                {i < 2 && (
                  <div
                    aria-hidden
                    className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10"
                  >
                    <ArrowRight className="h-6 w-6 text-forge-ember/40" />
                  </div>
                )}
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-forge-ember/10 text-forge-ember">
                  <item.icon className="h-6 w-6" />
                </div>
                <p className="mt-5 text-xs font-medium text-forge-ember">
                  {item.phase}
                </p>
                <p className="mt-1 text-2xl font-bold">{item.title}</p>
                <p className="text-sm text-white/50">{item.subtitle}</p>
                <p className="mt-4 text-sm text-white/70 leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>

          {/* Key benefits */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: "AI 専門",
                body: "生成 AI・LLM・RAG・エージェント開発に特化。実装パターンを蓄積した専門チームが対応。",
              },
              {
                icon: ShieldCheck,
                title: "ワンストップ",
                body: "要件定義から運用まで弊社で完結。御社は窓口を 1 つに絞れる。",
              },
              {
                icon: Zap,
                title: "運用標準装備",
                body: "構築後の精度監視・コスト最適化まで。月額固定で AI 運用部門ごと外部委託。",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-3">
                <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-forge-ember" />
                <div>
                  <p className="text-base font-semibold">{item.title}</p>
                  <p className="mt-1 text-sm text-white/60 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-forge-border bg-white">
        <div className="container py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-forge-ember">流れ</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
              相談から納品まで、シンプルに 3 ステップ。
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "相談（無料）",
                body: "Web フォームに案件概要を入力。24時間以内に担当者が返信し、要件を整理。",
                duration: "24h",
              },
              {
                step: "02",
                title: "構築（Build）",
                body: "要件に合わせて開発チームを編成。最短2週間で PoC、1ヶ月で本実装初版。評価ハーネス付きで納品。",
                duration: "2週間〜1ヶ月",
              },
              {
                step: "03",
                title: "運用（Operate）",
                body: "構築完了後、月額固定で AI システムを動かし続ける。精度監視、コスト最適化、モデル更新、すべて込み。",
                duration: "月額継続",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-forge-border p-7 transition-all hover:border-forge-ember/50 hover:shadow-md"
              >
                <div className="flex items-baseline justify-between">
                  <p className="text-3xl font-bold text-forge-ember">{item.step}</p>
                  <span className="rounded-full bg-forge-surface px-3 py-1 text-xs font-medium text-forge-muted">
                    {item.duration}
                  </span>
                </div>
                <p className="mt-4 text-lg font-semibold">{item.title}</p>
                <p className="mt-3 text-sm text-forge-muted leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strengths */}
      <section className="border-t border-forge-border bg-forge-surface">
        <div className="container py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-forge-ember">強み</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
              なぜ Forge が選ばれるのか。
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              {
                num: "01",
                title: "構築だけで終わらない",
                body: "AI 構築から運用まで一気通貫で提供。Operate 契約で、AI 運用部門を持たない企業でも安心して稼働。",
              },
              {
                num: "02",
                title: "窓口は 1 社で完結",
                body: "契約・請求・問い合わせの窓口は弊社 1 社。複数業者を束ねる手間や、引き継ぎロスがない。",
              },
              {
                num: "03",
                title: "明朗会計",
                body: "構築は案件規模で見積もり、運用は月額固定。費目を明示して提示、相見積もり歓迎。",
              },
              {
                num: "04",
                title: "評価ハーネス標準装備",
                body: "全構築案件に評価データセットとリグレッションテストを納品。モデル更新・プロンプト変更による精度劣化を即座に検知。",
              },
            ].map((item) => (
              <div
                key={item.num}
                className="group rounded-xl border border-forge-border bg-white p-8 transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                <p className="text-3xl font-bold text-forge-ember">{item.num}</p>
                <p className="mt-3 text-xl font-semibold">{item.title}</p>
                <p className="mt-3 text-sm text-forge-muted leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-forge-border bg-white">
        <div className="container py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-forge-ember">料金</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
              料金は、明確。
            </h2>
            <p className="mt-3 text-forge-muted">
              案件規模に応じた個別見積もり。月額固定の運用契約あり。
            </p>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-forge-border p-8 bg-gradient-to-br from-white to-forge-surface">
              <div className="flex items-center gap-2">
                <Hammer className="h-5 w-5 text-forge-ember" />
                <p className="text-xs font-medium text-forge-ember">Build</p>
              </div>
              <p className="mt-2 text-2xl font-bold">構築フェーズ</p>
              <p className="mt-1 text-sm text-forge-muted">PoC から本実装まで案件規模に応じて</p>
              <ul className="mt-7 space-y-4 text-sm">
                <li className="flex justify-between border-b border-forge-border pb-3">
                  <span>PoC・小規模実装</span>
                  <span className="font-bold tabular-nums">50万円〜</span>
                </li>
                <li className="flex justify-between border-b border-forge-border pb-3">
                  <span>中規模実装</span>
                  <span className="font-bold tabular-nums">100〜500万円</span>
                </li>
                <li className="flex justify-between">
                  <span>大規模・継続案件</span>
                  <span className="font-bold tabular-nums">500万円〜</span>
                </li>
              </ul>
            </div>
            <div className="relative rounded-2xl border-2 border-forge-ember p-8 bg-gradient-to-br from-orange-50 to-white shadow-lg">
              <div className="absolute -top-3 left-8 bg-forge-ember text-white text-xs font-medium px-3 py-1 rounded-full">
                ⭐ 推奨・全案件にセット
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-forge-ember" />
                <p className="text-xs font-medium text-forge-ember">Operate</p>
              </div>
              <p className="mt-2 text-2xl font-bold">運用フェーズ</p>
              <p className="mt-1 text-sm text-forge-muted">月額固定で運用代行・精度監視・改善</p>
              <ul className="mt-7 space-y-4 text-sm">
                <li className="flex justify-between border-b border-forge-border pb-3">
                  <span>ベーシック</span>
                  <span className="font-bold tabular-nums">月30万円〜</span>
                </li>
                <li className="flex justify-between border-b border-forge-border pb-3">
                  <span>スタンダード</span>
                  <span className="font-bold tabular-nums">月70万円〜</span>
                </li>
                <li className="flex justify-between">
                  <span>エンタープライズ</span>
                  <span className="font-bold tabular-nums">月150万円〜</span>
                </li>
              </ul>
            </div>
          </div>
          <p className="mt-6 text-sm text-forge-muted">
            最低契約期間: 6ヶ月。Build 単独契約は通常価格 1.5 倍。詳細はヒアリング後に見積もり。すべて成果物完成責任型の業務委託契約。
          </p>
        </div>
      </section>

      {/* Voice (placeholder for first customer) */}
      <section className="border-t border-forge-border bg-forge-surface">
        <div className="container py-24">
          <div className="max-w-3xl mx-auto">
            <Quote className="h-10 w-10 text-forge-ember/30" />
            <p className="mt-6 text-2xl md:text-3xl font-medium leading-snug">
              「<span className="text-forge-black">AI を試したけど運用が回らない</span>。
              <br className="hidden md:block" />
              実装したエージェントが半年で動かなくなった。」
            </p>
            <p className="mt-6 text-sm text-forge-muted">
              — Forge が解決する典型的な問題。構築だけ終わって誰も触れない AI が、日本のあちこちに眠ってる。
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-forge-border bg-white">
        <div className="container py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-forge-ember">FAQ</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
              よくあるご質問
            </h2>
          </div>
          <div className="mt-12 max-w-3xl space-y-3">
            {[
              {
                q: "なぜ大手 SIer ではなく Forge を選ぶべきですか？",
                a: "AI 実装に特化した専門チームが対応すること、そして構築後の運用まで一気通貫で提供することが理由です。SIer の場合は構築で終わり、運用は別途見積もりや内製対応となるケースがほとんどです。",
              },
              {
                q: "Operate（運用）契約は必須ですか？",
                a: "強く推奨しますが必須ではありません。Build 単独契約は通常料金の 1.5 倍となります。AI システムは構築後の運用が成功率を左右するためで、運用設計まで含めて初めて投資対効果が出るという経験則に基づきます。",
              },
              {
                q: "契約相手は誰になりますか？",
                a: "弊社（WCH株式会社）です。御社は弊社 1 社と契約・請求・問い合わせをまとめるだけで完結します。",
              },
              {
                q: "守秘義務（NDA）は対応していますか？",
                a: "はい。標準で NDA を締結します。御社のテンプレートでも、弊社のテンプレートでも対応可能です。",
              },
              {
                q: "既存システムとの連携も可能ですか？",
                a: "可能です。Salesforce、HubSpot、Slack、Notion、kintone 等、業務 SaaS との API 連携実績があります。",
              },
              {
                q: "相談だけでも可能ですか？",
                a: "可能です。要件整理段階での無料相談を歓迎します。",
              },
            ].map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-forge-border bg-white p-6 transition-colors hover:border-forge-ember/40"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 font-medium">
                  <span>{item.q}</span>
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-forge-border text-forge-ember group-open:rotate-45 group-open:border-forge-ember transition-all">
                    +
                  </span>
                </summary>
                <p className="mt-4 text-sm text-forge-muted leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-forge-border bg-forge-black text-white relative overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            background:
              "radial-gradient(circle at 30% 50%, rgba(255,107,53,0.3), transparent 50%)",
          }}
        />
        <div className="container py-24 text-center relative">
          <Zap className="mx-auto h-12 w-12 text-forge-ember" />
          <h2 className="mt-6 text-4xl md:text-6xl font-bold tracking-tight">
            AI を、動かし続ける。
          </h2>
          <p className="mt-6 text-lg text-white/70">
            最初の 30 分の相談は無料。要件整理だけでも歓迎。
          </p>
          <div className="mt-10 flex justify-center">
            <Link
              href="/inquiry"
              className="group inline-flex items-center justify-center gap-2 rounded-md bg-forge-ember px-8 py-4 text-white font-medium hover:bg-white hover:text-forge-black transition"
            >
              無料で相談する
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
