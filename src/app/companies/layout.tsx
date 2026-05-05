import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function CompaniesLayout({
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
