import { LOCALES, localeUrl, buildUrlEntry, wrapUrlset, getWorkSlugsChunked, xmlResponse } from "@/lib/sitemap-utils";

export const dynamic = "force-static";

export function GET(): Response {
  const now = new Date().toISOString();
  const [, slugs] = getWorkSlugsChunked();
  const entries: string[] = [];

  for (const slug of slugs) {
    for (const locale of LOCALES) {
      entries.push(buildUrlEntry(localeUrl(`/works/${slug}`, locale), now, "monthly", 0.8));
    }
  }

  return xmlResponse(wrapUrlset(entries.join("\n")));
}
