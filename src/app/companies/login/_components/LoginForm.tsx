"use client";

import { useState } from "react";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: err } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/companies/dashboard`,
        },
      });
      if (err) throw err;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "送信に失敗しました");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="text-center py-6">
        <CheckCircle2 className="mx-auto h-12 w-12 text-forge-ember" />
        <p className="mt-4 text-base font-medium">メールをお送りしました</p>
        <p className="mt-2 text-sm text-forge-muted">
          {email} にログインリンクをお送りしました。
          <br />
          メール内のリンクをクリックしてください。
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
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
        className="group inline-flex w-full items-center justify-center gap-2 rounded-md bg-forge-black px-4 py-2.5 text-sm font-medium text-white hover:bg-forge-ember transition disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            送信中...
          </>
        ) : (
          <>
            ログインリンクを送る
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </>
        )}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </form>
  );
}
