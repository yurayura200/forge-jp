import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Activity, Zap } from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-forge-surface to-white" />
        <div className="container py-20 md:py-32">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-xs font-medium text-forge-ember">
              <Sparkles className="h-3.5 w-3.5" />
              日本のAI運用インフラ
            </p>
            <h1 className="mt-4 text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
              AIを、<br className="md:hidden" />動かし続ける。
            </h1>
            <p className="mt-6 text-lg md:text-xl text-forge-muted leading-relaxed">
              構築だけじゃない。評価・運用・進化まで。<br />
              日本のAIインフラを、Forgeから。
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link
                href="/inquiry"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-forge-black px-6 py-3.5 text-white font-medium hover:bg-forge-ember transition"
              >
                企業の方：相談する
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/for-engineers"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-forge-border bg-white px-6 py-3.5 font-medium hover:border-forge-black transition"
              >
                エンジニアの方：登録する
              </Link>
            </div>
            <p className="mt-6 text-sm text-forge-muted">
              構築 → 評価 → 運用 → 改善のサイクルを丸ごと請け負う、日本初のAI運用特化ファーム。
            </p>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="border-t border-forge-border bg-white">
        <div className="container py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              AI実装は、作って終わりじゃない。
            </h2>
            <p className="mt-4 text-lg text-forge-muted">
              ハルシネーション、モデル更新、コスト爆発、評価セットの老朽化。<br />
              動かし始めてからが、本当の地獄。
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "大手SIer",
                body: "構築は得意。でも運用は社内に丸投げ。",
              },
              {
                title: "エージェント経由",
                body: "中間マージン30%、運用フェーズはノータッチ。",
              },
              {
                title: "内製採用",
                body: "数ヶ月かかる。間に合わない。",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-forge-border bg-forge-surface p-6"
              >
                <p className="text-base font-semibold">{item.title}</p>
                <p className="mt-2 text-sm text-forge-muted leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution */}
      <section className="border-t border-forge-border bg-forge-black text-white">
        <div className="container py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Forgeは、構築 → 運用 → 進化を、<br />ワンストップで提供する。
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: Sparkles,
                title: "実装特化",
                body: "生成AI・LLM・RAG・Agent開発の実務経験者のみ登録。GitHub経由で実績を確認。",
              },
              {
                icon: Activity,
                title: "運用標準装備",
                body: "構築後の精度監視・コスト最適化・モデル更新追従まで。月額固定で、AI運用部門ごと外注できる。",
              },
              {
                icon: ShieldCheck,
                title: "直契約",
                body: "弊社が元請として契約・支払いを引き受け。余計な中間マージンを削ぎ落とす。",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-white/10 bg-white/5 p-6">
                <item.icon className="h-6 w-6 text-forge-ember" />
                <p className="mt-4 text-base font-semibold">{item.title}</p>
                <p className="mt-2 text-sm text-white/70 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-forge-border bg-white">
        <div className="container py-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">仕組みは、シンプル。</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "Step 1",
                title: "相談（無料）",
                body: "Webフォームに案件概要を入力。24時間以内に担当者が返信し、要件を整理。",
              },
              {
                step: "Step 2",
                title: "構築（Build）",
                body: "要件に合うエンジニアをアサイン。最短2週間でPoC、1ヶ月で本実装初版。評価ハーネス付きで納品。",
              },
              {
                step: "Step 3",
                title: "運用（Operate）",
                body: "構築完了後、月額固定でAIシステムを動かし続ける。精度監視、コスト最適化、モデル更新、すべて込み。",
              },
            ].map((item) => (
              <div key={item.step} className="rounded-lg border border-forge-border p-6">
                <p className="text-xs font-medium text-forge-ember">{item.step}</p>
                <p className="mt-2 text-lg font-semibold">{item.title}</p>
                <p className="mt-3 text-sm text-forge-muted leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Strengths */}
      <section className="border-t border-forge-border bg-forge-surface">
        <div className="container py-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            なぜForgeが選ばれるのか。
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              {
                num: "01",
                title: "構築だけで終わらない",
                body: "日本で唯一、AI構築から運用まで一気通貫で提供。Operate契約で、AI運用部門を持たない企業でも安心して稼働。",
              },
              {
                num: "02",
                title: "弊社が元請",
                body: "契約・支払いの相手は弊社。個人エンジニアとの直接契約に伴う与信・税務・契約管理の負担なし。",
              },
              {
                num: "03",
                title: "透明な料金",
                body: "構築は案件規模で見積もり、運用は月額固定。中抜き構造を隠さず、相見積もり歓迎。",
              },
              {
                num: "04",
                title: "評価ハーネス標準装備",
                body: "全構築案件に評価データセットとリグレッションテストを納品。モデル更新・プロンプト変更による精度劣化を即座に検知。",
              },
            ].map((item) => (
              <div
                key={item.num}
                className="rounded-lg border border-forge-border bg-white p-8"
              >
                <p className="text-xs font-medium text-forge-ember">{item.num}</p>
                <p className="mt-2 text-xl font-semibold">{item.title}</p>
                <p className="mt-3 text-sm text-forge-muted leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="border-t border-forge-border bg-white">
        <div className="container py-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">料金は、明確。</h2>
          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            <div className="rounded-lg border border-forge-border p-8">
              <p className="text-xs font-medium text-forge-ember">Build</p>
              <p className="mt-1 text-2xl font-bold">構築フェーズ</p>
              <ul className="mt-6 space-y-4 text-sm">
                <li className="flex justify-between border-b border-forge-border pb-3">
                  <span>PoC・小規模実装</span>
                  <span className="font-medium">50万円〜</span>
                </li>
                <li className="flex justify-between border-b border-forge-border pb-3">
                  <span>中規模実装</span>
                  <span className="font-medium">100〜500万円</span>
                </li>
                <li className="flex justify-between">
                  <span>大規模・継続案件</span>
                  <span className="font-medium">500万円〜</span>
                </li>
              </ul>
            </div>
            <div className="rounded-lg border-2 border-forge-ember p-8 relative">
              <div className="absolute -top-3 left-8 bg-forge-ember text-white text-xs font-medium px-2 py-1 rounded">
                推奨・全案件にセット
              </div>
              <p className="text-xs font-medium text-forge-ember">Operate</p>
              <p className="mt-1 text-2xl font-bold">運用フェーズ</p>
              <ul className="mt-6 space-y-4 text-sm">
                <li className="flex justify-between border-b border-forge-border pb-3">
                  <span>ベーシック</span>
                  <span className="font-medium">月30万円〜</span>
                </li>
                <li className="flex justify-between border-b border-forge-border pb-3">
                  <span>スタンダード</span>
                  <span className="font-medium">月70万円〜</span>
                </li>
                <li className="flex justify-between">
                  <span>エンタープライズ</span>
                  <span className="font-medium">月150万円〜</span>
                </li>
              </ul>
            </div>
          </div>
          <p className="mt-6 text-sm text-forge-muted">
            最低契約期間: 6ヶ月。Build単独契約は通常価格1.5倍。詳細はヒアリング後に見積もり。すべて成果物完成責任型の業務委託契約。
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-forge-border bg-forge-surface">
        <div className="container py-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">よくあるご質問</h2>
          <div className="mt-12 max-w-3xl space-y-6">
            {[
              {
                q: "なぜ大手SIerやエージェントではなくForgeを選ぶべきですか？",
                a: "AI実装の現場経験を持つエンジニアに直接届くこと、そして構築後の運用まで一気通貫で提供することが理由です。SIerやエージェントは構築で終わり、運用は別途見積もりや内製対応となるケースがほとんどです。",
              },
              {
                q: "Operate（運用）契約は必須ですか？",
                a: "強く推奨しますが必須ではありません。Build単独契約は通常料金の1.5倍となります。AIシステムは構築後の運用が成功率を左右するためで、運用設計まで含めて初めて投資対効果が出るという経験則に基づきます。",
              },
              {
                q: "契約相手は誰になりますか？",
                a: "弊社です。御社は弊社1社と契約を結ぶだけで完結します。エンジニアとは弊社が個別に業務委託契約を結びます。",
              },
              {
                q: "守秘義務（NDA）は対応していますか？",
                a: "はい。標準でNDAを締結します。御社のNDAテンプレートでも、弊社のテンプレートでも対応可能です。",
              },
              {
                q: "既存システムとの連携も可能ですか？",
                a: "可能です。Salesforce、HubSpot、Slack、Notion、kintone等、業務SaaSとのAPI連携実績のあるエンジニアが在籍しています。",
              },
              {
                q: "相談だけでも可能ですか？",
                a: "可能です。要件整理の段階での無料相談を歓迎します。",
              },
            ].map((item) => (
              <details
                key={item.q}
                className="group rounded-lg border border-forge-border bg-white p-6"
              >
                <summary className="cursor-pointer list-none flex items-center justify-between font-medium">
                  <span>{item.q}</span>
                  <span className="text-forge-ember group-open:rotate-45 transition">+</span>
                </summary>
                <p className="mt-4 text-sm text-forge-muted leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-forge-border bg-forge-black text-white">
        <div className="container py-20 text-center">
          <Zap className="mx-auto h-10 w-10 text-forge-ember" />
          <h2 className="mt-6 text-4xl md:text-5xl font-bold tracking-tight">
            AIを、動かし続ける。
          </h2>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/inquiry"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-forge-ember px-6 py-3.5 text-white font-medium hover:bg-white hover:text-forge-black transition"
            >
              企業の方：相談する（無料）
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/for-engineers"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 px-6 py-3.5 font-medium hover:bg-white/10 transition"
            >
              エンジニアの方：登録する
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
