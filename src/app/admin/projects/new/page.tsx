import Link from "next/link";

export default function NewProjectPage() {
  return (
    <div>
      <Link href="/admin/projects" className="text-sm text-forge-muted hover:text-forge-black">
        ← 一覧に戻る
      </Link>
      <h1 className="mt-4 text-2xl font-bold tracking-tight">新規案件の作成</h1>
      <p className="text-sm text-forge-muted mt-1">
        Phase 1 では問い合わせ詳細から案件への変換フローで作成します。直接作成フォームは Phase 1.5 で実装予定。
      </p>
      <div className="mt-8 rounded-lg border border-dashed border-forge-border bg-white p-10 text-center">
        <p className="text-sm text-forge-muted">
          案件作成フォーム（Claude Code側で実装してください）。
          companies テーブルへの会社作成 → projects テーブルへの案件作成のフローを想定。
        </p>
      </div>
    </div>
  );
}
