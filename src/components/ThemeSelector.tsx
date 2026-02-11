"use client";

import { useRouter } from "next/navigation";

type ThemeCard = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  active: boolean;
};

const themes: ThemeCard[] = [
  {
    id: "pilgrimage",
    emoji: "🎌",
    title: "アニメ聖地巡礼",
    description: "50作品の聖地を巡る旅。名シーンの舞台を実際に歩こう",
    active: true,
  },
  {
    id: "powerspot",
    emoji: "⛩",
    title: "パワースポット巡り",
    description: "全国の神社仏閣・霊場をめぐるスピリチュアル旅",
    active: false,
  },
  {
    id: "gourmet",
    emoji: "🍜",
    title: "B級グルメツアー",
    description: "地元民が愛するご当地グルメを食べ尽くす旅",
    active: false,
  },
];

export default function ThemeSelector() {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {themes.map((theme) => (
        <button
          key={theme.id}
          onClick={() => {
            if (theme.active) {
              router.push(`/plan?theme=${theme.id}`);
            }
          }}
          disabled={!theme.active}
          className={`
            group relative rounded-xl p-6 text-left transition-all duration-200 overflow-hidden
            ${
              theme.active
                ? "bg-white border-[3px] border-navy shadow-[4px_4px_0px_0px_#1A365D] hover:shadow-[7px_7px_0px_0px_#1A365D] hover:-translate-x-1 hover:-translate-y-1.5 hover:scale-[1.02] cursor-pointer"
                : "bg-warm-100 border-2 border-warm-200 cursor-not-allowed opacity-60"
            }
          `}
        >
          {/* 背景集中線パターン（アクティブカードのみ） */}
          {theme.active && (
            <div className="absolute inset-0 manga-speed-lines opacity-40 pointer-events-none" />
          )}

          {/* Coming Soon バッジ */}
          {!theme.active && (
            <span className="absolute top-3 right-3 bg-navy/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
              Coming Soon
            </span>
          )}

          <div className="relative">
            <span className="text-5xl block mb-3 group-hover:scale-110 transition-transform duration-200">
              {theme.emoji}
            </span>
            <h3
              className={`text-lg font-extrabold mb-1.5 ${
                theme.active ? "text-navy" : "text-navy/50"
              }`}
            >
              {theme.title}
            </h3>
            <p
              className={`text-sm leading-relaxed ${
                theme.active ? "text-navy/60" : "text-navy/35"
              }`}
            >
              {theme.description}
            </p>

            {/* 吹き出しCTA */}
            {theme.active && (
              <div className="mt-4 relative inline-flex items-center gap-1.5 bg-accent text-white text-sm font-bold px-5 py-2 rounded-full shadow-[2px_2px_0px_0px_rgba(197,48,48,0.5)] group-hover:shadow-[3px_3px_0px_0px_rgba(197,48,48,0.5)] transition-shadow">
                <span>プランを作る</span>
                <svg
                  className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                {/* 吹き出しの尻尾 */}
                <div className="absolute -top-1 left-5 w-2.5 h-2.5 bg-accent rotate-45" />
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
