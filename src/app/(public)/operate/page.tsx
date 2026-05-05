import Link from "next/link";
import { ArrowRight, Activity, DollarSign, Eye, RefreshCw, Bell, FileText } from "lucide-react";

export const metadata = {
  title: "運用サービス — AI運用を、外注する。",
  description: "既存のAIシステムをForgeが引き取って運用します。月30万円〜。",
};

const FEATURES = [
  { icon: Eye, title: "精度監視", body: "既存LLMアプリの精度劣化を継続検知" },
  { icon: DollarSign, title: "コスト最適化", body: "モデル切替、キャッシュ、ルーティングで効率化" },
  { icon: RefreshCw, title: "モデル更新追従", body: "GPT/Claude/Geminiのバージョンアップ時の検証・移行" },
  { icon: Activity, title: "プロンプトA/Bテスト", body: "改善案を本番で安全に検証" },
  { icon: FileText, title: "月次運用レポート", body: "メトリクスとインサイトを定期報告" },
  { icon: Bell, title: "インシデント対応", body: "精度急落、コスト急増、API障害の自動検知と対応" },
];

export default function OperatePage() {
  return (
    <>
      <section className="border-b border-forge-border bg-forge-surface">
        <div className="container py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-xs font-medium text-forge-ember">Operate</p>
            <h1 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight leading-[1.1]">
              AI運用を、外注する。
            </h1>
            <p className="mt-6 text-lg text-forge-muted leading-relaxed">
              構築は他社、運用だけForgeに。これも可能。
              既に動いているAIシステムを、Forgeが引き取って運用します。
            </p>
            <div className="mt-10">
              <Link
                href="/inquiry"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-forge-black px-6 py-3.5 text-white font-medium hover:bg-forge-ember transition"
              >
                既存システムの相談をする
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container py-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Operate契約だけで何ができるか
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((item) => (
              <div key={item.title} className="rounded-lg border border-forge-border p-6">
                <item.icon className="h-6 w-6 text-forge-ember" />
                <p className="mt-4 text-base font-semibold">{item.title}</p>
                <p className="mt-2 text-sm text-forge-muted leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-forge-border bg-forge-surface">
        <div className="container py-20">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">料金</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { name: "ベーシック", price: "月30万円〜", body: "小規模AI、月10万リクエスト以下" },
              { name: "スタンダード", price: "月70万円〜", body: "中規模AI、月100万リクエスト以下", featured: true },
              { name: "エンタープライズ", price: "月150万円〜", body: "大規模、24/7監視" },
            ].map((tier) => (
              <div
                key={tier.name}
                className={`rounded-lg p-8 ${
                  tier.featured
                    ? "border-2 border-forge-ember bg-white"
                    : "border border-forge-border bg-white"
                }`}
              >
                <p className="text-sm font-medium text-forge-ember">{tier.name}</p>
                <p className="mt-2 text-2xl font-bold">{tier.price}</p>
                <p className="mt-3 text-sm text-forge-muted">{tier.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-forge-muted">
            最低契約期間: 6ヶ月。詳細はヒアリング後に見積もり。
          </p>
        </div>
      </section>

      <section className="border-t border-forge-border bg-forge-black text-white">
        <div className="container py-20 text-center">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            既存システムを、Forgeに任せる。
          </h2>
          <Link
            href="/inquiry"
            className="mt-10 inline-flex items-center justify-center gap-2 rounded-md bg-forge-ember px-6 py-3.5 text-white font-medium hover:bg-white hover:text-forge-black transition"
          >
            相談する
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
