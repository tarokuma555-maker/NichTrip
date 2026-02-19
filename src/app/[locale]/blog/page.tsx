import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getAllPosts } from "@/lib/blog-data";
import { Link } from "@/i18n/navigation";
import BlogList from "./BlogList";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://anime-trips.com";

type Props = {
  params: { locale: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "Blog" });
  const posts = getAllPosts(locale);

  const title =
    locale === "ja"
      ? "聖地巡礼ブログ | AnimeTrips"
      : "Anime Pilgrimage Blog | AnimeTrips";

  const description =
    locale === "ja"
      ? `アニメ聖地巡礼の最新情報、おすすめルート、旅のヒントを${posts.length}件の記事でお届け。`
      : `Latest anime pilgrimage tips and travel guides. ${posts.length} articles.`;

  const localeUrl = (loc: string) =>
    loc === "ja" ? `${BASE_URL}/blog` : `${BASE_URL}/${loc}/blog`;

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
      title: t("blogTitle"),
      description,
      url: localeUrl(locale),
      siteName: "AnimeTrips",
      images: [
        {
          url: `${BASE_URL}/api/og?type=blog&title=${encodeURIComponent(t("blogTitle"))}`,
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
      images: [`${BASE_URL}/api/og?type=blog&title=${encodeURIComponent(t("blogTitle"))}`],
    },
  };
}

export default async function BlogPage({ params }: Props) {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "Common" });
  const tBlog = await getTranslations({ locale, namespace: "Blog" });
  const posts = getAllPosts(locale);

  const localePath = locale === "ja" ? "" : `/${locale}`;
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: tBlog("home"),
        item: `${BASE_URL}${localePath}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: tBlog("blogLabel"),
        item: `${BASE_URL}${localePath}/blog`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="min-h-screen bg-[#0a0a0a]">
      <header className="bg-black/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-5 h-14 flex items-center">
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
            AnimeTrips
          </span>
        </div>
      </header>

      <BlogList posts={posts} />
    </div>
    </>
  );
}
