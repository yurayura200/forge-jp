import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";

// /engineers/* は招待制。検索エンジンに載せない。
export const metadata = {
  robots: { index: false, follow: false },
};

export default function EngineersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
