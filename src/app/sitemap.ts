import type { MetadataRoute } from "next";
import { getAllSlugs } from "@/lib/works-data";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://anime-trips-7bd7.vercel.app";
const LOCALES = ["ja", "en", "zh", "ko"] as const;

function localeUrl(path: string, locale: string): string {
  return locale === "ja" ? `${BASE_URL}${path}` : `${BASE_URL}/${locale}${path}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // Static pages
  const staticPaths = ["/", "/plan", "/chat", "/feed", "/pricing"];
  const staticEntries: MetadataRoute.Sitemap = staticPaths.flatMap((path) =>
    LOCALES.map((locale) => ({
      url: localeUrl(path, locale),
      lastModified: now,
      changeFrequency: path === "/" ? ("daily" as const) : ("weekly" as const),
      priority: path === "/" ? 1.0 : 0.7,
    }))
  );

  // Works index
  const worksIndexEntries: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
    url: localeUrl("/works", locale),
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  // Work detail pages
  const slugs = getAllSlugs();
  const workEntries: MetadataRoute.Sitemap = slugs.flatMap((slug) =>
    LOCALES.map((locale) => ({
      url: localeUrl(`/works/${slug}`, locale),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }))
  );

  return [...staticEntries, ...worksIndexEntries, ...workEntries];
}
