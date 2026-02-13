import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import {
  getAllWorks,
  getWorkBySlug,
  getRelatedWorks,
} from "@/lib/works-data";
import TravelBanner from "@/components/ads/TravelBanner";
import WorkDetailClient from "./WorkDetailClient";

const BASE_URL = "https://animetrips.app";

type Props = {
  params: { locale: string; slug: string };
};

export function generateStaticParams() {
  const works = getAllWorks();
  return works.flatMap((w) =>
    routing.locales.map((locale) => ({ locale, slug: w.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = params;
  const work = getWorkBySlug(slug);
  if (!work) return {};

  const t = await getTranslations({ locale, namespace: "WorkDetail" });
  const spotNames = work.spots
    .slice(0, 3)
    .map((s) => s.name)
    .join("、");

  const title =
    locale === "ja"
      ? `${work.title} 聖地巡礼ガイド｜全${work.spots.length}スポット | AnimeTrips`
      : `${work.title_en} Pilgrimage Guide | ${work.spots.length} Spots | AnimeTrips`;

  const description =
    locale === "ja"
      ? `${work.title}（${work.title_en}）の聖地巡礼スポット${work.spots.length}箇所をマップ付きで完全紹介。${spotNames}…アクセス情報、シーン解説付き。`
      : `Complete guide to ${work.spots.length} ${work.title_en} anime pilgrimage spots with map. ${spotNames}… with access info and scene descriptions.`;

  const ogImageUrl = `${BASE_URL}/api/og?type=work&title=${encodeURIComponent(work.title)}&spots=${work.spots.length}`;

  const localeUrl = (loc: string) =>
    loc === "ja"
      ? `${BASE_URL}/works/${slug}`
      : `${BASE_URL}/${loc}/works/${slug}`;

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
      title: work.title,
      description: t("spotsCount", { count: work.spots.length }),
      url: localeUrl(locale),
      siteName: "AnimeTrips",
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      locale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default function WorkDetailPage({ params }: Props) {
  const { slug } = params;
  const work = getWorkBySlug(slug);
  if (!work) notFound();

  const related = getRelatedWorks(work, 8).map((w) => ({
    slug: w.slug,
    title: w.title,
    title_en: w.title_en,
    year: w.year,
    genre: w.genre,
    spotCount: w.spots.length,
  }));

  // JSON-LD structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: `${work.title} 聖地巡礼ルート`,
    description: `${work.title}の聖地巡礼スポット${work.spots.length}箇所`,
    touristType: "Anime Fan",
    itinerary: {
      "@type": "ItemList",
      itemListElement: work.spots.map((spot, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "TouristAttraction",
          name: spot.name,
          address: spot.address,
          geo: {
            "@type": "GeoCoordinates",
            latitude: spot.lat,
            longitude: spot.lng,
          },
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-[#0a0a0a]">
        <WorkDetailClient work={work} related={related} />

        {/* Ad section */}
        <TravelBanner variant="card" category="hotel" maxItems={3} />
      </div>
    </>
  );
}
