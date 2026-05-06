import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const notoJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-jp",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://forge.jp";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Forge — AIを、動かし続ける。",
    template: "%s | Forge",
  },
  description:
    "構築だけじゃない。評価・運用・進化まで。日本のAIインフラを、Forgeから。生成AI・LLM・RAG・Agentの実装から運用まで一気通貫で提供。",
  keywords: [
    "AI実装",
    "生成AI",
    "LLM",
    "RAG",
    "AIエージェント",
    "AI運用",
    "AI受託開発",
    "Forge",
  ],
  authors: [{ name: "Forge" }],
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: SITE_URL,
    siteName: "Forge",
    title: "Forge — AIを、動かし続ける。",
    description:
      "構築だけじゃない。評価・運用・進化まで。日本のAIインフラを、Forgeから。",
    images: [
      {
        url: "/og/forge-ai-gap.png",
        width: 1200,
        height: 630,
        alt: "Forge — AI 導入率の日米格差。Forge は需給ギャップを埋めます",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Forge — AIを、動かし続ける。",
    description:
      "構築だけじゃない。評価・運用・進化まで。日本のAIインフラを、Forgeから。",
    images: ["/og/forge-ai-gap.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={`${inter.variable} ${notoJp.variable}`}>
      <body className="min-h-screen bg-background font-sans">{children}</body>
    </html>
  );
}
