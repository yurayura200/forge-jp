export const metadata = { title: "利用規約" };

const COMPANY_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME || "[運営会社名]";

export default function TermsPage() {
  return (
    <section className="bg-white">
      <div className="container py-20">
        <div className="max-w-3xl prose-sm">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">利用規約</h1>
          <div className="space-y-6 text-sm leading-relaxed text-forge-muted">
            <p>
              本規約は、{COMPANY_NAME}（以下「当社」）が提供するサービス「Forge」（以下「本サービス」）の利用条件を定めるものです。
              本サービスを利用するすべてのユーザー（以下「利用者」）は、本規約に同意したものとみなします。
            </p>
            <h2 className="text-lg font-semibold text-forge-black">第1条（適用）</h2>
            <p>本規約は、本サービスの提供条件および当社と利用者との間の権利義務関係を定めることを目的とし、利用者と当社との間の本サービスの利用に関わる一切の関係に適用されます。</p>
            <h2 className="text-lg font-semibold text-forge-black">第2条（登録）</h2>
            <p>本サービスのエンジニア登録を希望する者は、本規約に同意の上、当社が定める方法により登録を申請するものとします。当社は、申請内容を審査の上、当社が定める基準に従って登録の可否を決定します。</p>
            <h2 className="text-lg font-semibold text-forge-black">第3条（禁止事項）</h2>
            <p>利用者は、以下の行為を行ってはなりません：法令に違反する行為、虚偽の情報の登録、当社または第三者の権利を侵害する行為、本サービスの運営を妨害する行為、その他当社が不適切と判断する行為。</p>
            <h2 className="text-lg font-semibold text-forge-black">第4条（個別契約）</h2>
            <p>本サービスを通じて成立する案件については、当社と利用者との間で別途業務委託契約を締結します。個別案件の条件は当該契約に従います。</p>
            <h2 className="text-lg font-semibold text-forge-black">第5条（免責事項）</h2>
            <p>当社は、本サービスの提供にあたり合理的な注意を払いますが、利用者が本サービスを利用することにより生じた損害について、当社の故意または重過失による場合を除き、一切の責任を負いません。</p>
            <h2 className="text-lg font-semibold text-forge-black">第6条（規約の変更）</h2>
            <p>当社は、必要と判断した場合には、利用者への通知をもって本規約を変更できます。</p>
            <h2 className="text-lg font-semibold text-forge-black">第7条（準拠法・合意管轄）</h2>
            <p>本規約は日本法を準拠法とし、本サービスに関して紛争が生じた場合、当社の本店所在地を管轄する地方裁判所を第一審の専属的合意管轄裁判所とします。</p>
            <p className="text-xs">最終更新日: 2026年5月</p>
          </div>
        </div>
      </div>
    </section>
  );
}
