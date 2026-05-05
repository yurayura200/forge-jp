import { NextResponse } from "next/server";
import { engineerApplySchema } from "@/lib/validations/engineer";
import { createServerClient, createServiceRoleClient } from "@/lib/supabase/server";
import { sendEmail, INTERNAL_EMAIL } from "@/lib/email/resend";
import {
  engineerAppliedTemplate,
  engineerAppliedInternalTemplate,
} from "@/lib/email/templates";

export const runtime = "nodejs";

export async function POST(request: Request) {
  // 1. Auth
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
  }

  // 2. Parse body
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエスト形式が不正です" }, { status: 400 });
  }
  const parsed = engineerApplySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "入力内容を確認してください", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }
  const data = parsed.data;

  // 3. Already registered?
  const { data: existing } = await supabase
    .from("engineers")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (existing) {
    return NextResponse.json({ error: "既に登録されています" }, { status: 409 });
  }

  // 4. Extract GitHub metadata
  const meta = (user.user_metadata || {}) as Record<string, unknown>;
  const githubUsername =
    (meta.user_name as string | undefined) ||
    (meta.preferred_username as string | undefined) ||
    "";
  const avatarUrl = (meta.avatar_url as string | undefined) || null;
  const email = user.email || (meta.email as string | undefined) || "";

  if (!githubUsername || !email) {
    return NextResponse.json(
      { error: "GitHubアカウント情報の取得に失敗しました。再ログインしてください。" },
      { status: 400 }
    );
  }

  // 5. Insert via service role (bypasses RLS for full record creation)
  const admin = createServiceRoleClient();
  const { data: engineer, error: insertError } = await admin
    .from("engineers")
    .insert({
      user_id: user.id,
      github_username: githubUsername,
      display_name: data.displayName,
      email,
      avatar_url: avatarUrl,
      bio: data.bio || null,
      skills: data.skills,
      ai_specialties: data.aiSpecialties,
      hourly_rate_min: data.hourlyRateMin || null,
      hourly_rate_max: data.hourlyRateMax || null,
      monthly_rate_min: data.monthlyRateMin || null,
      monthly_rate_max: data.monthlyRateMax || null,
      available_hours_per_week: data.availableHoursPerWeek,
      available_from: data.availableFrom || null,
      portfolio_urls: data.portfolioUrls,
      past_projects: data.pastProjects,
      accept_operate: data.acceptOperate,
      status: "pending",
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("[engineers] insert error:", insertError);
    if (insertError.code === "23505") {
      return NextResponse.json(
        { error: "このGitHubアカウントまたはメールは既に登録されています" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "登録に失敗しました" }, { status: 500 });
  }

  // 6. Notifications (best-effort)
  const userTpl = engineerAppliedTemplate(data.displayName);
  await sendEmail({ to: email, subject: userTpl.subject, html: userTpl.html });

  if (INTERNAL_EMAIL) {
    const adminTpl = engineerAppliedInternalTemplate({
      displayName: data.displayName,
      githubUsername,
      email,
      skills: data.skills,
      aiSpecialties: data.aiSpecialties,
      monthlyRateMin: data.monthlyRateMin,
      monthlyRateMax: data.monthlyRateMax,
      hoursPerWeek: data.availableHoursPerWeek,
      engineerId: engineer.id,
    });
    await sendEmail({ to: INTERNAL_EMAIL, subject: adminTpl.subject, html: adminTpl.html });
  }

  return NextResponse.json({ ok: true, id: engineer.id });
}
