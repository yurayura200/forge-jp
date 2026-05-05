"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Briefcase,
  Users,
  Building2,
  Repeat,
  Banknote,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "ダッシュボード", icon: LayoutDashboard, exact: true },
  { href: "/admin/inquiries", label: "問い合わせ", icon: Inbox },
  { href: "/admin/projects", label: "案件", icon: Briefcase },
  { href: "/admin/engineers", label: "エンジニア", icon: Users },
  { href: "/admin/companies", label: "クライアント", icon: Building2 },
  { href: "/admin/subscriptions", label: "Operate契約", icon: Repeat },
  { href: "/admin/finance", label: "財務", icon: Banknote },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-4 text-sm">
      <div className="px-2 pb-3 mb-2 border-b border-forge-border">
        <Link href="/" className="font-bold tracking-tight">
          Forge <span className="text-forge-ember">Admin</span>
        </Link>
      </div>
      {NAV.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2 rounded-md px-3 py-2 transition",
              active
                ? "bg-forge-black text-white"
                : "text-forge-muted hover:bg-forge-surface hover:text-forge-black"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
