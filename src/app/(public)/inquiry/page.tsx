import { InquiryForm } from "@/components/forms/InquiryForm";
import { CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "案件登録（無料）",
  description:
    "AI 実装の要件を Forge に登録すると、最適なエンジニアチームを 48 時間以内にご紹介します。登録は無料、要件マッチング後にお見積もり。",
};

export default function InquiryPage() {
  return (
    <section className="bg-forge-surface">
      <div className="container py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10 text-center">
            <p className="text-xs font-medium text-forge-ember">Inquiry</p>
            <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
              案件を登録する（無料）
            </h1>
            <p className="mt-4 text-sm text-forge-muted leading-relaxed">
              AI 実装の要件を入力するだけ。Forge が要件を確認し、
              <br className="hidden md:block" />
              最適な実装チームを <strong className="text-forge-black">48 時間以内</strong>にご紹介します。
            </p>
            <ul className="mt-6 inline-flex flex-col gap-2 text-left text-sm text-forge-muted">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-forge-ember" />
                登録 / 相談は完全無料、契約までは費用一切なし
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-forge-ember" />
                NDA 標準対応、要件は外部公開しません
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-forge-ember" />
                要件にマッチするチームが見つかった場合のみご連絡
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-forge-border bg-white p-6 md:p-10">
            <InquiryForm />
          </div>
        </div>
      </div>
    </section>
  );
}
