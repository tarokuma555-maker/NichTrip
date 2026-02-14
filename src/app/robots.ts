import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || "https://anime-trips-7bd7.vercel.app"}/sitemap.xml`,
  };
}
