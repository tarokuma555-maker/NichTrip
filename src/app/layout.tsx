import type { Metadata } from "next";
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
  title: "AnimeTrips - AIがつくるアニメ聖地巡礼プラン",
  description:
    "アニメ聖地巡礼・パワースポット・B級グルメ。テーマを選ぶだけで、AIがあなただけの旅を作ります。",
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
