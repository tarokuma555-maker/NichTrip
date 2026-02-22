import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import localFont from "next/font/local";
import { routing } from "@/i18n/routing";
import { AuthProvider } from "@/components/AuthProvider";
import BottomNav from "@/components/BottomNav";
import SiteFooter from "@/components/SiteFooter";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";
import "../globals.css";

const GA_ID = "G-3MF57D8HTJ";

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
    manifest: "/manifest.json",
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
    alternates: {
      types: {
        "application/rss+xml": "/feed.xml",
      },
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#e53e3e",
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
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://anime-trips.com";

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AnimeTrips",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${baseUrl}/works?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang={locale}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </head>
      <body
        className={`${geistSans.variable} font-[family-name:var(--font-geist-sans)] antialiased pb-14`}
      >
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            {children}
            <SiteFooter />
            <BottomNav />
          </AuthProvider>
          <ServiceWorkerRegister />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
