import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { AuthProvider } from "@/components/AuthProvider";
import BottomNav from "@/components/BottomNav";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "AnimeTrips - アニメ聖地巡礼プラン",
  description:
    "アニメ聖地巡礼・パワースポット・B級グルメ。テーマを選ぶだけで、あなただけの旅を作ります。",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} font-[family-name:var(--font-geist-sans)] antialiased pb-14`}>
        <AuthProvider>
          {children}
          <BottomNav />
        </AuthProvider>
      </body>
    </html>
  );
}
