import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getAllWorks } from "@/lib/works-data";
import WorksGrid from "@/components/works/WorksGrid";
import TravelBanner from "@/components/ads/TravelBanner";

const BASE_URL = "https://animetrips.app";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "Works" });
  const works = getAllWorks();

  const title =
    locale === "ja"
      ? `全${works.length}作品の聖地巡礼ガイド | AnimeTrips`
      : `Anime Pilgrimage Guide - ${works.length} Works | AnimeTrips`;

  const description =
    locale === "ja"
      ? `AnimeTripsに収録された全${works.length}作品の聖地巡礼スポットを検索。マップ付きの詳細ガイドで、あなたの聖地巡礼をサポート。`
      : `Browse all ${works.length} anime works with pilgrimage spot guides. Detailed maps and access info for your anime pilgrimage.`;

  const localeUrl = (loc: string) =>
    loc === "ja" ? `${BASE_URL}/works` : `${BASE_URL}/${loc}/works`;

  return {
    title,
    description,
    alternates: {
      canonical: localeUrl(locale),
      languages: Object.fromEntries(
        routing.locales.map((loc) => [loc, localeUrl(loc)])
      ),
    },
    openGraph: {
      title: t("title"),
      description,
      url: localeUrl(locale),
      siteName: "AnimeTrips",
      images: [
        {
          url: `${BASE_URL}/api/og?type=work&title=${encodeURIComponent(t("title"))}`,
          width: 1200,
          height: 630,
        },
      ],
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}/api/og?type=work&title=${encodeURIComponent(t("title"))}`],
    },
  };
}

export default function WorksPage() {
  const works = getAllWorks().map((w) => ({
    slug: w.slug,
    title: w.title,
    title_en: w.title_en,
    year: w.year,
    genre: w.genre,
    spotCount: w.spots.length,
  }));

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <WorksGrid works={works} />
      <TravelBanner variant="horizontal" category="mixed" />
    </div>
  );
}
