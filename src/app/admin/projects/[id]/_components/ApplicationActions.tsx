"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2 } from "lucide-react";

export function ApplicationActions({
  assignmentId,
  currentStatus,
  proposedPayout,
}: {
  assignmentId: string;
  currentStatus: string;
  proposedPayout: number | null;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function action(to: "accepted" | "declined") {
    let payout: number | null = null;
    if (to === "accepted") {
      const input = prompt(
        `採用する報酬額（円）を確認してください。空欄で希望額そのまま：`,
        proposedPayout?.toString() || ""
      );
      if (input === null) return;
      if (input.trim()) {
        const n = Number(input);
        if (!Number.isFinite(n) || n < 0) {
          alert("数値を入力してください");
          return;
        }
        payout = n;
      } else {
        payout = proposedPayout || null;
      }
    } else {
      if (!confirm("不採用にしますか？")) return;
    }

    setLoading(to);
    try {
      const res = await fetch(`/api/admin/assignments/${assignmentId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: to, monthly_payout: payout }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "失敗");
      }
      router.refresh();
    } catch (err) {
      alert(err instanceof Error ? err.message : "更新失敗");
    } finally {
      setLoading(null);
    }
  }

  if (currentStatus === "accepted") {
    return (
      <span className="shrink-0 inline-flex items-center gap-1 rounded bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
        <Check className="h-3 w-3" />
        採用済み
      </span>
    );
  }
  if (currentStatus === "declined") {
    return (
      <span className="shrink-0 inline-flex items-center gap-1 rounded bg-stone-100 px-2 py-1 text-xs font-medium text-stone-600">
        不採用
      </span>
    );
  }

  return (
    <div className="shrink-0 flex flex-col gap-2">
      <button
        type="button"
        onClick={() => action("accepted")}
        disabled={!!loading}
        className="inline-flex items-center gap-1.5 rounded-md bg-forge-ember px-3 py-1.5 text-xs font-medium text-white hover:bg-forge-black transition disabled:opacity-50"
      >
        {loading === "accepted" ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Check className="h-3 w-3" />
        )}
        採用
      </button>
      <button
        type="button"
        onClick={() => action("declined")}
        disabled={!!loading}
        className="inline-flex items-center gap-1.5 rounded-md border border-forge-border bg-white px-3 py-1.5 text-xs font-medium text-forge-muted hover:border-red-300 hover:text-red-600 transition disabled:opacity-50"
      >
        {loading === "declined" ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <X className="h-3 w-3" />
        )}
        不採用
      </button>
    </div>
  );
}
