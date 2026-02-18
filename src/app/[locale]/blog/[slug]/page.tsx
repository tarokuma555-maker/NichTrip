import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getAllPosts, getPostBySlug, getPostSource } from "@/lib/blog-data";
import { compileMDX } from "next-mdx-remote/rsc";
import { Link } from "@/i18n/navigation";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://anime-trips.com";

type Props = {
  params: { locale: string; slug: string };
};

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.flatMap((p) =>
    routing.locales.map((locale) => ({ locale, slug: p.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const title = `${post.title} | AnimeTrips`;
  const description = post.excerpt;
  const ogImageUrl = `${BASE_URL}/api/og?type=blog&title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(post.tags.slice(0, 2).join(" / "))}`;

  const localeUrl = (loc: string) =>
    loc === "ja"
      ? `${BASE_URL}/blog/${slug}`
      : `${BASE_URL}/${loc}/blog/${slug}`;

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
      title: post.title,
      description,
      url: localeUrl(locale),
      siteName: "AnimeTrips",
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      locale,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const mdxComponents = {
  h2: (props: any) => (
    <h2
      className="text-lg sm:text-xl font-black text-white mt-10 mb-3 border-l-4 border-red-500 pl-3"
      {...props}
    />
  ),
  h3: (props: any) => (
    <h3 className="text-base font-bold text-white mt-6 mb-2" {...props} />
  ),
  p: (props: any) => (
    <p
      className="text-sm sm:text-[15px] text-white/75 leading-[1.9] mb-4"
      {...props}
    />
  ),
  ul: (props: any) => (
    <ul
      className="list-disc list-inside text-sm text-white/70 mb-4 space-y-1.5 pl-1"
      {...props}
    />
  ),
  ol: (props: any) => (
    <ol
      className="list-decimal list-inside text-sm text-white/70 mb-4 space-y-1.5 pl-1"
      {...props}
    />
  ),
  li: (props: any) => <li className="text-sm text-white/70" {...props} />,
  a: (props: any) => (
    <a
      className="text-red-400 hover:text-red-300 underline underline-offset-2 transition-colors"
      {...props}
    />
  ),
  blockquote: (props: any) => (
    <blockquote
      className="border-l-4 border-white/20 pl-4 italic text-white/50 my-4"
      {...props}
    />
  ),
  strong: (props: any) => (
    <strong className="font-bold text-white/90" {...props} />
  ),
  table: (props: any) => (
    <div className="overflow-x-auto mb-4">
      <table
        className="w-full text-sm text-white/70 border-collapse border border-white/10"
        {...props}
      />
    </div>
  ),
  th: (props: any) => (
    <th
      className="border border-white/10 bg-white/5 px-3 py-2 text-left font-bold text-white/80 text-xs"
      {...props}
    />
  ),
  td: (props: any) => (
    <td className="border border-white/10 px-3 py-2 text-xs" {...props} />
  ),
  hr: () => <hr className="border-white/10 my-8" />,
};
/* eslint-enable @typescript-eslint/no-explicit-any */

export default async function BlogDetailPage({ params }: Props) {
  const { locale, slug } = params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const t = await getTranslations({ locale, namespace: "Blog" });

  const source = getPostSource(slug);
  const { content } = await compileMDX({
    source,
    options: { parseFrontmatter: true },
    components: mdxComponents,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Organization",
      name: post.author,
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "AnimeTrips",
      url: BASE_URL,
    },
    image: `${BASE_URL}/api/og?type=blog&title=${encodeURIComponent(post.title)}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${slug}`,
    },
    keywords: post.tags.join(", "),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="min-h-screen bg-[#0a0a0a]">
        {/* ヘッダー */}
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

        <article className="max-w-3xl mx-auto px-4 sm:px-5 py-8 pb-24">
          {/* パンくず */}
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
            <span className="text-white/50 truncate">{post.title}</span>
          </nav>

          {/* 記事ヘッダー */}
          <header className="mb-8">
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-bold px-2 py-0.5 bg-red-500/15 border border-red-500/30 text-red-400"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-white leading-tight mb-3">
              {post.title}
            </h1>

            <div className="flex items-center gap-3 text-[11px] text-white/30">
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("ja-JP")}
              </time>
              {post.updatedAt !== post.publishedAt && (
                <span>
                  ({t("updated")}:{" "}
                  {new Date(post.updatedAt).toLocaleDateString("ja-JP")})
                </span>
              )}
              <span>|</span>
              <span>{post.author}</span>
            </div>
          </header>

          {/* 本文 */}
          <div>{content}</div>

          {/* 記事下部 */}
          <div className="mt-12 pt-6 border-t border-white/10">
            <Link
              href="/blog"
              className="text-sm font-bold text-red-400 hover:text-red-300 transition-colors"
            >
              &larr; {t("backToList")}
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}
