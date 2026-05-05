import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const nextParam = url.searchParams.get("next") || "/engineers/apply";
  // Avoid open redirect: only allow same-site relative paths
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//")
    ? nextParam
    : "/engineers/apply";

  if (!code) {
    return NextResponse.redirect(new URL("/?auth_error=missing_code", request.url));
  }

  const supabase = await createServerClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback] exchange error:", error);
    return NextResponse.redirect(new URL("/?auth_error=exchange_failed", request.url));
  }

  return NextResponse.redirect(new URL(next, request.url));
}
