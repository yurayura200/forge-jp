"use client";

import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

export function SubscribeButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubscribe() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/engineers/subscribe", {
        method: "POST",
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `subscribe failed (${res.status})`);
      }
      const { url } = await res.json();
      if (url) {
        window.location.href = url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "決済画面の起動に失敗しました");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleSubscribe}
        disabled={loading}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-md bg-forge-ember px-6 py-3.5 text-white font-medium hover:bg-forge-black transition disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            処理中...
          </>
        ) : (
          <>
            ¥3,000/月で Premium 登録
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </button>
      {error && (
        <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
      )}
    </>
  );
}
