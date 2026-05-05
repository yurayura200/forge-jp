import { NextRequest, NextResponse } from "next/server";
import { createServerClient, createServiceRoleClient } from "@/lib/supabase/server";
import { sendEmail, INTERNAL_EMAIL } from "@/lib/email/resend";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
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

  const { data: engineer } = await adminSb
    .from("engineers")
    .select("id, display_name, email, github_username")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!engineer) {
    return NextResponse.json(
      { error: "Engineer not registered" },
      { status: 403 }
    );
  }

  const { data: project } = await adminSb
    .from("projects")
    .select("id, title, status, current_phase, companies(company_name)")
    .eq("id", id)
    .in("status", ["qualified", "matching"])
    .maybeSingle();
  if (!project) {
    return NextResponse.json(
      { error: "Project not found or not open for applications" },
      { status: 404 }
    );
  }

  let body: {
    phase?: string;
    cover_letter?: string;
    proposed_payout?: number | null;
    proposed_hours_per_week?: number | null;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const phase = body.phase || project.current_phase || "build";
  const coverLetter = (body.cover_letter || "").trim();
  if (coverLetter.length < 50) {
    return NextResponse.json(
      { error: "Cover letter too short (min 50 chars)" },
      { status: 400 }
    );
  }

  // 既存応募チェック（unique constraint で防がれるが、明示エラーを返す）
  const { data: existing } = await adminSb
    .from("assignments")
    .select("id")
    .eq("project_id", id)
    .eq("engineer_id", engineer.id)
    .eq("phase", phase)
    .maybeSingle();
  if (existing) {
    return NextResponse.json(
      { error: "Already applied to this project / phase" },
      { status: 409 }
    );
  }

  const { data: created, error } = await adminSb
    .from("assignments")
    .insert({
      project_id: id,
      engineer_id: engineer.id,
      phase,
      status: "proposed",
      cover_letter: coverLetter,
      proposed_payout: body.proposed_payout ?? null,
      proposed_hours_per_week: body.proposed_hours_per_week ?? null,
    })
    .select("id")
    .single();
  if (error || !created) {
    console.error("[apply] insert error:", error);
    return NextResponse.json(
      { error: "Failed to record application" },
      { status: 500 }
    );
  }

  // Yura に通知（運営に新規応募があった旨）
  if (INTERNAL_EMAIL) {
    const company = Array.isArray(project.companies)
      ? project.companies[0]
      : project.companies;
    const subject = `[Forge 新規応募] ${engineer.display_name} → ${project.title}`;
    const html = `
      <h2>新しい案件応募</h2>
      <p><strong>案件：</strong>${project.title}（${company?.company_name || "—"}）</p>
      <p><strong>応募者：</strong>${engineer.display_name}（@${engineer.github_username}）</p>
      <p><strong>希望報酬：</strong>${body.proposed_payout ? `¥${body.proposed_payout.toLocaleString()}` : "—"}</p>
      <p><strong>稼働：</strong>${body.proposed_hours_per_week || "—"} 時間/週</p>
      <hr />
      <p><strong>応募メッセージ：</strong></p>
      <p style="white-space: pre-wrap;">${coverLetter.replace(/[<>&]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" })[c] || c)}</p>
      <hr />
      <p>
        <a href="https://forge.komugi-ai.jp/admin/projects/${id}">/admin/projects/${id}</a>
        で承認・不承認を判断してください。
      </p>
    `;
    await sendEmail({
      to: INTERNAL_EMAIL,
      subject,
      html,
      replyTo: engineer.email || undefined,
    });
  }

  return NextResponse.json({ ok: true, assignment_id: created.id });
}
