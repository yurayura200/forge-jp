import { NextRequest, NextResponse } from "next/server";
import { createServerClient, createServiceRoleClient } from "@/lib/supabase/server";
import { encryptKey, previewKey } from "@/lib/api-gateway/encryption";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body: { provider?: string; secret?: string; display_name?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const provider = (body.provider || "").trim().toLowerCase();
  const secret = (body.secret || "").trim();
  const displayName = (body.display_name || "Default").trim();

  if (!["anthropic", "openai", "google", "other"].includes(provider)) {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
  }
  if (!secret || secret.length < 10) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 400 });
  }

  const adminSb = createServiceRoleClient();
  const { data: customer } = await adminSb
    .from("api_customers")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!customer) {
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  const encrypted = encryptKey(secret);
  const preview = previewKey(secret);

  // 同じ (customer, provider, name) があれば上書き
  await adminSb
    .from("customer_provider_keys")
    .delete()
    .eq("customer_id", customer.id)
    .eq("provider", provider)
    .eq("display_name", displayName);

  const { data: row } = await adminSb
    .from("customer_provider_keys")
    .insert({
      customer_id: customer.id,
      provider,
      encrypted_key: encrypted,
      key_preview: preview,
      display_name: displayName,
    })
    .select("id, provider, key_preview, display_name, created_at")
    .single();

  return NextResponse.json({ row });
}
