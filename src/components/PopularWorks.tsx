"use client";

import { useRef } from "react";
import { Link } from "@/i18n/navigation";
import { getWorkVisual } from "@/lib/work-visuals";

type Work = {
  slug: string;
  title: string;
  title_en: string;
  year: number;
  genre: string;
  spotCount: number;
};

export default function PopularWorks({ works }: { works: Work[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return;
    const amount = 280;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -amount : amount,
      behavior: "smooth",
    });
  }

  return (
    <div className="relative">
      {/* スクロールボタン（PC向け） */}
      <button
        onClick={() => scroll("left")}
        aria-label="左にスクロール"
        className="hidden sm:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10
                   w-11 h-11 rounded-full bg-white border-2 border-navy/20 shadow-lg
                   items-center justify-center hover:bg-navy hover:text-white hover:border-navy transition-all duration-200"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => scroll("right")}
        aria-label="右にスクロール"
        className="hidden sm:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10
                   w-11 h-11 rounded-full bg-white border-2 border-navy/20 shadow-lg
                   items-center justify-center hover:bg-navy hover:text-white hover:border-navy transition-all duration-200"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* カルーセル */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-3 -mx-1 px-1"
      >
        {works.map((work) => {
          const visual = getWorkVisual(work.title);

          return (
            <Link
              key={work.slug}
              href={`/works/${work.slug}`}
              className="group snap-start shrink-0 w-52 rounded-xl overflow-hidden bg-white
                         border-[3px] border-navy/20
                         shadow-[4px_4px_0px_0px_rgba(26,54,93,0.15)]
                         hover:shadow-[6px_6px_0px_0px_rgba(26,54,93,0.25)]
                         hover:-translate-x-0.5 hover:-translate-y-1
                         hover:border-accent
                         transition-all duration-200 text-left block"
            >
              {/* ポスター画像ヘッダー */}
              <div className="relative h-64 overflow-hidden">
                {/* ポスター画像 */}
                {visual.image ? (
                  <img
                    src={visual.image}
                    alt={work.title}
                    className="absolute inset-0 w-full h-full object-cover
                               group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${visual.gradient}`}
                  />
                )}

                {/* SVGパターンオーバーレイ */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: visual.patternSvg,
                    backgroundRepeat: "repeat",
                  }}
                />

                {/* 下部グラデーションフェード */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* 作品名テキスト */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <p className="text-white text-sm font-extrabold drop-shadow-lg leading-tight">
                    {work.title}
                  </p>
                  <p className="text-white/60 text-[10px] mt-0.5 drop-shadow">
                    {work.title_en}
                  </p>
                </div>

                {/* スポット数バッジ */}
                <div className="absolute top-2 right-2 bg-accent text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md">
                  {work.spotCount} spots
                </div>
              </div>

              {/* カード本文 */}
              <div className="p-3 bg-white">
                <div className="flex items-center justify-between">
                  <span className="bg-navy/5 text-navy/70 text-[11px] font-semibold px-2.5 py-1 rounded-full border border-navy/10">
                    {work.genre}
                  </span>
                  <span className="text-[11px] text-navy/40 font-medium">
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
