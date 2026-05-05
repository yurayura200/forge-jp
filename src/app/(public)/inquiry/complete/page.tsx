import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export const metadata = { title: "送信完了" };

export default function InquiryCompletePage() {
  return (
    <section className="bg-white">
      <div className="container py-24">
        <div className="max-w-xl mx-auto text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-forge-ember" />
          <h1 className="mt-6 text-3xl md:text-4xl font-bold tracking-tight">
            お問い合わせを受け付けました
          </h1>
          <p className="mt-6 text-forge-muted leading-relaxed">
            ご入力いただいたメールアドレス宛に確認メールをお送りしました。<br />
            担当者より24時間以内（営業日）にご返信いたします。
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
