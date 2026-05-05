import { createServiceRoleClient } from "@/lib/supabase/server";
import { hashApiKey } from "./encryption";

export type AuthedCustomer = {
  customer_id: string;
  api_key_id: string;
  plan: "free" | "starter" | "growth" | "scale" | "enterprise";
  monthly_quota: number;
  current_calls: number;
};

export type AuthError =
  | { code: "missing_key"; message: string }
  | { code: "invalid_key"; message: string }
  | { code: "revoked_key"; message: string }
  | { code: "expired_key"; message: string }
  | { code: "quota_exceeded"; message: string };

/**
 * Authorization: Bearer forge_live_xxx を検証して、
 * customer + plan + 当月使用量を返す。
 */
export async function authenticateRequest(
  req: Request
): Promise<{ ok: true; data: AuthedCustomer } | { ok: false; error: AuthError }> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
    return {
      ok: false,
      error: { code: "missing_key", message: "Missing Authorization: Bearer header" },
    };
  }
  const token = authHeader.slice(7).trim();
  if (!token.startsWith("forge_live_")) {
    return {
      ok: false,
      error: { code: "invalid_key", message: "Invalid API key format" },
    };
  }

  const adminSb = createServiceRoleClient();
  const hash = hashApiKey(token);

  const { data: keyRow } = await adminSb
    .from("api_keys")
    .select("id, customer_id, status, expires_at")
    .eq("key_hash", hash)
    .maybeSingle();

  if (!keyRow) {
    return { ok: false, error: { code: "invalid_key", message: "Unknown API key" } };
  }
  if (keyRow.status === "revoked") {
    return { ok: false, error: { code: "revoked_key", message: "API key revoked" } };
  }
  if (keyRow.expires_at && new Date(keyRow.expires_at) < new Date()) {
    return { ok: false, error: { code: "expired_key", message: "API key expired" } };
  }

  const { data: customer } = await adminSb
    .from("api_customers")
    .select("id, current_plan")
    .eq("id", keyRow.customer_id)
    .maybeSingle();

  if (!customer) {
    return {
      ok: false,
      error: { code: "invalid_key", message: "Customer not found" },
    };
  }

  // プランの quota
  const { data: plan } = await adminSb
    .from("api_plans")
    .select("monthly_request_quota")
    .eq("tier", customer.current_plan)
    .maybeSingle();

  const monthlyQuota = plan?.monthly_request_quota ?? 0;

  // 当月の使用量
  const { data: usage } = await adminSb
    .from("api_usage_current_month")
    .select("total_calls")
    .eq("customer_id", customer.id)
    .maybeSingle();

  const currentCalls = usage?.total_calls ?? 0;

  if (customer.current_plan !== "enterprise" && currentCalls >= monthlyQuota) {
    return {
      ok: false,
      error: {
        code: "quota_exceeded",
        message: `Monthly quota exceeded (${currentCalls}/${monthlyQuota}). Upgrade your plan at https://forge.komugi-ai.jp/api-access`,
      },
    };
  }

  // 非同期で last_used_at 更新
  void adminSb
    .from("api_keys")
    .update({ last_used_at: new Date().toISOString() })
    .eq("id", keyRow.id);

  return {
    ok: true,
    data: {
      customer_id: customer.id,
      api_key_id: keyRow.id,
      plan: customer.current_plan,
      monthly_quota: monthlyQuota,
      current_calls: currentCalls,
    },
  };
}

export async function getProviderKey(
  customerId: string,
  provider: "anthropic" | "openai" | "google" | "other"
): Promise<string | null> {
  const adminSb = createServiceRoleClient();
  const { data } = await adminSb
    .from("customer_provider_keys")
    .select("encrypted_key")
    .eq("customer_id", customerId)
    .eq("provider", provider)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!data?.encrypted_key) return null;

  const { decryptKey } = await import("./encryption");
  // Supabase returns bytea as base64-encoded string by default
  const blob = Buffer.from(data.encrypted_key as unknown as string, "base64");
  return decryptKey(blob);
}

export async function logUsage(params: {
  customer_id: string;
  api_key_id: string;
  provider: "anthropic" | "openai" | "google" | "other";
  model?: string;
  endpoint: string;
  status_code: number;
  input_tokens?: number;
  output_tokens?: number;
  duration_ms: number;
  error?: string;
}) {
  const adminSb = createServiceRoleClient();
  await adminSb.from("api_usage_logs").insert({
    customer_id: params.customer_id,
    api_key_id: params.api_key_id,
    provider: params.provider,
    model: params.model,
    endpoint: params.endpoint,
    status_code: params.status_code,
    input_tokens: params.input_tokens,
    output_tokens: params.output_tokens,
    duration_ms: params.duration_ms,
    error: params.error,
  });
}
