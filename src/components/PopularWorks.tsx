"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { getWorkVisual } from "@/lib/work-visuals";

type Work = {
  title: string;
  title_en: string;
  year: number;
  genre: string;
  spotCount: number;
};

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
        {works.map((work) => {
          const visual = getWorkVisual(work.title);

          return (
            <button
              key={work.title}
              onClick={() =>
                router.push(
                  `/plan?theme=pilgrimage&work=${encodeURIComponent(work.title)}`
                )
              }
              className="snap-start shrink-0 w-56 rounded-2xl overflow-hidden bg-white
                         border-2 border-navy/15
                         shadow-[3px_3px_0px_0px_rgba(26,54,93,0.12)]
                         hover:shadow-[5px_5px_0px_0px_rgba(26,54,93,0.18)]
                         hover:-translate-x-0.5 hover:-translate-y-1
                         transition-all duration-200 text-left"
            >
              {/* ポスター風ヘッダー（5層構造） */}
              <div className="relative h-36 overflow-hidden">
                {/* Layer 1: ベースグラデーション */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${visual.gradient}`}
                />

                {/* Layer 2: SVGパターンオーバーレイ */}
                <div
                  className="absolute inset-0 opacity-60"
                  style={{
                    backgroundImage: visual.patternSvg,
                    backgroundRepeat: "repeat",
                  }}
                />

                {/* Layer 3: 中央アイコン（glow付き） */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-5xl drop-shadow-lg"
                    style={{
                      filter: `drop-shadow(0 0 20px ${visual.glowColor}) drop-shadow(0 0 40px ${visual.glowColor})`,
                    }}
                  >
                    {visual.icon}
                  </span>
                </div>

                {/* Layer 4: 下部フェード */}
                <div className="absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Layer 5: 作品名テキスト */}
                <span className="absolute bottom-2 left-3 right-3 text-white text-sm font-bold drop-shadow-md leading-tight">
                  {work.title}
                </span>
              </div>

              {/* カード本文 */}
              <div className="p-4">
                <p className="text-xs text-navy/40 mb-1">{work.title_en}</p>
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
          );
        })}
      </div>
    </div>
  );
}
