import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import PricingContent from "./PricingContent";
import UserMenu from "@/components/UserMenu";
import LocaleSwitcher from "@/components/LocaleSwitcher";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://anime-trips.com";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  const localeUrl = (loc: string) =>
    loc === "ja" ? `${BASE_URL}/pricing` : `${BASE_URL}/${loc}/pricing`;
  return {
    alternates: {
      canonical: localeUrl(locale),
      languages: Object.fromEntries(
        routing.locales.map((loc) => [loc, localeUrl(loc)])
      ),
    },
  };
}

export default async function PricingPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "Common" });
  const tPricing = await getTranslations({ locale, namespace: "Pricing" });

  const faqItems = [
    { q: tPricing("faqQ1"), a: tPricing("faqA1") },
    { q: tPricing("faqQ2"), a: tPricing("faqA2") },
    { q: tPricing("faqQ3"), a: tPricing("faqA3") },
    { q: tPricing("faqQ4"), a: tPricing("faqA4") },
    { q: tPricing("faqQ5"), a: tPricing("faqA5") },
    { q: tPricing("faqQ6"), a: tPricing("faqA6") },
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* ヘッダー */}
      <header className="bg-black/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-5 h-14 flex items-center">
          <Link
            href="/"
            className="flex items-center gap-2 text-white/60 hover:text-red-400 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            <span className="text-sm font-medium">{t("backToTop")}</span>
          </Link>
          <span className="ml-auto text-base font-black text-white">
            {t("animeTrips")}
          </span>
          <LocaleSwitcher />
          <UserMenu className="ml-2" />
        </div>
      </header>

      <Suspense
        fallback={
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-white/10 border-t-red-500 rounded-full animate-spin" />
          </div>
        }
      >
        <PricingContent />
      </Suspense>
    </div>
  );
}
