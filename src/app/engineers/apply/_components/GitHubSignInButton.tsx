"use client";

import { useState } from "react";
import { Github } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function GitHubSignInButton() {
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    const supabase = createClient();
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_SITE_URL || "";
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${origin}/api/auth/callback?next=/engineers/apply`,
        scopes: "read:user user:email",
      },
    });
    if (error) {
      console.error("[oauth] github error:", error);
      setLoading(false);
    }
    // On success the browser is redirected to GitHub; no further state changes here.
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="inline-flex items-center justify-center gap-2 rounded-md bg-forge-black px-6 py-3 text-white font-medium hover:bg-forge-ember transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Github className="h-4 w-4" />
      {loading ? "GitHubに接続中..." : "GitHubで認証する"}
    </button>
  );
}
