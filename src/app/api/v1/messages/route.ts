import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest, getProviderKey, logUsage } from "@/lib/api-gateway/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const ANTHROPIC_BASE = "https://api.anthropic.com/v1/messages";

/**
 * Anthropic /v1/messages 互換のプロキシ。
 * 顧客は forge.komugi-ai.jp/api/v1/messages を api.anthropic.com/v1/messages の
 * 代わりに叩くだけで観測ダッシュボードが付く。
 *
 * Authorization: Bearer forge_live_xxx
 * （顧客が事前に登録した Anthropic API key で upstream を叩く）
 */
export async function POST(req: NextRequest) {
  const startedAt = Date.now();
  const auth = await authenticateRequest(req);

  if (!auth.ok) {
    const status =
      auth.error.code === "missing_key" || auth.error.code === "invalid_key"
        ? 401
        : auth.error.code === "quota_exceeded"
          ? 429
          : 403;
    return NextResponse.json(
      { error: { type: auth.error.code, message: auth.error.message } },
      { status }
    );
  }

  const { customer_id, api_key_id } = auth.data;

  // upstream key 取得
  const upstreamKey = await getProviderKey(customer_id, "anthropic");
  if (!upstreamKey) {
    await logUsage({
      customer_id,
      api_key_id,
      provider: "anthropic",
      endpoint: "/v1/messages",
      status_code: 412,
      duration_ms: Date.now() - startedAt,
      error: "no_provider_key",
    });
    return NextResponse.json(
      {
        error: {
          type: "no_provider_key",
          message:
            "Anthropic API key not configured. Add it at https://forge.komugi-ai.jp/companies/dashboard",
        },
      },
      { status: 412 }
    );
  }

  // body をそのまま転送
  const body = await req.text();
  let model: string | undefined;
  try {
    model = (JSON.parse(body) as { model?: string }).model;
  } catch {}

  // upstream 呼び出し
  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(ANTHROPIC_BASE, {
      method: "POST",
      headers: {
        "x-api-key": upstreamKey,
        "anthropic-version":
          req.headers.get("anthropic-version") || "2023-06-01",
        "content-type": "application/json",
      },
      body,
    });
  } catch (err) {
    await logUsage({
      customer_id,
      api_key_id,
      provider: "anthropic",
      model,
      endpoint: "/v1/messages",
      status_code: 502,
      duration_ms: Date.now() - startedAt,
      error: err instanceof Error ? err.message : "upstream_failed",
    });
    return NextResponse.json(
      {
        error: { type: "upstream_failed", message: "Failed to reach Anthropic" },
      },
      { status: 502 }
    );
  }

  const respText = await upstreamRes.text();
  let inputTokens: number | undefined;
  let outputTokens: number | undefined;
  try {
    const parsed = JSON.parse(respText);
    inputTokens = parsed?.usage?.input_tokens;
    outputTokens = parsed?.usage?.output_tokens;
  } catch {}

  // 使用量ログ
  void logUsage({
    customer_id,
    api_key_id,
    provider: "anthropic",
    model,
    endpoint: "/v1/messages",
    status_code: upstreamRes.status,
    input_tokens: inputTokens,
    output_tokens: outputTokens,
    duration_ms: Date.now() - startedAt,
  });

  // upstream の response をそのまま返す（Anthropic 互換）
  return new NextResponse(respText, {
    status: upstreamRes.status,
    headers: {
      "content-type":
        upstreamRes.headers.get("content-type") || "application/json",
      "x-forge-customer": customer_id,
      "x-forge-quota-remaining": String(
        Math.max(0, auth.data.monthly_quota - auth.data.current_calls - 1)
      ),
    },
  });
}

export async function GET() {
  return NextResponse.json(
    {
      service: "Forge API Gateway",
      endpoints: {
        messages: "POST /api/v1/messages (Anthropic compatible)",
      },
      docs: "https://forge.komugi-ai.jp/api-access",
    },
    { status: 200 }
  );
}
