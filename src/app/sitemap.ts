import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/works-data";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://anime-trips-7bd7.vercel.app";
const LOCALES = ["ja", "en", "zh", "ko"] as const;
const URLS_PER_SITEMAP = 500;

function localeUrl(path: string, locale: string): string {
  return locale === "ja" ? `${BASE_URL}${path}` : `${BASE_URL}/${locale}${path}`;
}

// Generate sitemap index: /sitemap.xml → /sitemap/0.xml, /sitemap/1.xml, ...
export async function generateSitemaps() {
  const slugs = getAllSlugs();
  const staticPaths = ["/", "/plan", "/chat", "/feed", "/pricing"];
  const totalUrls =
    staticPaths.length * LOCALES.length +  // static pages
    LOCALES.length +                        // works index
    slugs.length * LOCALES.length;          // work detail pages
  const count = Math.ceil(totalUrls / URLS_PER_SITEMAP);
  return Array.from({ length: count }, (_, i) => ({ id: i }));
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // Build all URLs in order
  const allEntries: MetadataRoute.Sitemap = [];

  // Static pages
  const staticPaths = ["/", "/plan", "/chat", "/feed", "/pricing"];
  for (const path of staticPaths) {
    for (const locale of LOCALES) {
      allEntries.push({
        url: localeUrl(path, locale),
        lastModified: now,
        changeFrequency: path === "/" ? "daily" : "weekly",
        priority: path === "/" ? 1.0 : 0.7,
      });
    }
  }

  // Works index
  for (const locale of LOCALES) {
    allEntries.push({
      url: localeUrl("/works", locale),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    });
  }

  // Work detail pages
  const slugs = getAllSlugs();
  for (const slug of slugs) {
    for (const locale of LOCALES) {
      allEntries.push({
        url: localeUrl(`/works/${slug}`, locale),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  // Return the slice for this sitemap id
  const start = id * URLS_PER_SITEMAP;
  return allEntries.slice(start, start + URLS_PER_SITEMAP);
}
