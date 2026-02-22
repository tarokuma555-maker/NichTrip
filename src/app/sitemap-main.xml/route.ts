import { LOCALES, localeUrl, buildUrlEntry, wrapUrlset, xmlResponse } from "@/lib/sitemap-utils";
import { getAllBlogSlugs, getAllTags } from "@/lib/blog-data";

export const dynamic = "force-static";

export function GET(): Response {
  const now = new Date().toISOString();
  const entries: string[] = [];

  // Static pages
  const staticPaths = ["/", "/plan", "/chat", "/feed", "/pricing"];
  for (const path of staticPaths) {
    for (const locale of LOCALES) {
      entries.push(
        buildUrlEntry(
          localeUrl(path, locale),
          now,
          path === "/" ? "daily" : "weekly",
          path === "/" ? 1.0 : 0.7,
        ),
      );
    }
  }

  // Works index
  for (const locale of LOCALES) {
    entries.push(buildUrlEntry(localeUrl("/works", locale), now, "weekly", 0.9));
  }

  // Blog index
  for (const locale of LOCALES) {
    entries.push(buildUrlEntry(localeUrl("/blog", locale), now, "weekly", 0.8));
  }

  // Blog posts
  const blogSlugs = getAllBlogSlugs();
  for (const slug of blogSlugs) {
    for (const locale of LOCALES) {
      entries.push(buildUrlEntry(localeUrl(`/blog/${slug}`, locale), now, "monthly", 0.7));
    }
  }

  // Blog tag pages
  const tags = getAllTags();
  for (const tag of tags) {
    for (const locale of LOCALES) {
      entries.push(buildUrlEntry(localeUrl(`/blog/tag/${encodeURIComponent(tag)}`, locale), now, "weekly", 0.5));
    }
  }

  return xmlResponse(wrapUrlset(entries.join("\n")));
}
