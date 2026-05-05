"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

export function SubscribeForm({
  tier,
  cta,
  featured,
}: {
  tier: "free" | "starter" | "growth" | "scale";
  cta: string;
  featured?: boolean;
}) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/api-access/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, tier }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `subscribe failed (${res.status})`);
      }
      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        // Free プラン → magic link 送信完了
        setError(null);
        alert("確認メールをお送りしました。メール内のリンクからログインしてください。");
        setEmail("");
        setLoading(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "登録に失敗しました");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="email"
        required
        placeholder="email@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full rounded-md border border-forge-border bg-white px-3 py-2.5 text-sm focus:border-forge-ember focus:outline-none"
      />
      <button
        type="submit"
        disabled={loading}
        className={`group inline-flex w-full items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition disabled:opacity-60 ${
          featured
            ? "bg-forge-ember text-white hover:bg-forge-black"
            : "bg-forge-black text-white hover:bg-forge-ember"
        }`}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            処理中...
          </>
        ) : (
          <>
            {cta}
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </form>
  );
}
