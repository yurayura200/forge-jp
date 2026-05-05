import { requireAdmin } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export const metadata = {
  title: "管理画面",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 border-r border-forge-border bg-white sticky top-0 h-screen overflow-y-auto">
        <AdminNav />
      </aside>
      <main className="flex-1 bg-forge-surface">
        <div className="px-8 py-8">{children}</div>
      </main>
    </div>
  );
}
