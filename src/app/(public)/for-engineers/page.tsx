import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";

export const metadata = {
  title: "エンジニアの方へ — 営業も、契約も、請求もしない。",
  description: "ForgeはAI実装案件を弊社が元請として獲得し、登録エンジニアに業務委託で発注します。",
};

export default function ForEngineersPage() {
  return (
    <>
      <section className="border-b border-forge-border bg-forge-surface">
        <div className="container py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-xs font-medium text-forge-ember">For Engineers</p>
            <h1 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]">
              営業も、契約も、請求もしない。<br />
              書くことだけに、集中する。
            </h1>
            <p className="mt-6 text-lg text-forge-muted leading-relaxed">
              ForgeはAI実装案件を弊社が元請として獲得し、登録エンジニアに業務委託で発注します。
              あなたは案件を選び、書き、納品するだけ。
              構築後の運用フェーズも、月次の継続報酬として続きます。
            </p>
            <div className="mt-10">
              <Link
                href="/engineers/apply"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-forge-black px-6 py-3.5 text-white font-medium hover:bg-forge-ember transition"
              >
                <Github className="h-4 w-4" />
                GitHub経由で登録（30秒）
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container py-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            フリーランスエンジニアの現実
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            <div className="rounded-lg border border-forge-border p-8">
              <p className="text-sm font-semibold text-forge-muted">Before（個人で営業）</p>
              <ul className="mt-4 space-y-3 text-sm">
                <li>・営業のために自分の単価を晒す</li>
                <li>・案件ごとに契約交渉、与信確認、請求書発行</li>
                <li>・確定申告が辛い</li>
                <li>・単価交渉で消耗する</li>
                <li>・構築終わったら次の案件探し</li>
              </ul>
            </div>
            <div className="rounded-lg border-2 border-forge-ember bg-forge-surface p-8">
              <p className="text-sm font-semibold text-forge-ember">After（Forge）</p>
              <ul className="mt-4 space-y-3 text-sm">
                <li>・Forgeが案件を持ってくる</li>
                <li>・契約は弊社と御社の間で完結、あなたは業務委託契約1枚</li>
                <li>・報酬は月次で確定、振込のみ</li>
                <li>・単価は事前合意、交渉不要</li>
                <li>・構築後の運用契約で月次継続収入</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-forge-border bg-forge-surface">
        <div className="container py-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">登録要件</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-forge-border bg-white p-8">
              <p className="text-sm font-semibold">必須</p>
              <ul className="mt-4 space-y-2 text-sm text-forge-muted">
                <li>・生成AI・LLMを使った実装経験（業務・個人プロダクト問わず）</li>
                <li>・GitHubアカウント</li>
                <li>・日本語での業務コミュニケーション</li>
              </ul>
            </div>
            <div className="rounded-lg border border-forge-border bg-white p-8">
              <p className="text-sm font-semibold">歓迎</p>
              <ul className="mt-4 space-y-2 text-sm text-forge-muted">
                <li>・LangChain / LlamaIndex / Vector DBの実務経験</li>
                <li>・RAG / Agentシステム構築経験</li>
                <li>・AI領域のOSS貢献</li>
                <li>・技術記事・登壇実績</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-forge-border bg-white">
        <div className="container py-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">報酬構造（透明）</h2>
          <div className="mt-10 max-w-3xl">
            <div className="space-y-6">
              <div className="rounded-lg border border-forge-border p-6">
                <p className="font-semibold">Build（構築フェーズ）</p>
                <p className="mt-2 text-forge-muted text-sm">
                  弊社売上の <strong className="text-forge-black">70〜80%</strong> をエンジニアにお支払い。
                </p>
              </div>
              <div className="rounded-lg border border-forge-border p-6">
                <p className="font-semibold">Operate（運用フェーズ）</p>
                <p className="mt-2 text-forge-muted text-sm">
                  弊社月額売上の <strong className="text-forge-black">60〜70%</strong> をエンジニアに月次継続支払い。
                  構築後も、運用に関わり続ける限り報酬が続きます。
                </p>
              </div>
            </div>
            <div className="mt-8 rounded-lg bg-forge-surface p-6 text-sm">
              <p className="font-semibold mb-2">例</p>
              <ul className="space-y-1 text-forge-muted">
                <li>構築 月100万円の案件 → エンジニア 70-80万円</li>
                <li>構築 月200万円の案件 → エンジニア 140-160万円</li>
                <li>運用 月50万円の契約 → エンジニア 30-35万円/月（継続）</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-forge-border bg-forge-black text-white">
        <div className="container py-20 text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">登録は、30秒。</h2>
          <Link
            href="/engineers/apply"
            className="mt-10 inline-flex items-center justify-center gap-2 rounded-md bg-forge-ember px-6 py-3.5 text-white font-medium hover:bg-white hover:text-forge-black transition"
          >
            <Github className="h-4 w-4" />
            GitHub経由で登録
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
