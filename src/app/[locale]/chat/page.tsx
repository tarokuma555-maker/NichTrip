import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import ChatClient from "./ChatClient";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://anime-trips.com";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  const localeUrl = (loc: string) =>
    loc === "ja" ? `${BASE_URL}/chat` : `${BASE_URL}/${loc}/chat`;
  return {
    alternates: {
      canonical: localeUrl(locale),
      languages: Object.fromEntries(
        routing.locales.map((loc) => [loc, localeUrl(loc)])
      ),
    },
  };
}

export default function ChatPage() {
  return <ChatClient />;
}
