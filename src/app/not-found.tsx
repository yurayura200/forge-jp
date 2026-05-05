import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <p className="text-sm font-medium text-forge-ember">404</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">ページが見つかりません</h1>
        <p className="mt-4 text-forge-muted">URLをご確認のうえ、もう一度お試しください。</p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-md bg-forge-black px-5 py-3 text-white text-sm font-medium hover:bg-forge-ember transition"
        >
          トップへ戻る
        </Link>
      </div>
    </div>
  );
}
