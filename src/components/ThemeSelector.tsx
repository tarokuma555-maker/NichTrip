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
    description: "12作品の聖地を巡る旅。名シーンの舞台を実際に歩こう",
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
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            relative rounded-2xl p-6 text-left transition-all duration-200
            ${
              theme.active
                ? "bg-white border-[3px] border-navy shadow-[4px_4px_0px_0px_#1A365D] hover:shadow-[6px_6px_0px_0px_#1A365D] hover:-translate-x-0.5 hover:-translate-y-1 cursor-pointer"
                : "bg-warm-100 border-2 border-warm-200 cursor-not-allowed opacity-70"
            }
          `}
        >
          {/* Coming Soon バッジ */}
          {!theme.active && (
            <span className="absolute top-3 right-3 bg-warm-300 text-navy text-[11px] font-bold px-2.5 py-1 rounded-full">
              Coming Soon
            </span>
          )}

          <span className="text-4xl block mb-3">{theme.emoji}</span>
          <h3
            className={`text-lg font-bold mb-1 ${
              theme.active ? "text-navy" : "text-navy/50"
            }`}
          >
            {theme.title}
          </h3>
          <p
            className={`text-sm leading-relaxed ${
              theme.active ? "text-navy/70" : "text-navy/40"
            }`}
          >
            {theme.description}
          </p>

          {/* 吹き出しCTA */}
          {theme.active && (
            <div className="mt-4 relative inline-flex items-center gap-1.5 bg-accent text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md">
              <span>プランを作る</span>
              <svg
                className="w-4 h-4"
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
        </button>
      ))}
    </div>
  );
}
