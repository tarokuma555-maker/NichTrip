"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getWorkVisual } from "@/lib/work-visuals";

type RelatedWork = {
  slug: string;
  title: string;
  title_en: string;
  year: number;
  genre: string;
  spotCount: number;
};

export default function RelatedWorks({ works }: { works: RelatedWork[] }) {
  const t = useTranslations("WorkDetail");

  if (works.length === 0) return null;

  return (
    <div>
      <p className="text-sm font-black text-white/60 mb-3">
        {t("relatedWorks")}
      </p>

      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
        {works.map((work) => {
          const visual = getWorkVisual(work.title);

          return (
            <Link
              key={work.slug}
              href={`/works/${work.slug}`}
              className="shrink-0 w-44 border-2 border-white/10 bg-white/[0.03]
                         hover:border-red-500/30 transition-colors overflow-hidden"
            >
              {/* Top: visual header */}
              <div className="relative h-28 overflow-hidden">
                {visual.image ? (
                  <>
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${visual.image})` }}
                    />
                    <div className="absolute inset-0 bg-black/40" />
                  </>
                ) : (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${visual.gradient}`}
                  />
                )}

                {/* Pattern overlay */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: visual.patternSvg,
                    backgroundRepeat: "repeat",
                  }}
                />

                {/* Bottom gradient fade */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Spot count badge */}
                <div className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5">
                  {work.spotCount} spots
                </div>
              </div>

              {/* Bottom: content */}
              <div className="p-2">
                <p className="text-xs font-black text-white truncate">
                  {work.title}
                </p>
                <p className="text-[10px] text-white/40 truncate">
                  {work.title_en}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-white/30">
                    {work.genre}
                  </span>
                  <span className="text-[10px] text-white/30">
                    {work.year}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
