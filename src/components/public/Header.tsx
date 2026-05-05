import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-forge-border bg-white/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight">Forge</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm">
          <Link href="/for-companies" className="text-forge-muted hover:text-forge-black transition">
            サービス
          </Link>
          <Link href="/operate" className="text-forge-muted hover:text-forge-black transition">
            運用サービス
          </Link>
          <Link href="/about" className="text-forge-muted hover:text-forge-black transition">
            会社情報
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/inquiry"
            className="hidden sm:inline-flex rounded-md bg-forge-black px-4 py-2 text-white text-sm font-medium hover:bg-forge-ember transition"
          >
            相談する
          </Link>
          <Link
            href="/inquiry"
            className="sm:hidden rounded-md bg-forge-black px-3 py-2 text-white text-sm font-medium"
          >
            相談
          </Link>
        </div>
      </div>
    </header>
  );
}
