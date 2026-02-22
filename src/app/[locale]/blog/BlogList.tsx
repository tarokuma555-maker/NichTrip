"use client";

import { useState, useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { BlogPost } from "@/lib/blog-data";
import NewsletterSignup from "@/components/NewsletterSignup";

const POSTS_PER_PAGE = 12;

function BlogCard({ post }: { post: BlogPost }) {
  return (
    <div
      className="group block border-2 border-white/10 bg-white/[0.03] p-4
                 hover:border-red-500/30 hover:-translate-y-0.5
                 shadow-[2px_2px_0_rgba(0,0,0,0.3)] hover:shadow-[3px_3px_0_rgba(229,62,62,0.2)]
                 transition-all duration-200"
    >
      <div className="flex flex-wrap gap-1.5 mb-2">
        {post.tags.slice(0, 3).map((tag) => (
          <Link
            key={tag}
            href={`/blog/tag/${tag}`}
            className="text-[9px] font-bold px-1.5 py-0.5 bg-red-500/10 text-red-400/70 hover:bg-red-500/20 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            {tag}
          </Link>
        ))}
      </div>

      <Link href={`/blog/${post.slug}`} className="block">
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
    </div>
  );
}

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const t = useTranslations("Blog");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);

  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    posts.forEach((p) => p.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet);
  }, [posts]);

  const filtered = useMemo(() => {
    let result = posts;

    // Filter by search query (title and excerpt, case-insensitive)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q)
      );
    }

    // Filter by tag
    if (selectedTag) {
      result = result.filter((p) => p.tags.includes(selectedTag));
    }

    return result;
  }, [posts, selectedTag, searchQuery]);

  // Reset pagination when search query or tag filter changes
  useEffect(() => {
    setVisibleCount(POSTS_PER_PAGE);
  }, [searchQuery, selectedTag]);

  const visiblePosts = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount]
  );

  const hasMore = visibleCount < filtered.length;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-5 py-8 pb-24">
      {/* ヘッダー */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-black text-white mb-1">
          {t("blogTitle")}
        </h1>
        <p className="text-xs text-white/30 font-bold">
          {t("postsCount", { count: posts.length })}
        </p>
      </div>

      {/* 検索 */}
      <div className="relative mb-4">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("searchPlaceholder")}
          className="w-full pl-9 pr-3 py-2 text-sm bg-white/[0.03] border-2 border-white/10
                     text-white placeholder:text-white/25 focus:border-red-500/40 focus:outline-none
                     transition-colors"
        />
      </div>

      {/* タグフィルター */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedTag(null)}
            className={`text-[11px] font-bold px-2.5 py-1 border transition-colors ${
              !selectedTag
                ? "bg-red-500/20 border-red-500/40 text-red-400"
                : "bg-white/5 border-white/10 text-white/40 hover:text-white/60"
            }`}
          >
            {t("filterAll")}
          </button>
          {allTags.map((tag) => (
            <Link
              key={tag}
              href={`/blog/tag/${tag}`}
              className={`text-[11px] font-bold px-2.5 py-1 border transition-colors ${
                selectedTag === tag
                  ? "bg-red-500/20 border-red-500/40 text-red-400"
                  : "bg-white/5 border-white/10 text-white/40 hover:text-white/60"
              }`}
              onClick={(e) => {
                e.preventDefault();
                setSelectedTag(selectedTag === tag ? null : tag);
              }}
              onAuxClick={() => {}}
            >
              {tag}
            </Link>
          ))}
        </div>
      )}

      {/* 記事リスト */}
      <div className="space-y-4">
        {visiblePosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-white/30 text-center py-12">
          {t("noPosts")}
        </p>
      )}

      {/* ページネーション */}
      {filtered.length > 0 && (
        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="text-[11px] text-white/30 font-bold">
            {t("showingCount", {
              shown: visiblePosts.length,
              total: filtered.length,
            })}
          </p>
          {hasMore && (
            <button
              onClick={() =>
                setVisibleCount((prev) => prev + POSTS_PER_PAGE)
              }
              className="px-6 py-2 text-sm font-bold border-2 border-white/10 bg-white/[0.03]
                         text-white/60 hover:text-white hover:border-red-500/30 hover:bg-red-500/5
                         transition-all duration-200"
            >
              {t("showMore")}
            </button>
          )}
        </div>
      )}

      {/* ニュースレター登録 */}
      <div className="mt-10">
        <NewsletterSignup />
      </div>
    </div>
  );
}
