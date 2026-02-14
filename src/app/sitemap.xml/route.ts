import { BASE_URL, xmlResponse } from "@/lib/sitemap-utils";

export const dynamic = "force-static";

export function GET(): Response {
  const now = new Date().toISOString();
  const sitemaps = [
    "sitemap-main.xml",
    "sitemap-works-1.xml",
    "sitemap-works-2.xml",
    "sitemap-works-3.xml",
  ];

  const entries = sitemaps
    .map(
      (s) =>
        `<sitemap><loc>${BASE_URL}/${s}</loc><lastmod>${now}</lastmod></sitemap>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>`;

  return xmlResponse(xml);
}
