import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import FeedClient from "./FeedClient";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://anime-trips.com";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  const localeUrl = (loc: string) =>
    loc === "ja" ? `${BASE_URL}/feed` : `${BASE_URL}/${loc}/feed`;
  return {
    alternates: {
      canonical: localeUrl(locale),
      languages: Object.fromEntries(
        routing.locales.map((loc) => [loc, localeUrl(loc)])
      ),
    },
  };
}

export default function FeedPage() {
  return <FeedClient />;
}
