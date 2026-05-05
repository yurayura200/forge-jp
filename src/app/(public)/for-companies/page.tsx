import Link from "next/link";
import { ArrowRight, AlertTriangle, TrendingUp, RefreshCw } from "lucide-react";

export const metadata = {
  title: "企業の方へ — 社内に、AI運用部門を。",
  description:
    "AI構築から運用まで、月額固定で外注できる唯一の選択肢。Forge。",
};

export default function ForCompaniesPage() {
  return (
    <>
      <section className="border-b border-forge-border bg-forge-surface">
        <div className="container py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-xs font-medium text-forge-ember">For Companies</p>
            <h1 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]">
              社内に、AI運用部門を。
            </h1>
            <p className="mt-6 text-lg text-forge-muted leading-relaxed">
              採用には時間がかかる。SIerは現場と乖離している。
              Forgeは、AI構築から運用まで、月額固定で外注できる唯一の選択肢です。
            </p>
            <div className="mt-10">
              <Link
                href="/inquiry"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-forge-black px-6 py-3.5 text-white font-medium hover:bg-forge-ember transition"
              >
                相談する（無料）
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container py-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            こんなケースで使われています
          </h2>
          <div className="mt-12 grid gap-4 md:grid-cols-2">
            {[
              "社内データを使った検索・チャットボット（RAG）の構築と運用",
              "顧客対応の自動化（LLM + 業務システム連携）",
              "文書処理の自動化（請求書OCR + 構造化）",
              "業務エージェント（経費精算、議事録要約等）",
              "AI機能を既存SaaSに組み込み＋運用監視",
              "経営層向けAI戦略のPoC＋本番稼働",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-3 rounded-lg border border-forge-border bg-forge-surface p-5 text-sm"
              >
                <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-forge-ember text-xs font-bold text-white">
                  ✓
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-forge-border bg-forge-surface">
        <div className="container py-20">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              AIは、作るより動かし続けるのが難しい。
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                icon: AlertTriangle,
                title: "ハルシネーション",
                body: "本番運用で初めて気づく精度劣化。気づいた時には信頼を失う。",
              },
              {
                icon: RefreshCw,
                title: "モデル更新",
                body: "GPT、Claude、Geminiのバージョンアップに追従できない。古いモデルで動き続けると、いつの間にか競合に負ける。",
              },
              {
                icon: TrendingUp,
                title: "コスト爆発",
                body: "ユーザー数増加でAPIコストが想定外に膨らむ。予算超過で経営層から怒られる。",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-lg border border-forge-border bg-white p-6">
                <item.icon className="h-6 w-6 text-forge-ember" />
                <p className="mt-4 text-base font-semibold">{item.title}</p>
                <p className="mt-2 text-sm text-forge-muted leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 rounded-lg bg-forge-black p-8 text-center text-white">
            <h3 className="text-2xl md:text-3xl font-bold">
              Forgeなら、これら全部、月額固定で吸収する。
            </h3>
          </div>
        </div>
      </section>

      <section className="border-t border-forge-border bg-white">
        <div className="container py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">まずは相談する。</h2>
          <p className="mt-4 text-forge-muted">無料、24時間以内に返信。</p>
          <Link
            href="/inquiry"
            className="mt-10 inline-flex items-center justify-center gap-2 rounded-md bg-forge-black px-6 py-3.5 text-white font-medium hover:bg-forge-ember transition"
          >
            相談する
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
