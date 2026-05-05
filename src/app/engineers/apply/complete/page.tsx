import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata = { title: "登録完了" };

export default function EngineerApplyCompletePage() {
  return (
    <section className="bg-white">
      <div className="container py-24">
        <div className="max-w-xl mx-auto text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-forge-ember" />
          <h1 className="mt-6 text-3xl md:text-4xl font-bold tracking-tight">
            登録ありがとうございます
          </h1>
          <p className="mt-6 text-forge-muted leading-relaxed">
            ご登録いただいた内容を運営チームで確認いたします。<br />
            通常2〜5営業日以内に審査結果をご連絡します。<br />
            審査通過後、案件のご紹介を順次お送りします。
          </p>
          <Link
            href="/"
            className="mt-10 inline-flex items-center justify-center rounded-md bg-forge-black px-6 py-3 text-white font-medium hover:bg-forge-ember transition"
          >
            トップへ戻る
          </Link>
        </div>
      </div>
    </section>
  );
}
