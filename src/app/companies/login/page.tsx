import { LoginForm } from "./_components/LoginForm";

export const metadata = {
  title: "ログイン — Forge Companies",
  robots: { index: false, follow: false },
};

export default function CompanyLoginPage() {
  return (
    <section className="bg-forge-surface min-h-[80vh]">
      <div className="container py-16 md:py-24">
        <div className="max-w-md mx-auto">
          <div className="mb-10 text-center">
            <p className="text-xs font-medium text-forge-ember">Companies</p>
            <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
              ダッシュボードにログイン
            </h1>
            <p className="mt-3 text-sm text-forge-muted">
              登録済みのメールアドレスを入力してください。<br />
              ログイン用のリンクをお送りします。
            </p>
          </div>

          <div className="rounded-xl border border-forge-border bg-white p-6 md:p-8">
            <LoginForm />
          </div>

          <p className="mt-6 text-center text-sm text-forge-muted">
            アカウント未登録の場合は{" "}
            <a href="/api-access" className="text-forge-ember hover:underline">
              プランを選んで登録
            </a>{" "}
            してください。
          </p>
        </div>
      </div>
    </section>
  );
}
