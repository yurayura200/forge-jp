export const metadata = {
  title: "会社情報",
};

const COMPANY_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME || "（運営会社）";
const COMPANY_ADDRESS = process.env.NEXT_PUBLIC_COMPANY_ADDRESS || "（住所）";

export default function AboutPage() {
  return (
    <section className="bg-white">
      <div className="container py-20 md:py-28">
        <div className="max-w-3xl">
          <p className="text-xs font-medium text-forge-ember">About</p>
          <h1 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">会社情報</h1>
          <p className="mt-6 text-lg text-forge-muted leading-relaxed">
            ForgeはAI実装エージェンシー。日本のAI実装の現場と企業を直接つなぎ、構築から運用まで一気通貫で提供します。
          </p>

          <dl className="mt-12 divide-y divide-forge-border border-t border-b border-forge-border">
            <div className="grid grid-cols-3 gap-4 py-4 text-sm">
              <dt className="font-medium text-forge-muted">サービス名</dt>
              <dd className="col-span-2">Forge</dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-4 text-sm">
              <dt className="font-medium text-forge-muted">運営会社</dt>
              <dd className="col-span-2">{COMPANY_NAME}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-4 text-sm">
              <dt className="font-medium text-forge-muted">所在地</dt>
              <dd className="col-span-2">{COMPANY_ADDRESS}</dd>
            </div>
            <div className="grid grid-cols-3 gap-4 py-4 text-sm">
              <dt className="font-medium text-forge-muted">事業内容</dt>
              <dd className="col-span-2">
                AI実装の受託開発、AI運用基盤の提供、業務委託エンジニアのマッチング
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
