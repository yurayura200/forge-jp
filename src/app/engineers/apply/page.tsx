import { Github } from "lucide-react";
import { createServerClient } from "@/lib/supabase/server";
import { EngineerApplyForm } from "@/components/forms/EngineerApplyForm";
import { GitHubSignInButton } from "./_components/GitHubSignInButton";

export const metadata = {
  title: "エンジニア登録",
  description: "Forge の AI 実装エンジニアとして登録する。",
  robots: { index: false, follow: false },
};

export default async function EngineerApplyPage() {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Already registered?
  let alreadyRegistered = false;
  if (user) {
    const { data } = await supabase
      .from("engineers")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();
    alreadyRegistered = !!data;
  }

  return (
    <section className="bg-forge-surface">
      <div className="container py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          <div className="mb-10 text-center">
            <p className="text-xs font-medium text-forge-ember">Engineers</p>
            <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
              エンジニア登録
            </h1>
            <p className="mt-3 text-sm text-forge-muted">
              GitHubアカウントで認証後、プロフィール情報を入力してください。
            </p>
          </div>

          <div className="rounded-lg border border-forge-border bg-white p-6 md:p-10">
            {!user ? (
              <div className="text-center py-10">
                <Github className="mx-auto h-10 w-10 text-forge-muted" />
                <p className="mt-4 text-sm text-forge-muted">
                  まずはGitHubアカウントで認証してください。
                </p>
                <div className="mt-6">
                  <GitHubSignInButton />
                </div>
              </div>
            ) : alreadyRegistered ? (
              <div className="text-center py-10">
                <h2 className="text-xl font-bold">既に登録されています</h2>
                <p className="mt-2 text-sm text-forge-muted">
                  運営チームで審査中です。結果はメールでご連絡します。
                </p>
              </div>
            ) : (
              <EngineerApplyForm
                defaultDisplayName={
                  (user.user_metadata?.full_name as string | undefined) ||
                  (user.user_metadata?.user_name as string | undefined) ||
                  ""
                }
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
