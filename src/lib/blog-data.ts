import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type BlogPost = {
  slug: string;
  title: string;
  publishedAt: string;
  updatedAt: string;
  excerpt: string;
  tags: string[];
  coverImage: string | null;
  author: string;
};

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const DEFAULT_LOCALE = "ja";

// Cache: locale -> sorted posts array
const postsByLocale = new Map<string, BlogPost[]>();
// Cache: locale -> (slug -> post)
const slugToPostByLocale = new Map<string, Map<string, BlogPost>>();

/**
 * Returns the file path for a given slug and locale.
 * Falls back to the default locale ("ja") if the requested locale file doesn't exist.
 */
function resolvePostPath(slug: string, locale: string): string | null {
  const localePath = path.join(BLOG_DIR, locale, `${slug}.mdx`);
  if (fs.existsSync(localePath)) return localePath;

  if (locale !== DEFAULT_LOCALE) {
    const fallbackPath = path.join(BLOG_DIR, DEFAULT_LOCALE, `${slug}.mdx`);
    if (fs.existsSync(fallbackPath)) return fallbackPath;
  }

  return null;
}

function loadPostsForLocale(locale: string): void {
  if (postsByLocale.has(locale)) return;

  const jaDir = path.join(BLOG_DIR, DEFAULT_LOCALE);
  if (!fs.existsSync(jaDir)) {
    postsByLocale.set(locale, []);
    slugToPostByLocale.set(locale, new Map());
    return;
  }

  // Start with all slugs from the default locale (ja) to ensure all posts are available
  const jaSlugs = fs
    .readdirSync(jaDir)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));

  // If the requested locale directory exists, add any slugs that only exist there
  const localeDir = path.join(BLOG_DIR, locale);
  const allSlugs = new Set(jaSlugs);
  if (locale !== DEFAULT_LOCALE && fs.existsSync(localeDir)) {
    fs.readdirSync(localeDir)
      .filter((f) => f.endsWith(".mdx"))
      .forEach((f) => allSlugs.add(f.replace(/\.mdx$/, "")));
  }

  const posts: BlogPost[] = [];
  const slugMap = new Map<string, BlogPost>();

  for (const slug of Array.from(allSlugs)) {
    const filePath = resolvePostPath(slug, locale);
    if (!filePath) continue;

    const raw = fs.readFileSync(filePath, "utf-8");
    const { data: fm } = matter(raw);

    const post: BlogPost = {
      slug,
      title: fm.title ?? slug,
      publishedAt: fm.publishedAt ?? "",
      updatedAt: fm.updatedAt ?? fm.publishedAt ?? "",
      excerpt: fm.excerpt ?? "",
      tags: Array.isArray(fm.tags) ? fm.tags : [],
      coverImage: fm.coverImage ?? null,
      author: fm.author ?? "AnimeTrips編集部",
    };

    posts.push(post);
    slugMap.set(slug, post);
  }

  posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  postsByLocale.set(locale, posts);
  slugToPostByLocale.set(locale, slugMap);
}

export function getAllPosts(locale: string = DEFAULT_LOCALE): BlogPost[] {
  loadPostsForLocale(locale);
  return postsByLocale.get(locale) ?? [];
}

export function getPostBySlug(
  slug: string,
  locale: string = DEFAULT_LOCALE,
): BlogPost | undefined {
  loadPostsForLocale(locale);
  return slugToPostByLocale.get(locale)?.get(slug);
}

export function getAllBlogSlugs(): string[] {
  return getAllPosts(DEFAULT_LOCALE).map((p) => p.slug);
}

export function getRecentPosts(
  limit = 3,
  locale: string = DEFAULT_LOCALE,
): BlogPost[] {
  return getAllPosts(locale).slice(0, limit);
}

export function getPostSource(
  slug: string,
  locale: string = DEFAULT_LOCALE,
): string {
  const filePath = resolvePostPath(slug, locale);
  if (!filePath) {
    throw new Error(`Blog post not found: ${slug} (locale: ${locale})`);
  }
  return fs.readFileSync(filePath, "utf-8");
}

export function getAllTags(locale: string = DEFAULT_LOCALE): string[] {
  const tagSet = new Set<string>();
  getAllPosts(locale).forEach((p) => p.tags.forEach((tag) => tagSet.add(tag)));
  return Array.from(tagSet).sort();
}

export function getPostsByTag(
  tag: string,
  locale: string = DEFAULT_LOCALE,
): BlogPost[] {
  return getAllPosts(locale).filter((p) => p.tags.includes(tag));
}

export function getRelatedPosts(
  slug: string,
  tags: string[],
  limit: number = 3,
  locale: string = DEFAULT_LOCALE,
): BlogPost[] {
  if (tags.length === 0) return [];

  const tagSet = new Set(tags);
  const posts = getAllPosts(locale).filter((p) => p.slug !== slug);

  const scored = posts
    .map((p) => {
      const sharedCount = p.tags.filter((t) => tagSet.has(t)).length;
      return { post: p, sharedCount };
    })
    .filter((item) => item.sharedCount > 0);

  scored.sort((a, b) => {
    if (b.sharedCount !== a.sharedCount) return b.sharedCount - a.sharedCount;
    return b.post.publishedAt.localeCompare(a.post.publishedAt);
  });

  return scored.slice(0, limit).map((item) => item.post);
}

/**
 * Returns blog posts related to a specific anime work.
 * Matches by work title, English title, or genre against post tags and title.
 */
export function getPostsForWork(
  workTitle: string,
  workTitleEn: string,
  limit: number = 3,
  locale: string = DEFAULT_LOCALE,
): BlogPost[] {
  const keywords = [
    workTitle.toLowerCase(),
    workTitleEn.toLowerCase(),
  ];

  const posts = getAllPosts(locale);

  const scored = posts
    .map((p) => {
      let score = 0;
      const titleLower = p.title.toLowerCase();
      const tagsLower = p.tags.map((t) => t.toLowerCase());

      for (const kw of keywords) {
        if (!kw) continue;
        // Check if post tags contain the keyword
        if (tagsLower.some((tag) => tag === kw || tag.includes(kw) || kw.includes(tag))) {
          score += 3;
        }
        // Check if post title mentions the keyword
        if (titleLower.includes(kw)) {
          score += 2;
        }
      }
      return { post: p, score };
    })
    .filter((item) => item.score > 0);

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return b.post.publishedAt.localeCompare(a.post.publishedAt);
  });

  return scored.slice(0, limit).map((item) => item.post);
}
