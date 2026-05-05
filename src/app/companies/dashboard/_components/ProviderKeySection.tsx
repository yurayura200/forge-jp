"use client";

import { useState } from "react";
import { Lock, Plus, Trash2, Loader2, Eye, EyeOff } from "lucide-react";

type ProviderKey = {
  id: string;
  provider: string;
  key_preview: string | null;
  display_name: string;
  created_at: string;
};

export function ProviderKeySection({
  customerId,
  initialKeys,
}: {
  customerId: string;
  initialKeys: ProviderKey[];
}) {
  const [keys, setKeys] = useState<ProviderKey[]>(initialKeys);
  const [adding, setAdding] = useState(false);
  const [provider, setProvider] = useState("anthropic");
  const [secret, setSecret] = useState("");
  const [showSecret, setShowSecret] = useState(false);
  const [saving, setSaving] = useState(false);

  async function save() {
    if (!secret) return;
    setSaving(true);
    try {
      const res = await fetch("/api/companies/provider-keys", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ provider, secret }),
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || "save failed");
      setKeys((prev) => [j.row, ...prev]);
      setSecret("");
      setAdding(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "保存に失敗");
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: string) {
    if (!confirm("この provider key を削除しますか？")) return;
    const res = await fetch(`/api/companies/provider-keys/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setKeys((prev) => prev.filter((k) => k.id !== id));
    }
  }

  void customerId;

  return (
    <div className="mt-10 rounded-xl border border-forge-border bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-base font-bold flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Provider API Keys（暗号化保管）
          </p>
          <p className="mt-1 text-xs text-forge-muted">
            Anthropic / OpenAI など、実際の LLM 呼び出しに使う key を登録。AES-256-GCM で暗号化保存。
          </p>
        </div>
        <button
          type="button"
          onClick={() => setAdding(true)}
          disabled={adding}
          className="inline-flex items-center gap-2 rounded-md border-2 border-forge-border bg-white px-4 py-2 text-sm font-medium hover:border-forge-black transition disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          provider key を追加
        </button>
      </div>

      {adding && (
        <div className="mt-5 rounded-lg border border-forge-border bg-forge-surface p-4 space-y-3">
          <div className="flex gap-3">
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
              className="rounded-md border border-forge-border bg-white px-3 py-2 text-sm"
            >
              <option value="anthropic">Anthropic</option>
              <option value="openai">OpenAI</option>
              <option value="google">Google</option>
              <option value="other">Other</option>
            </select>
            <div className="flex-1 relative">
              <input
                type={showSecret ? "text" : "password"}
                placeholder={provider === "anthropic" ? "sk-ant-..." : "API key"}
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="w-full rounded-md border border-forge-border bg-white px-3 py-2 pr-9 text-sm font-mono"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-forge-muted hover:text-forge-black"
              >
                {showSecret ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setSecret("");
              }}
              className="text-sm text-forge-muted hover:text-forge-black"
            >
              キャンセル
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving || !secret}
              className="inline-flex items-center gap-2 rounded-md bg-forge-ember px-4 py-2 text-white text-sm font-medium disabled:opacity-60"
            >
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              保存
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 space-y-2">
        {keys.length === 0 && !adding && (
          <p className="text-sm text-forge-muted">
            まだ provider key がありません。Forge gateway 経由で API call するには 1 件以上必要です。
          </p>
        )}
        {keys.map((k) => (
          <div
            key={k.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-forge-border bg-white p-3"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium capitalize">{k.provider}</span>
                <code className="text-xs text-forge-muted">{k.key_preview}</code>
              </div>
              <p className="text-xs text-forge-muted truncate">
                {k.display_name} · 登録 {new Date(k.created_at).toLocaleDateString("ja-JP")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => remove(k.id)}
              className="shrink-0 inline-flex items-center gap-1 rounded p-1.5 text-forge-muted hover:bg-red-50 hover:text-red-600 transition"
              title="削除"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
