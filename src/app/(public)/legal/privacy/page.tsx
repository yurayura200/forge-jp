export const metadata = { title: "プライバシーポリシー" };

const COMPANY_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME || "[運営会社名]";

export default function PrivacyPage() {
  return (
    <section className="bg-white">
      <div className="container py-20">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">プライバシーポリシー</h1>
          <div className="space-y-6 text-sm leading-relaxed text-forge-muted">
            <p>
              {COMPANY_NAME}（以下「当社」）は、本サービス「Forge」における個人情報の取扱いについて、以下のとおりプライバシーポリシーを定めます。
            </p>
            <h2 className="text-lg font-semibold text-forge-black">1. 取得する情報</h2>
            <p>当社は以下の個人情報を取得します：氏名、会社名、メールアドレス、電話番号、GitHubアカウント情報、職務経歴・スキル情報、その他サービス提供に必要な情報。</p>
            <h2 className="text-lg font-semibold text-forge-black">2. 利用目的</h2>
            <p>取得した個人情報は、本サービスの提供、案件のマッチング、契約・請求業務、お問い合わせ対応、サービス改善、利用者への重要なお知らせの目的で利用します。</p>
            <h2 className="text-lg font-semibold text-forge-black">3. 第三者提供</h2>
            <p>当社は、法令に基づく場合または利用者本人の同意がある場合を除き、個人情報を第三者に提供しません。なお、案件マッチング目的でクライアント企業に提供する場合は、事前に利用者の同意を得ます。</p>
            <h2 className="text-lg font-semibold text-forge-black">4. 安全管理措置</h2>
            <p>当社は、個人情報の漏洩、滅失、毀損の防止のため、適切な安全管理措置を講じます。</p>
            <h2 className="text-lg font-semibold text-forge-black">5. 開示・訂正・削除</h2>
            <p>利用者は、当社に対して保有個人データの開示、訂正、削除を請求できます。</p>
            <h2 className="text-lg font-semibold text-forge-black">6. お問い合わせ</h2>
            <p>個人情報に関するお問い合わせは、本サービスのお問い合わせフォームよりご連絡ください。</p>
            <h2 className="text-lg font-semibold text-forge-black">7. Cookie等の利用</h2>
            <p>当社は、サービス品質向上のためCookieおよび類似技術を使用します。利用者はブラウザの設定により無効化できます。</p>
            <p className="text-xs">最終更新日: 2026年5月</p>
          </div>
        </div>
      </div>
    </section>
  );
}
