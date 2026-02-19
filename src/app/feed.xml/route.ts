import { getAllPosts } from "@/lib/blog-data";

const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://anime-trips.com";

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const posts = getAllPosts();

  const items = posts
    .map((post) => {
      const link = `${BASE_URL}/ja/blog/${post.slug}`;
      const pubDate = new Date(post.publishedAt).toUTCString();

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${link}</link>
      <description>${escapeXml(post.excerpt)}</description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${link}</guid>
      <author>${escapeXml(post.author)}</author>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AnimeTrips Blog</title>
    <link>${BASE_URL}/ja/blog</link>
    <description>アニメ聖地巡礼の旅行ガイド・おすすめスポット情報</description>
    <language>ja</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
