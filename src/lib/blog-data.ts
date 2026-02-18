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

const allPosts: BlogPost[] = [];
const slugToPost = new Map<string, BlogPost>();

function loadPosts() {
  if (allPosts.length > 0) return;
  if (!fs.existsSync(BLOG_DIR)) return;

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
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

    allPosts.push(post);
    slugToPost.set(slug, post);
  }

  allPosts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

loadPosts();

export function getAllPosts(): BlogPost[] {
  return allPosts;
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return slugToPost.get(slug);
}

export function getAllBlogSlugs(): string[] {
  return allPosts.map((p) => p.slug);
}

export function getRecentPosts(limit = 3): BlogPost[] {
  return allPosts.slice(0, limit);
}

export function getPostSource(slug: string): string {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  return fs.readFileSync(filePath, "utf-8");
}
