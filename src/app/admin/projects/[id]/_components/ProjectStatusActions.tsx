"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff, Wrench, X, Check } from "lucide-react";

const TARGET_STATUSES: Array<{
  value: string;
  label: string;
  desc: string;
  icon: typeof Eye;
  className: string;
}> = [
  {
    value: "qualified",
    label: "公開する",
    desc: "/engineers/jobs に表示、エンジニアが応募可能",
    icon: Eye,
    className: "bg-forge-ember text-white hover:bg-forge-black",
  },
  {
    value: "matching",
    label: "応募受付中",
    desc: "公開 + 「応募受付中」バッジ表示",
    icon: Eye,
    className: "bg-emerald-600 text-white hover:bg-emerald-700",
  },
  {
    value: "in_progress",
    label: "Yura 自身でやる",
    desc: "公開しない、Yura ソロ進行",
    icon: Wrench,
    className: "border-2 border-forge-black text-forge-black hover:bg-forge-black hover:text-white",
  },
  {
    value: "inquiry",
    label: "下書きに戻す",
    desc: "/engineers から非表示",
    icon: EyeOff,
    className: "border border-forge-border text-forge-muted hover:bg-forge-surface",
  },
  {
    value: "completed",
    label: "完了",
    desc: "案件終了",
    icon: Check,
    className: "border border-forge-border text-forge-muted hover:bg-forge-surface",
  },
  {
    value: "cancelled",
    label: "中止",
    desc: "案件キャンセル",
    icon: X,
    className: "border border-forge-border text-red-600 hover:bg-red-50",
  },
];

export function ProjectStatusActions({
  projectId,
  currentStatus,
}: {
  projectId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function update(toStatus: string) {
    if (!confirm(`status を "${toStatus}" に変更します。続行しますか？`)) return;
    setLoading(toStatus);
    setError(null);
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/status`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: toStatus }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `status update failed (${res.status})`);
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新失敗");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="rounded-lg border border-forge-border bg-white p-4">
      <p className="text-sm font-semibold">
        ステータス操作（現在：<span className="text-forge-ember">{currentStatus}</span>）
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {TARGET_STATUSES.filter((s) => s.value !== currentStatus).map((s) => (
          <button
            key={s.value}
            type="button"
            onClick={() => update(s.value)}
            disabled={!!loading}
            title={s.desc}
            className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${s.className}`}
          >
            {loading === s.value ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <s.icon className="h-4 w-4" />
            )}
            {s.label}
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
