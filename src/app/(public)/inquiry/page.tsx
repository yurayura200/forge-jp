import { InquiryForm } from "@/components/forms/InquiryForm";

export const metadata = {
  title: "お問い合わせ",
  description: "AI実装・運用についてのご相談を24時間受け付けています。",
};

export default function InquiryPage() {
  return (
    <section className="bg-forge-surface">
      <div className="container py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10 text-center">
            <p className="text-xs font-medium text-forge-ember">Inquiry</p>
            <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
              お問い合わせ
            </h1>
            <p className="mt-3 text-sm text-forge-muted">
              担当者より24時間以内（営業日）にご返信します。
            </p>
          </div>
          <div className="rounded-lg border border-forge-border bg-white p-6 md:p-10">
            <InquiryForm />
          </div>
        </div>
      </div>
    </section>
  );
}
