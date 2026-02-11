"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";

type Work = {
  title: string;
  title_en: string;
  year: number;
  genre: string;
  spotCount: number;
};

// 作品ごとのアクセントカラー
const CARD_COLORS = [
  "from-rose-400 to-orange-300",
  "from-sky-400 to-cyan-300",
  "from-violet-400 to-purple-300",
  "from-emerald-400 to-teal-300",
  "from-pink-400 to-fuchsia-300",
  "from-amber-400 to-yellow-300",
  "from-blue-400 to-indigo-300",
  "from-lime-400 to-green-300",
  "from-red-400 to-rose-300",
  "from-teal-400 to-emerald-300",
];

export default function PopularWorks({ works }: { works: Work[] }) {
  const router = useRouter();
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
        className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10
                   w-10 h-10 rounded-full bg-white border border-warm-200 shadow-lg
                   items-center justify-center hover:bg-warm-100 transition-colors"
      >
        <svg className="w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => scroll("right")}
        aria-label="右にスクロール"
        className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10
                   w-10 h-10 rounded-full bg-white border border-warm-200 shadow-lg
                   items-center justify-center hover:bg-warm-100 transition-colors"
      >
        <svg className="w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* カルーセル */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-2 -mx-1 px-1"
      >
        {works.map((work, i) => (
          <button
            key={work.title}
            onClick={() =>
              router.push(
                `/plan?theme=pilgrimage&work=${encodeURIComponent(work.title)}`
              )
            }
            className="snap-start shrink-0 w-56 rounded-2xl overflow-hidden bg-white
                       border border-warm-200 shadow-md hover:shadow-xl
                       hover:-translate-y-1 transition-all duration-200 text-left"
          >
            {/* カラーヘッダー */}
            <div
              className={`h-28 bg-gradient-to-br ${CARD_COLORS[i % CARD_COLORS.length]}
                          flex items-center justify-center`}
            >
              <span className="text-white text-2xl font-bold drop-shadow-md text-center px-3 leading-tight">
                {work.title}
              </span>
            </div>

            {/* カード本文 */}
            <div className="p-4">
              <p className="text-xs text-navy/40 mb-1">
                {work.title_en}
              </p>
              <div className="flex items-center gap-2 text-xs text-navy/60">
                <span className="bg-warm-100 px-2 py-0.5 rounded-full">
                  {work.genre}
                </span>
                <span>{work.year}</span>
              </div>
              <p className="mt-2 text-xs text-sub font-medium">
                {work.spotCount} スポット収録
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
