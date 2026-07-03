import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SiteChrome } from "@/components/layout/SiteChrome";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  axes: ["opsz"],
});

export const metadata: Metadata = {
  title: {
    default: "Card Capital — 60 Card Games, One Table",
    template: "%s | Card Capital",
  },
  description:
    "Play 60 card games solo against AI or online with players worldwide. Western Saloon table, leaderboards, daily bonuses, and more.",
  metadataBase: new URL("https://cardcapitalapp.com"),
  openGraph: {
    title: "Card Capital — 60 Card Games, One Table",
    description:
      "Play 60 card games solo against AI or online with players worldwide.",
    siteName: "Card Capital",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.className} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <MotionProvider>
            <SiteChrome header={<Header />} footer={<Footer />}>
              {children}
            </SiteChrome>
          </MotionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
