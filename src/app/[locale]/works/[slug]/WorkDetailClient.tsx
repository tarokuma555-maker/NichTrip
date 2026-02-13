"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { WorkEntry } from "@/lib/works-data";
import WorkHero from "@/components/works/WorkHero";
import WorkMap from "@/components/works/WorkMap";
import WorkSpotCard from "@/components/works/WorkSpotCard";
import RelatedWorks from "@/components/works/RelatedWorks";

type RelatedWork = {
  slug: string;
  title: string;
  title_en: string;
  year: number;
  genre: string;
  spotCount: number;
};

export default function WorkDetailClient({
  work,
  related,
}: {
  work: WorkEntry;
  related: RelatedWork[];
}) {
  const t = useTranslations("WorkDetail");
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

  return (
    <>
      {/* Hero */}
      <WorkHero
        work={{
          title: work.title,
          title_en: work.title_en,
          year: work.year,
          genre: work.genre,
          slug: work.slug,
          spotCount: work.spots.length,
        }}
      />

      <main className="max-w-3xl mx-auto px-4 sm:px-5 pb-24">
        {/* Back link */}
        <div className="py-4">
          <Link
            href="/works"
            className="inline-flex items-center gap-1 text-xs text-white/30 hover:text-red-400 transition-colors"
          >
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            {t("backToList")}
          </Link>
        </div>

        {/* Map section */}
        <section className="mb-8">
          <h2 className="text-sm font-black text-white/60 mb-3">
            {t("mapTitle")}
          </h2>
          <WorkMap spots={work.spots} focusIndex={focusIndex} />
        </section>

        {/* Spot list */}
        <section className="mb-10">
          <h2 className="text-sm font-black text-white/60 mb-4">
            {t("spotListTitle")}
            <span className="ml-2 text-red-400">
              {work.spots.length}
            </span>
          </h2>
          <div className="space-y-3">
            {work.spots.map((spot, i) => (
              <WorkSpotCard
                key={`${spot.name}-${i}`}
                spot={spot}
                index={i + 1}
                onLocate={() => setFocusIndex(i + 1)}
              />
            ))}
          </div>
        </section>

        {/* Route CTA */}
        <section className="mb-10 bg-gradient-to-r from-red-500/10 to-red-900/10 border-2 border-red-500/30 p-6 text-center">
          <h3 className="text-base font-black text-white mb-2">
            {t("routeCta")}
          </h3>
          <p className="text-xs text-white/40 mb-4 max-w-md mx-auto">
            {t("routeCtaDesc")}
          </p>
          <Link
            href={`/plan?theme=pilgrimage&work=${encodeURIComponent(work.title)}`}
            className="inline-flex items-center gap-2 bg-red-500 text-white text-sm font-black
                       px-6 py-3 border-2 border-red-400/30
                       shadow-[4px_4px_0_rgba(0,0,0,0.4)] hover:shadow-[2px_2px_0_rgba(0,0,0,0.4)]
                       hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-150"
          >
            {t("routeCtaButton")}
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </Link>
        </section>

        {/* Related Works */}
        {related.length > 0 && (
          <section className="mb-10">
            <RelatedWorks works={related} />
          </section>
        )}
      </main>
    </>
  );
}
