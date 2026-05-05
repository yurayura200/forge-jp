import { NextResponse } from "next/server";
import { createServerClient, createServiceRoleClient } from "@/lib/supabase/server";
import { generateApiKey } from "@/lib/api-gateway/encryption";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const adminSb = createServiceRoleClient();
  const { data: customer } = await adminSb
    .from("api_customers")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!customer) {
    return NextResponse.json(
      { error: "Customer not found" },
      { status: 404 }
    );
  }

  const { key, prefix, hash } = generateApiKey();
  const { data: row } = await adminSb
    .from("api_keys")
    .insert({
      customer_id: customer.id,
      key_prefix: prefix,
      key_hash: hash,
      display_name: "Default",
      status: "active",
    })
    .select("id, key_prefix, display_name, status, last_used_at, created_at")
    .single();

  return NextResponse.json({ key, row });
}
