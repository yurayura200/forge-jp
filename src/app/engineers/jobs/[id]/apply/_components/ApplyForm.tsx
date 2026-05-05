"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

export function ApplyForm({
  projectId,
  phase,
  engineerName,
}: {
  projectId: string;
  phase: string;
  engineerName: string;
}) {
  const router = useRouter();
  const [coverLetter, setCoverLetter] = useState("");
  const [proposedPayout, setProposedPayout] = useState("");
  const [hoursPerWeek, setHoursPerWeek] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (coverLetter.trim().length < 50) {
      setError("応募メッセージは 50 文字以上で入力してください");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/engineers/jobs/${projectId}/apply`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          phase,
          cover_letter: coverLetter,
          proposed_payout: proposedPayout ? Number(proposedPayout) : null,
          proposed_hours_per_week: hoursPerWeek ? Number(hoursPerWeek) : null,
        }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "応募に失敗しました");
      router.push(`/engineers/jobs/${projectId}/apply?applied=1`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "応募に失敗しました");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium">
          応募者
        </label>
        <p className="mt-1 rounded-md border border-forge-border bg-forge-surface px-3 py-2 text-sm">
          {engineerName}
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium">
          応募メッセージ <span className="text-forge-ember">*</span>
        </label>
        <p className="mt-1 text-xs text-forge-muted">
          自己紹介・関連経験・このプロジェクトでどう貢献できるか（最低 50 文字）
        </p>
        <textarea
          required
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          rows={8}
          placeholder="例：◯◯業界で 3 年、Claude API + RAG の実装経験あります。GitHub に類似プロジェクトの実績ありますのでご確認ください。本案件では特に要件 X について具体的なアプローチを提案できます..."
          className="mt-2 w-full rounded-md border border-forge-border bg-white px-3 py-2 text-sm focus:border-forge-ember focus:outline-none"
        />
        <p className="mt-1 text-xs text-forge-muted text-right tabular-nums">
          {coverLetter.length} 文字
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium">
            希望報酬（円・税抜）
          </label>
          <p className="mt-1 text-xs text-forge-muted">
            一括 / Build フェーズの場合は総額
          </p>
          <div className="mt-2 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-forge-muted">
              ¥
            </span>
            <input
              type="number"
              min="0"
              step="10000"
              placeholder="500000"
              value={proposedPayout}
              onChange={(e) => setProposedPayout(e.target.value)}
              className="w-full rounded-md border border-forge-border bg-white pl-7 pr-3 py-2 text-sm tabular-nums focus:border-forge-ember focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">
            稼働可能時間（時間/週）
          </label>
          <p className="mt-1 text-xs text-forge-muted">参考値</p>
          <input
            type="number"
            min="0"
            max="80"
            placeholder="20"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(e.target.value)}
            className="mt-2 w-full rounded-md border border-forge-border bg-white px-3 py-2 text-sm tabular-nums focus:border-forge-ember focus:outline-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || coverLetter.trim().length < 50}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-md bg-forge-ember px-6 py-3 text-white font-medium hover:bg-forge-black transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            送信中...
          </>
        ) : (
          <>
            応募する
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </button>
      {error && <p className="text-sm text-red-600">{error}</p>}
    </form>
  );
}
