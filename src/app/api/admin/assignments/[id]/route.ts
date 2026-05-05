import { NextRequest, NextResponse } from "next/server";
import { createServerClient, createServiceRoleClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const VALID_STATUSES = [
  "proposed",
  "accepted",
  "declined",
  "in_progress",
  "completed",
];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "auth" }, { status: 401 });
  if (!(await isAdmin(user.id))) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  let body: { status?: string; monthly_payout?: number | null };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid json" }, { status: 400 });
  }

  if (!body.status || !VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: "invalid status" }, { status: 400 });
  }

  const update: Record<string, unknown> = {
    status: body.status,
    responded_at: new Date().toISOString(),
  };
  if (body.monthly_payout !== undefined) {
    update.monthly_payout = body.monthly_payout;
  }
  if (body.status === "in_progress") {
    update.started_at = new Date().toISOString();
  } else if (body.status === "completed") {
    update.completed_at = new Date().toISOString();
  }

  const adminSb = createServiceRoleClient();
  const { error, data: updated } = await adminSb
    .from("assignments")
    .update(update)
    .eq("id", id)
    .select("project_id, engineer_id")
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // 採用された場合は project の status を matching に進める
  if (body.status === "accepted" && updated?.project_id) {
    await adminSb
      .from("projects")
      .update({ status: "matching" })
      .eq("id", updated.project_id)
      .in("status", ["qualified", "inquiry"]);
  }

  return NextResponse.json({ ok: true });
}
