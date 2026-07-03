import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
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
    <html lang="en" className={`${inter.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
