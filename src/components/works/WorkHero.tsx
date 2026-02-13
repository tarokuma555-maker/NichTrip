"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getWorkVisual } from "@/lib/work-visuals";

type WorkHeroProps = {
  work: {
    title: string;
    title_en: string;
    year: number;
    genre: string;
    slug: string;
    spotCount: number;
  };
};

export default function WorkHero({ work }: WorkHeroProps) {
  const t = useTranslations("WorkDetail");
  const visual = getWorkVisual(work.title);
  const [imgError, setImgError] = useState(false);
  const hasImage = !!visual.image && !imgError;

  return (
    <section className="relative w-full min-h-[280px] sm:min-h-[360px] overflow-hidden">
      {/* ---------- Background ---------- */}
      {hasImage ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={visual.image}
            alt={work.title}
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
          {/* Dark overlay on image */}
          <div className="absolute inset-0 bg-black/60" />
        </>
      ) : (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${visual.gradient}`}
        />
      )}

      {/* ---------- SVG pattern overlay ---------- */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: visual.patternSvg,
          backgroundRepeat: "repeat",
        }}
      />

      {/* ---------- Bottom gradient fade to page bg ---------- */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

      {/* ---------- Content overlay ---------- */}
      <div className="relative z-10 flex flex-col justify-end h-full min-h-[280px] sm:min-h-[360px] px-4 sm:px-6 pb-6">
        {/* Pilgrimage guide label */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{visual.icon}</span>
          <span className="text-xs font-bold text-white/60 tracking-wider uppercase">
            {t("pilgrimageGuide")}
          </span>
        </div>

        {/* Work title (JP) */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight mb-1">
          {work.title}
        </h1>

        {/* Work title (EN) */}
        <p className="text-sm sm:text-base text-white/50 mb-4">
          {work.title_en}
        </p>

        {/* Meta row: genre badge + year + spot count */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span className="bg-white/10 border border-white/20 px-2 py-0.5 text-[11px] text-white/70 font-bold">
            {work.genre}
          </span>
          <span className="text-[11px] text-white/50 font-bold">
            {work.year}
          </span>
          <span className="text-[11px] text-white/50">|</span>
          <span className="text-[11px] text-white/50 font-bold">
            {t("spotsCount", { count: work.spotCount })}
          </span>
        </div>

        {/* CTA button */}
        <div>
          <Link
            href={`/plan?theme=pilgrimage&work=${encodeURIComponent(work.title)}`}
            className="inline-flex items-center gap-2 bg-red-500 text-white font-black px-6 py-3
                       border-2 border-red-400/30 shadow-[4px_4px_0_rgba(0,0,0,0.4)]
                       hover:bg-red-600 hover:shadow-[6px_6px_0_rgba(0,0,0,0.5)]
                       hover:-translate-x-0.5 hover:-translate-y-0.5
                       active:shadow-[2px_2px_0_rgba(0,0,0,0.4)] active:translate-x-0 active:translate-y-0
                       transition-all duration-200 text-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
            {t("createPlan")}
          </Link>
        </div>
      </div>
    </section>
  );
}
