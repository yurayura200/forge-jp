export const metadata = { title: "特定商取引法に基づく表記" };

const COMPANY_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME || "[運営会社名]";
const COMPANY_ADDRESS = process.env.NEXT_PUBLIC_COMPANY_ADDRESS || "[所在地]";

export default function TokushohoPage() {
  return (
    <section className="bg-white">
      <div className="container py-20">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">
            特定商取引法に基づく表記
          </h1>
          <dl className="divide-y divide-forge-border border-t border-b border-forge-border">
            {[
              { label: "事業者名", value: COMPANY_NAME },
              { label: "所在地", value: COMPANY_ADDRESS },
              { label: "代表者", value: "請求があったら遅滞なく開示します" },
              { label: "連絡先", value: "本サービスのお問い合わせフォームよりご連絡ください" },
              {
                label: "販売価格",
                value: "案件ごとに見積もり。Build契約は50万円〜、Operate契約は月額30万円〜",
              },
              {
                label: "支払時期・方法",
                value:
                  "Build：着手金および検収後支払い。Operate：月末締め翌月末日払い。銀行振込",
              },
              {
                label: "役務の提供時期",
                value: "個別契約に定める通り",
              },
              {
                label: "返品・キャンセル",
                value:
                  "業務委託契約の性質上、原則として返金不可。ただし当社の重大な過失による場合は協議の上対応",
              },
            ].map((item) => (
              <div key={item.label} className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 text-sm">
                <dt className="font-medium text-forge-muted">{item.label}</dt>
                <dd className="md:col-span-2 leading-relaxed">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
