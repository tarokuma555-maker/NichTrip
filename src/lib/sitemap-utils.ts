import { getAllSlugs } from "@/lib/works-data";

export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://anime-trips-7bd7.vercel.app";
export const LOCALES = ["ja", "en", "zh", "ko"] as const;

export function localeUrl(path: string, locale: string): string {
  return locale === "ja" ? `${BASE_URL}${path}` : `${BASE_URL}/${locale}${path}`;
}

export function buildUrlEntry(
  loc: string,
  lastmod: string,
  changefreq: string,
  priority: number,
): string {
  return `<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`;
}

export function wrapUrlset(entries: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</urlset>`;
}

export function getWorkSlugsChunked(): [string[], string[], string[]] {
  const all = getAllSlugs();
  const chunk1 = all.slice(0, 200);
  const chunk2 = all.slice(200, 400);
  const chunk3 = all.slice(400);
  return [chunk1, chunk2, chunk3];
}

export function xmlResponse(body: string): Response {
  return new Response(body, {
    headers: { "Content-Type": "application/xml" },
  });
}
