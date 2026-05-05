import { NextResponse } from "next/server";
import { inquirySchema } from "@/lib/validations/inquiry";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendEmail, INTERNAL_EMAIL } from "@/lib/email/resend";
import {
  inquiryReceivedTemplate,
  inquiryInternalTemplate,
} from "@/lib/email/templates";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "リクエストの形式が正しくありません" }, { status: 400 });
  }

  const parsed = inquirySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "入力内容を確認してください", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Persist inquiry via service role (RLS allows public inserts but we want full record)
  let inquiryId = "";
  try {
    const supabase = createServiceRoleClient();
    const { data: row, error } = await supabase
      .from("inquiries")
      .insert({
        source: "website",
        company_name: data.companyName,
        contact_name: data.contactName,
        contact_email: data.contactEmail,
        message: data.message,
        raw_payload: data,
      })
      .select("id")
      .single();

    if (error) {
      console.error("[inquiry] insert error:", error);
      return NextResponse.json(
        { error: "保存に失敗しました。時間をおいて再度お試しください。" },
        { status: 500 }
      );
    }

    inquiryId = row.id;
  } catch (err) {
    console.error("[inquiry] supabase exception:", err);
    return NextResponse.json({ error: "システムエラーが発生しました" }, { status: 500 });
  }

  // Send emails (best-effort; do not fail the request if email fails)
  const userEmail = inquiryReceivedTemplate(data);
  await sendEmail({
    to: data.contactEmail,
    subject: userEmail.subject,
    html: userEmail.html,
  });

  if (INTERNAL_EMAIL) {
    const adminEmail = inquiryInternalTemplate(data, inquiryId);
    await sendEmail({
      to: INTERNAL_EMAIL,
      subject: adminEmail.subject,
      html: adminEmail.html,
      replyTo: data.contactEmail,
    });
  }

  return NextResponse.json({ ok: true, id: inquiryId });
}
