import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Premium 登録完了",
  robots: { index: false, follow: false },
};

export default function SubscribeSuccessPage() {
  return (
    <section className="bg-forge-surface min-h-screen">
      <div className="container py-16 md:py-24">
        <div className="max-w-xl mx-auto text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-forge-ember" />
          <h1 className="mt-6 text-3xl md:text-4xl font-bold tracking-tight">
            Premium 登録ありがとうございます
          </h1>
          <p className="mt-4 text-forge-muted">
            決済が完了しました。新着案件は登録メールアドレスへ即時通知されます。
          </p>
          <p className="mt-2 text-sm text-forge-muted">
            ※ Stripe からの決済確認メールが別途届きます。
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/engineers"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-forge-black px-6 py-3 text-white font-medium hover:bg-forge-ember transition"
            >
              Engineers トップへ
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
