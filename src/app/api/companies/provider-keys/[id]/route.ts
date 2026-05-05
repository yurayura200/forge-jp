import { NextResponse } from "next/server";
import { createServerClient, createServiceRoleClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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
    return NextResponse.json({ error: "Customer not found" }, { status: 404 });
  }

  await adminSb
    .from("customer_provider_keys")
    .delete()
    .eq("id", id)
    .eq("customer_id", customer.id);

  return NextResponse.json({ ok: true });
}
