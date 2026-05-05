import Link from "next/link";

const COMPANY_NAME = process.env.NEXT_PUBLIC_COMPANY_NAME || "";

export function Footer() {
  return (
    <footer className="border-t border-forge-border bg-forge-surface">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <p className="text-lg font-bold">Forge</p>
            <p className="mt-2 text-sm text-forge-muted">AIを、動かし続ける。</p>
          </div>
          <div>
            <p className="text-sm font-semibold mb-3">サービス</p>
            <ul className="space-y-2 text-sm text-forge-muted">
              <li><Link href="/for-companies" className="hover:text-forge-black transition">企業の方へ</Link></li>
              <li><Link href="/for-engineers" className="hover:text-forge-black transition">エンジニアの方へ</Link></li>
              <li><Link href="/operate" className="hover:text-forge-black transition">運用サービス</Link></li>
              <li><Link href="/inquiry" className="hover:text-forge-black transition">お問い合わせ</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold mb-3">運営</p>
            <ul className="space-y-2 text-sm text-forge-muted">
              <li><Link href="/about" className="hover:text-forge-black transition">会社情報</Link></li>
              <li><Link href="/legal/terms" className="hover:text-forge-black transition">利用規約</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-forge-black transition">プライバシーポリシー</Link></li>
              <li><Link href="/legal/tokushoho" className="hover:text-forge-black transition">特定商取引法表記</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-sm font-semibold mb-3">お問い合わせ</p>
            <Link
              href="/inquiry"
              className="inline-block rounded-md bg-forge-black px-4 py-2 text-white text-sm font-medium hover:bg-forge-ember transition"
            >
              無料相談する
            </Link>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-forge-border text-xs text-forge-muted">
          <p>{COMPANY_NAME ? `© ${new Date().getFullYear()} ${COMPANY_NAME}` : `© ${new Date().getFullYear()} Forge`}</p>
        </div>
      </div>
    </footer>
  );
}
