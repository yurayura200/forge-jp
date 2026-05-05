"use client";

import { useState } from "react";
import { Copy, Check, Key, Plus, Trash2, Loader2 } from "lucide-react";

type ApiKey = {
  id: string;
  key_prefix: string;
  display_name: string;
  status: string;
  last_used_at: string | null;
  created_at: string;
};

export function ApiKeySection({
  customerId,
  initialKeys,
}: {
  customerId: string;
  initialKeys: ApiKey[];
}) {
  const [keys, setKeys] = useState<ApiKey[]>(initialKeys);
  const [creating, setCreating] = useState(false);
  const [newlyCreated, setNewlyCreated] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function createKey() {
    setCreating(true);
    setNewlyCreated(null);
    try {
      const res = await fetch("/api/companies/keys", { method: "POST" });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "key 作成失敗");
      setKeys((prev) => [j.row, ...prev]);
      setNewlyCreated(j.key);
    } catch (err) {
      alert(err instanceof Error ? err.message : "失敗しました");
    } finally {
      setCreating(false);
    }
  }

  async function revokeKey(id: string) {
    if (!confirm("この API key を無効化しますか？復元できません。")) return;
    const res = await fetch(`/api/companies/keys/${id}`, { method: "DELETE" });
    if (res.ok) {
      setKeys((prev) =>
        prev.map((k) => (k.id === id ? { ...k, status: "revoked" } : k))
      );
    }
  }

  async function copyToClipboard(text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  void customerId;

  return (
    <div className="mt-10 rounded-xl border border-forge-border bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-base font-bold flex items-center gap-2">
            <Key className="h-4 w-4" />
            Forge API Keys
          </p>
          <p className="mt-1 text-xs text-forge-muted">
            ゲートウェイ呼び出し用。発行直後の 1 回しか full key を表示しません。
          </p>
        </div>
        <button
          type="button"
          onClick={createKey}
          disabled={creating}
          className="inline-flex items-center gap-2 rounded-md bg-forge-black px-4 py-2 text-white text-sm font-medium hover:bg-forge-ember transition disabled:opacity-60"
        >
          {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          新しい key を発行
        </button>
      </div>

      {newlyCreated && (
        <div className="mt-5 rounded-lg border-2 border-forge-ember bg-orange-50 p-4">
          <p className="text-sm font-medium text-forge-black">
            新しい API key（一度だけ表示）：
          </p>
          <div className="mt-3 flex items-center gap-2 rounded bg-white border border-forge-border p-3">
            <code className="flex-1 text-sm break-all">{newlyCreated}</code>
            <button
              type="button"
              onClick={() => copyToClipboard(newlyCreated)}
              className="shrink-0 inline-flex items-center gap-1 rounded bg-forge-black px-3 py-1.5 text-xs text-white hover:bg-forge-ember transition"
            >
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="mt-3 text-xs text-forge-muted">
            このページを離れると再表示できません。安全な場所に保存してください。
          </p>
        </div>
      )}

      <div className="mt-6 space-y-2">
        {keys.length === 0 && (
          <p className="text-sm text-forge-muted">まだ key がありません。「新しい key を発行」をクリック。</p>
        )}
        {keys.map((k) => (
          <div
            key={k.id}
            className={`flex items-center justify-between gap-3 rounded-lg border p-3 ${
              k.status === "active"
                ? "border-forge-border bg-white"
                : "border-forge-border bg-forge-surface opacity-60"
            }`}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm">
                <code className="font-mono text-xs">{k.key_prefix}...</code>
                <span
                  className={`text-xs px-1.5 py-0.5 rounded ${
                    k.status === "active"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {k.status}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-forge-muted truncate">
                {k.display_name} · 作成 {new Date(k.created_at).toLocaleDateString("ja-JP")}
                {k.last_used_at &&
                  ` · 最終使用 ${new Date(k.last_used_at).toLocaleDateString("ja-JP")}`}
              </p>
            </div>
            {k.status === "active" && (
              <button
                type="button"
                onClick={() => revokeKey(k.id)}
                className="shrink-0 inline-flex items-center gap-1 rounded p-1.5 text-forge-muted hover:bg-red-50 hover:text-red-600 transition"
                title="無効化"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
