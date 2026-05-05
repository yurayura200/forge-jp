import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  return user;
}

export async function isAdmin(userId: string): Promise<boolean> {
  const supabase = await createServerClient();
  const { data } = await supabase
    .from("admins")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();
  return !!data;
}

export async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) redirect("/");
  const ok = await isAdmin(user.id);
  if (!ok) redirect("/");
  return user;
}
