import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getAllTags, getPostsByTag } from "@/lib/blog-data";
import { Link } from "@/i18n/navigation";
import type { BlogPost } from "@/lib/blog-data";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://anime-trips.com";

type Props = {
  params: { locale: string; tag: string };
};

export function generateStaticParams() {
  const tags = getAllTags();
  return tags.flatMap((tag) =>
    routing.locales.map((locale) => ({ locale, tag }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, tag } = params;
  const decodedTag = decodeURIComponent(tag);
  const t = await getTranslations({ locale, namespace: "Blog" });
  const posts = getPostsByTag(decodedTag, locale);

  const title = t("tagPageTitle", { tag: decodedTag });
  const description =
    locale === "ja"
      ? `「${decodedTag}」タグの聖地巡礼ブログ記事一覧。${posts.length}件の記事。`
      : `Blog articles tagged "${decodedTag}". ${posts.length} articles.`;

  const localeUrl = (loc: string) =>
    loc === "ja"
      ? `${BASE_URL}/blog/tag/${encodeURIComponent(decodedTag)}`
      : `${BASE_URL}/${loc}/blog/tag/${encodeURIComponent(decodedTag)}`;

  return {
    title: `${title} | AnimeTrips`,
    description,
    alternates: {
      canonical: localeUrl(locale),
      languages: Object.fromEntries(
        routing.locales.map((loc) => [loc, localeUrl(loc)])
      ),
    },
    openGraph: {
      title,
      description,
      url: localeUrl(locale),
      siteName: "AnimeTrips",
      images: [
        {
          url: `${BASE_URL}/api/og?type=blog&title=${encodeURIComponent(title)}`,
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
      images: [
        `${BASE_URL}/api/og?type=blog&title=${encodeURIComponent(title)}`,
      ],
    },
  };
}

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block border-2 border-white/10 bg-white/[0.03] p-4
                 hover:border-red-500/30 hover:-translate-y-0.5
                 shadow-[2px_2px_0_rgba(0,0,0,0.3)] hover:shadow-[3px_3px_0_rgba(229,62,62,0.2)]
                 transition-all duration-200"
    >
      <div className="flex flex-wrap gap-1.5 mb-2">
        {post.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-[9px] font-bold px-1.5 py-0.5 bg-red-500/10 text-red-400/70"
          >
            {tag}
          </span>
        ))}
      </div>

      <h2 className="text-sm sm:text-base font-black text-white group-hover:text-red-400 transition-colors mb-1.5 line-clamp-2">
        {post.title}
      </h2>

      <p className="text-[11px] sm:text-xs text-white/40 line-clamp-2 mb-2">
        {post.excerpt}
      </p>

      <div className="flex items-center gap-2 text-[10px] text-white/25">
        <time dateTime={post.publishedAt}>
          {new Date(post.publishedAt).toLocaleDateString("ja-JP")}
        </time>
        <span>|</span>
        <span>{post.author}</span>
      </div>
    </Link>
  );
}

export default async function BlogTagPage({ params }: Props) {
  const { locale, tag } = params;
  const decodedTag = decodeURIComponent(tag);
  const t = await getTranslations({ locale, namespace: "Blog" });
  const posts = getPostsByTag(decodedTag, locale);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t("home"),
        item: locale === "ja" ? BASE_URL : `${BASE_URL}/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: t("blogLabel"),
        item:
          locale === "ja"
            ? `${BASE_URL}/blog`
            : `${BASE_URL}/${locale}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: decodedTag,
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
        {/* Header */}
        <header className="bg-black/80 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-5 h-14 flex items-center">
            <Link
              href="/blog"
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
              <span className="text-sm font-medium">{t("backToList")}</span>
            </Link>
            <span className="ml-auto text-base font-black text-white">
              AnimeTrips
            </span>
          </div>
        </header>

        <div className="max-w-3xl mx-auto px-4 sm:px-5 py-8 pb-24">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] text-white/30 mb-6">
            <Link
              href="/"
              className="hover:text-white/50 transition-colors"
            >
              {t("home")}
            </Link>
            <span>/</span>
            <Link
              href="/blog"
              className="hover:text-white/50 transition-colors"
            >
              {t("blogLabel")}
            </Link>
            <span>/</span>
            <span className="text-white/50">{decodedTag}</span>
          </nav>

          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-black text-white mb-1">
              {t("tagPageTitle", { tag: decodedTag })}
            </h1>
            <p className="text-xs text-white/30 font-bold">
              {t("tagPageCount", { count: posts.length })}
            </p>
          </div>

          {/* Post list */}
          <div className="space-y-4">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>

          {posts.length === 0 && (
            <p className="text-sm text-white/30 text-center py-12">
              {t("noPosts")}
            </p>
          )}

          {/* Back to blog link */}
          <div className="mt-12 pt-6 border-t border-white/10">
            <Link
              href="/blog"
              className="text-sm font-bold text-red-400 hover:text-red-300 transition-colors"
            >
              &larr; {t("backToList")}
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
