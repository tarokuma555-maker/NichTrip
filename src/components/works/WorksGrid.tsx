"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { getWorkVisual } from "@/lib/work-visuals";

type WorkItem = {
  slug: string;
  title: string;
  title_en: string;
  year: number;
  genre: string;
  spotCount: number;
};

const PAGE_SIZE = 24;

const GENRE_FILTERS = ["すべて", "TVアニメ", "映画", "漫画", "OVA"] as const;
const YEAR_FILTERS = ["すべて", "2020s", "2010s", "2000s", "~1999"] as const;

function matchYear(year: number, filter: string): boolean {
  switch (filter) {
    case "2020s":
      return year >= 2020;
    case "2010s":
      return year >= 2010 && year < 2020;
    case "2000s":
      return year >= 2000 && year < 2010;
    case "~1999":
      return year < 2000;
    default:
      return true;
  }
}

export default function WorksGrid({ works }: { works: WorkItem[] }) {
  const t = useTranslations("Works");
  const [search, setSearch] = useState("");
  const [genreFilter, setGenreFilter] = useState("すべて");
  const [yearFilter, setYearFilter] = useState("すべて");
  const [showCount, setShowCount] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return works.filter((w) => {
      if (q && !w.title.toLowerCase().includes(q) && !w.title_en.toLowerCase().includes(q)) {
        return false;
      }
      if (genreFilter !== "すべて" && w.genre !== genreFilter) return false;
      if (yearFilter !== "すべて" && !matchYear(w.year, yearFilter)) return false;
      return true;
    });
  }, [works, search, genreFilter, yearFilter]);

  const visible = filtered.slice(0, showCount);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-5 py-8 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-black text-white mb-1">
          {t("title")}
        </h1>
        <p className="text-xs text-white/30 font-bold">
          {t("totalWorks", { count: works.length })}
        </p>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowCount(PAGE_SIZE);
          }}
          placeholder={t("searchPlaceholder")}
          className="w-full bg-white/5 border-2 border-white/10 text-white text-sm font-medium
                     placeholder:text-white/20 px-4 py-2.5
                     focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20
                     transition-colors"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {GENRE_FILTERS.map((g) => (
          <button
            key={g}
            onClick={() => {
              setGenreFilter(g);
              setShowCount(PAGE_SIZE);
            }}
            className={`text-[11px] font-bold px-2.5 py-1 border transition-colors ${
              genreFilter === g
                ? "bg-red-500/20 border-red-500/40 text-red-400"
                : "bg-white/5 border-white/10 text-white/40 hover:text-white/60"
            }`}
          >
            {g === "すべて" ? t("filterAll") : g}
          </button>
        ))}
        <span className="w-px bg-white/10 mx-1" />
        {YEAR_FILTERS.map((y) => (
          <button
            key={y}
            onClick={() => {
              setYearFilter(y);
              setShowCount(PAGE_SIZE);
            }}
            className={`text-[11px] font-bold px-2.5 py-1 border transition-colors ${
              yearFilter === y
                ? "bg-red-500/20 border-red-500/40 text-red-400"
                : "bg-white/5 border-white/10 text-white/40 hover:text-white/60"
            }`}
          >
            {y === "すべて" ? t("filterAll") : y}
          </button>
        ))}
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <p className="text-sm text-white/30 text-center py-12">
          {t("noResults")}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {visible.map((work) => (
              <WorkCard key={work.slug} work={work} />
            ))}
          </div>

          {/* Show more */}
          {showCount < filtered.length && (
            <div className="text-center mt-6">
              <button
                onClick={() => setShowCount((c) => c + PAGE_SIZE)}
                className="text-xs font-black text-white/40 border-2 border-white/10 px-6 py-2
                           hover:border-red-500/30 hover:text-red-400 transition-colors"
              >
                {t("showMore")} ({filtered.length - showCount})
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function WorkCard({ work }: { work: WorkItem }) {
  const t = useTranslations("Works");
  const visual = getWorkVisual(work.title);

  return (
    <Link
      href={`/works/${work.slug}`}
      className="group block border-2 border-white/10 bg-white/[0.03] overflow-hidden
                 hover:border-red-500/30 hover:-translate-y-0.5
                 shadow-[2px_2px_0_rgba(0,0,0,0.3)] hover:shadow-[3px_3px_0_rgba(229,62,62,0.2)]
                 transition-all duration-200"
    >
      {/* Image / Gradient */}
      <div className="relative h-40 sm:h-48 overflow-hidden">
        {visual.image ? (
          <img
            src={visual.image}
            alt={work.title}
            className="absolute inset-0 w-full h-full object-cover
                       group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${visual.gradient}`} />
        )}
        <div
          className="absolute inset-0 opacity-30"
          style={{ backgroundImage: visual.patternSvg, backgroundRepeat: "repeat" }}
        />
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent" />

        {/* Spot count */}
        <div className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5">
          {t("spots", { count: work.spotCount })}
        </div>
      </div>

      {/* Info */}
      <div className="p-2.5">
        <p className="text-xs font-black text-white truncate">{work.title}</p>
        <p className="text-[10px] text-white/40 truncate">{work.title_en}</p>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-[10px] text-white/25">{work.genre}</span>
          <span className="text-[10px] text-white/25">{work.year}</span>
        </div>
      </div>
    </Link>
  );
}
