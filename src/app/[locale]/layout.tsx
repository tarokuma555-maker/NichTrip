import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import { routing } from "@/i18n/routing";
import { AuthProvider } from "@/components/AuthProvider";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";
import "../globals.css";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export async function generateMetadata({
  params: { locale },
}: Props): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: "Metadata" });
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://anime-trips.com";
  const title = t("title");
  const description = t("description");
  const ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(title)}`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    verification: {
      google: "sxSHZJYJdGnJhPy4w5qFm7rXmGOM-LI4cCjvDHqR0jk",
    },
    openGraph: {
      title,
      description,
      url: baseUrl,
      siteName: "AnimeTrips",
      images: [{ url: ogImage, width: 1200, height: 630 }],
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function LocaleLayout({
  children,
  params: { locale },
}: Props) {
  // Validate the locale
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} font-[family-name:var(--font-geist-sans)] antialiased pb-14`}
      >
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            {children}
            <SiteFooter />
            <BottomNav />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
