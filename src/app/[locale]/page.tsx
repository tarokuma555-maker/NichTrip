import MangaTopPage from "@/components/MangaTopPage";
import { getAllWorks } from "@/lib/works-data";
import { getRecentPosts } from "@/lib/blog-data";
import { getTranslations } from "next-intl/server";

// 人気Top10（ポスター付きカード表示）
const FEATURED_TITLES = new Set([
  "進撃の巨人",
  "鬼滅の刃",
  "呪術廻戦",
  "SPY×FAMILY",
  "葬送のフリーレン",
  "ONE PIECE",
  "NARUTO",
  "推しの子",
  "チェンソーマン",
  "君の名は。",
]);

const allWorks = getAllWorks().map((w) => ({
  slug: w.slug,
  title: w.title,
  title_en: w.title_en,
  year: w.year,
  genre: w.genre,
  spotCount: w.spots.length,
}));

const posterWorks = allWorks.filter((w) => FEATURED_TITLES.has(w.title));
const titleOnlyWorks = allWorks.filter((w) => !FEATURED_TITLES.has(w.title));

const recentPosts = getRecentPosts(3).map((p) => ({
  slug: p.slug,
  title: p.title,
  publishedAt: p.publishedAt,
  excerpt: p.excerpt,
  tags: p.tags,
}));

export default async function Home({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "TopPage" });

  const faqItems = [
    { q: t("faqQ1"), a: t("faqA1") },
    { q: t("faqQ2"), a: t("faqA2") },
    { q: t("faqQ3"), a: t("faqA3") },
    { q: t("faqQ4"), a: t("faqA4") },
    { q: t("faqQ5"), a: t("faqA5") },
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <MangaTopPage
        posterWorks={posterWorks}
        titleOnlyWorks={titleOnlyWorks}
        recentPosts={recentPosts}
      />
    </>
  );
}
