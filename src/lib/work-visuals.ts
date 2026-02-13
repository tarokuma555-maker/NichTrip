export type WorkVisual = {
  gradient: string;
  patternSvg: string;
  icon: string;
  glowColor: string;
  image: string;
};

const dot = (cx: number, cy: number, r: number, opacity: number) =>
  `%3Ccircle cx='${cx}' cy='${cy}' r='${r}' fill='rgba(255,255,255,${opacity})'/%3E`;

const svg = (w: number, h: number, inner: string) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}'%3E${inner}%3C/svg%3E")`;

const ichimatsu = svg(
  20,
  20,
  `%3Crect width='10' height='10' fill='rgba(255,255,255,0.08)'/%3E%3Crect x='10' y='10' width='10' height='10' fill='rgba(255,255,255,0.08)'/%3E`
);

const cometDots = svg(
  40,
  40,
  `${dot(5, 5, 1, 0.15)}${dot(20, 25, 1.5, 0.1)}${dot(35, 15, 0.8, 0.12)}${dot(12, 35, 1.2, 0.08)}`
);

const ripples = svg(
  30,
  30,
  `%3Ccircle cx='15' cy='15' r='8' fill='none' stroke='rgba(255,255,255,0.06)' stroke-width='1'/%3E%3Ccircle cx='15' cy='15' r='4' fill='none' stroke='rgba(255,255,255,0.08)' stroke-width='0.5'/%3E`
);

const musicLines = svg(
  24,
  24,
  `%3Cline x1='0' y1='6' x2='24' y2='6' stroke='rgba(255,255,255,0.06)' stroke-width='0.5'/%3E%3Cline x1='0' y1='12' x2='24' y2='12' stroke='rgba(255,255,255,0.06)' stroke-width='0.5'/%3E%3Cline x1='0' y1='18' x2='24' y2='18' stroke='rgba(255,255,255,0.06)' stroke-width='0.5'/%3E%3Ccircle cx='18' cy='9' r='2' fill='rgba(255,255,255,0.1)'/%3E`
);

const doorFrames = svg(
  32,
  32,
  `%3Crect x='8' y='2' width='16' height='28' rx='2' fill='none' stroke='rgba(255,255,255,0.07)' stroke-width='1'/%3E%3Cline x1='16' y1='2' x2='16' y2='30' stroke='rgba(255,255,255,0.04)' stroke-width='0.5'/%3E`
);

const crosshatch = svg(
  16,
  16,
  `%3Cline x1='0' y1='0' x2='16' y2='16' stroke='rgba(255,255,255,0.06)' stroke-width='0.5'/%3E%3Cline x1='16' y1='0' x2='0' y2='16' stroke='rgba(255,255,255,0.06)' stroke-width='0.5'/%3E`
);

const hexagons = svg(
  30,
  26,
  `%3Cpolygon points='15,1 27,7 27,19 15,25 3,19 3,7' fill='none' stroke='rgba(255,255,255,0.06)' stroke-width='0.8'/%3E`
);

const waves = svg(
  40,
  20,
  `%3Cpath d='M0,10 Q10,0 20,10 T40,10' fill='none' stroke='rgba(255,255,255,0.07)' stroke-width='0.8'/%3E`
);

const diamonds = svg(
  20,
  20,
  `%3Cpolygon points='10,2 18,10 10,18 2,10' fill='none' stroke='rgba(255,255,255,0.07)' stroke-width='0.8'/%3E`
);

const spirals = svg(
  30,
  30,
  `%3Cpath d='M15,15 Q15,5 25,15 Q25,25 15,25 Q5,25 5,15 Q5,10 15,10' fill='none' stroke='rgba(255,255,255,0.06)' stroke-width='0.5'/%3E`
);

const stars = svg(
  30,
  30,
  `%3Cpolygon points='15,2 18,11 27,11 20,17 22,27 15,21 8,27 10,17 3,11 12,11' fill='rgba(255,255,255,0.06)'/%3E`
);

const petals = svg(
  40,
  40,
  `%3Ccircle cx='10' cy='10' r='3' fill='rgba(255,255,255,0.08)'/%3E%3Ccircle cx='30' cy='28' r='2' fill='rgba(255,255,255,0.06)'/%3E%3Ccircle cx='22' cy='8' r='1.5' fill='rgba(255,255,255,0.05)'/%3E%3Ccircle cx='8' cy='32' r='2.5' fill='rgba(255,255,255,0.07)'/%3E`
);

const basketLines = svg(
  28,
  28,
  `%3Ccircle cx='14' cy='14' r='10' fill='none' stroke='rgba(255,255,255,0.08)' stroke-width='1'/%3E%3Cline x1='4' y1='14' x2='24' y2='14' stroke='rgba(255,255,255,0.06)' stroke-width='0.8'/%3E%3Cpath d='M10,4 Q14,14 10,24' fill='none' stroke='rgba(255,255,255,0.06)' stroke-width='0.8'/%3E%3Cpath d='M18,4 Q14,14 18,24' fill='none' stroke='rgba(255,255,255,0.06)' stroke-width='0.8'/%3E`
);

// ============================================================
// Top 50 anime by popularity (MAL International + Japanese Domestic)
// ============================================================
export const WORK_VISUALS: Record<string, WorkVisual> = {
  // --- MAL Popularity Top 40 (International) ---
  "進撃の巨人": {
    gradient: "from-stone-800 via-red-900 to-stone-900",
    patternSvg: crosshatch,
    icon: "🗡️",
    glowColor: "#dc2626",
    image: "/images/works/attack-on-titan.jpg",
  },
  "DEATH NOTE": {
    gradient: "from-black via-red-900 to-black",
    patternSvg: crosshatch,
    icon: "📓",
    glowColor: "#991b1b",
    image: "/images/works/death-note.jpg",
  },
  "鋼の錬金術師 BROTHERHOOD": {
    gradient: "from-red-700 via-amber-500 to-red-800",
    patternSvg: hexagons,
    icon: "⚗️",
    glowColor: "#f59e0b",
    image: "/images/works/fma-brotherhood.jpg",
  },
  "ワンパンマン": {
    gradient: "from-yellow-400 via-red-500 to-yellow-500",
    patternSvg: crosshatch,
    icon: "👊",
    glowColor: "#eab308",
    image: "/images/works/one-punch-man.jpg",
  },
  "鬼滅の刃": {
    gradient: "from-emerald-700 via-teal-600 to-slate-900",
    patternSvg: ichimatsu,
    icon: "⚔️",
    glowColor: "#10b981",
    image: "/images/works/demon-slayer.jpg",
  },
  "ソードアート・オンライン": {
    gradient: "from-blue-600 via-cyan-400 to-blue-800",
    patternSvg: hexagons,
    icon: "⚔️",
    glowColor: "#3b82f6",
    image: "/images/works/sword-art-online.jpg",
  },
  "僕のヒーローアカデミア": {
    gradient: "from-green-500 via-yellow-400 to-red-500",
    patternSvg: hexagons,
    icon: "💪",
    glowColor: "#22c55e",
    image: "/images/works/my-hero-academia.jpg",
  },
  "HUNTER×HUNTER": {
    gradient: "from-green-600 via-green-400 to-yellow-400",
    patternSvg: diamonds,
    icon: "🃏",
    glowColor: "#22c55e",
    image: "/images/works/hunter-x-hunter.jpg",
  },
  "NARUTO": {
    gradient: "from-orange-500 via-orange-400 to-blue-600",
    patternSvg: spirals,
    icon: "🍥",
    glowColor: "#f97316",
    image: "/images/works/naruto.jpg",
  },
  "東京喰種": {
    gradient: "from-black via-purple-900 to-red-900",
    patternSvg: crosshatch,
    icon: "🎭",
    glowColor: "#7c3aed",
    image: "/images/works/tokyo-ghoul.jpg",
  },
  "君の名は。": {
    gradient: "from-indigo-600 via-purple-500 to-pink-400",
    patternSvg: cometDots,
    icon: "☄️",
    glowColor: "#a78bfa",
    image: "/images/works/your-name.jpg",
  },
  "呪術廻戦": {
    gradient: "from-slate-900 via-indigo-900 to-purple-900",
    patternSvg: ripples,
    icon: "👁️",
    glowColor: "#7c3aed",
    image: "/images/works/jujutsu-kaisen.jpg",
  },
  "STEINS;GATE": {
    gradient: "from-green-600 via-amber-400 to-green-800",
    patternSvg: spirals,
    icon: "⏱️",
    glowColor: "#16a34a",
    image: "/images/works/steins-gate.jpg",
  },
  "ONE PIECE": {
    gradient: "from-red-500 via-yellow-400 to-blue-500",
    patternSvg: waves,
    icon: "🏴‍☠️",
    glowColor: "#ef4444",
    image: "/images/works/one-piece.jpg",
  },
  "聲の形": {
    gradient: "from-sky-300 via-pink-200 to-amber-200",
    patternSvg: petals,
    icon: "🤟",
    glowColor: "#38bdf8",
    image: "/images/works/a-silent-voice.jpg",
  },
  "ノーゲーム・ノーライフ": {
    gradient: "from-red-500 via-yellow-400 to-purple-500",
    patternSvg: hexagons,
    icon: "🎮",
    glowColor: "#ef4444",
    image: "/images/works/no-game-no-life.jpg",
  },
  "コードギアス": {
    gradient: "from-red-600 via-purple-700 to-black",
    patternSvg: hexagons,
    icon: "👁️",
    glowColor: "#dc2626",
    image: "/images/works/code-geass.jpg",
  },
  "Re:ゼロから始める異世界生活": {
    gradient: "from-blue-800 via-purple-700 to-black",
    patternSvg: spirals,
    icon: "🔄",
    glowColor: "#7c3aed",
    image: "/images/works/re-zero.jpg",
  },
  "四月は君の嘘": {
    gradient: "from-pink-300 via-blue-200 to-yellow-200",
    patternSvg: musicLines,
    icon: "🎹",
    glowColor: "#f9a8d4",
    image: "/images/works/your-lie-in-april.jpg",
  },
  "とらドラ！": {
    gradient: "from-orange-400 via-pink-400 to-blue-400",
    patternSvg: stars,
    icon: "🐯",
    glowColor: "#fb923c",
    image: "/images/works/toradora.jpg",
  },
  "モブサイコ100": {
    gradient: "from-purple-500 via-pink-400 to-red-400",
    patternSvg: ripples,
    icon: "💯",
    glowColor: "#a855f7",
    image: "/images/works/mob-psycho-100.jpg",
  },
  "僕だけがいない街": {
    gradient: "from-blue-800 via-blue-600 to-red-500",
    patternSvg: spirals,
    icon: "🦋",
    glowColor: "#2563eb",
    image: "/images/works/erased.jpg",
  },
  "暗殺教室": {
    gradient: "from-yellow-400 via-green-400 to-yellow-300",
    patternSvg: crosshatch,
    icon: "🔫",
    glowColor: "#facc15",
    image: "/images/works/assassination-classroom.jpg",
  },
  "Angel Beats!": {
    gradient: "from-sky-400 via-white to-sky-400",
    patternSvg: musicLines,
    icon: "👼",
    glowColor: "#38bdf8",
    image: "/images/works/angel-beats.jpg",
  },
  "BLEACH": {
    gradient: "from-black via-orange-500 to-black",
    patternSvg: crosshatch,
    icon: "💀",
    glowColor: "#f97316",
    image: "/images/works/bleach.jpg",
  },
  "ハイキュー!!": {
    gradient: "from-orange-500 via-black to-orange-500",
    patternSvg: crosshatch,
    icon: "🏐",
    glowColor: "#f97316",
    image: "/images/works/haikyu.jpg",
  },
  "約束のネバーランド": {
    gradient: "from-green-800 via-emerald-600 to-black",
    patternSvg: diamonds,
    icon: "🌿",
    glowColor: "#059669",
    image: "/images/works/promised-neverland.jpg",
  },
  "この素晴らしい世界に祝福を!": {
    gradient: "from-yellow-400 via-green-400 to-blue-400",
    patternSvg: stars,
    icon: "✨",
    glowColor: "#facc15",
    image: "/images/works/konosuba.jpg",
  },
  "千と千尋の神隠し": {
    gradient: "from-red-600 via-amber-500 to-blue-700",
    patternSvg: doorFrames,
    icon: "🏯",
    glowColor: "#f59e0b",
    image: "/images/works/spirited-away.jpg",
  },
  "新世紀エヴァンゲリオン": {
    gradient: "from-purple-900 via-green-500 to-orange-500",
    patternSvg: hexagons,
    icon: "🤖",
    glowColor: "#22c55e",
    image: "/images/works/evangelion.jpg",
  },
  "ヴァイオレット・エヴァーガーデン": {
    gradient: "from-blue-400 via-indigo-300 to-purple-300",
    patternSvg: petals,
    icon: "✉️",
    glowColor: "#818cf8",
    image: "/images/works/violet-evergarden.jpg",
  },
  "青春ブタ野郎はバニーガール先輩の夢を見ない": {
    gradient: "from-sky-400 via-blue-300 to-purple-400",
    patternSvg: waves,
    icon: "🐰",
    glowColor: "#38bdf8",
    image: "/images/works/bunny-girl-senpai.jpg",
  },
  "Dr.STONE": {
    gradient: "from-green-500 via-lime-400 to-emerald-600",
    patternSvg: hexagons,
    icon: "🧪",
    glowColor: "#22c55e",
    image: "/images/works/dr-stone.jpg",
  },
  "かぐや様は告らせたい": {
    gradient: "from-red-400 via-pink-300 to-blue-300",
    patternSvg: stars,
    icon: "💕",
    glowColor: "#f87171",
    image: "/images/works/kaguya-sama.jpg",
  },
  "チェンソーマン": {
    gradient: "from-red-700 via-orange-600 to-yellow-500",
    patternSvg: crosshatch,
    icon: "🪚",
    glowColor: "#ef4444",
    image: "/images/works/chainsaw-man.jpg",
  },
  "SPY×FAMILY": {
    gradient: "from-red-500 via-black to-green-500",
    patternSvg: diamonds,
    icon: "🕵️",
    glowColor: "#ef4444",
    image: "/images/works/spy-family.jpg",
  },
  "ヴィンランド・サガ": {
    gradient: "from-amber-700 via-stone-600 to-blue-800",
    patternSvg: waves,
    icon: "⚓",
    glowColor: "#d97706",
    image: "/images/works/vinland-saga.jpg",
  },
  "PSYCHO-PASS": {
    gradient: "from-blue-900 via-cyan-600 to-blue-900",
    patternSvg: hexagons,
    icon: "🔍",
    glowColor: "#0891b2",
    image: "/images/works/psycho-pass.jpg",
  },
  "あの日見た花の名前を僕達はまだ知らない。": {
    gradient: "from-blue-300 via-sky-100 to-green-100",
    patternSvg: petals,
    icon: "🌸",
    glowColor: "#93c5fd",
    image: "/images/works/anohana.jpg",
  },
  "転生したらスライムだった件": {
    gradient: "from-blue-400 via-cyan-300 to-green-300",
    patternSvg: ripples,
    icon: "🫧",
    glowColor: "#22d3ee",
    image: "/images/works/reincarnated-slime.jpg",
  },
  // --- Japanese Domestic Popularity Top 10 ---
  "葬送のフリーレン": {
    gradient: "from-purple-400 via-blue-300 to-green-300",
    patternSvg: cometDots,
    icon: "🧙‍♀️",
    glowColor: "#a78bfa",
    image: "/images/works/frieren.jpg",
  },
  "推しの子": {
    gradient: "from-pink-500 via-purple-400 to-blue-500",
    patternSvg: stars,
    icon: "⭐",
    glowColor: "#ec4899",
    image: "/images/works/oshi-no-ko.jpg",
  },
  "スラムダンク": {
    gradient: "from-orange-500 via-red-500 to-red-700",
    patternSvg: basketLines,
    icon: "🏀",
    glowColor: "#fb923c",
    image: "/images/works/slam-dunk.jpg",
  },
  "魔法少女まどか☆マギカ": {
    gradient: "from-pink-500 via-purple-500 to-black",
    patternSvg: diamonds,
    icon: "💫",
    glowColor: "#ec4899",
    image: "/images/works/madoka-magica.jpg",
  },
  "涼宮ハルヒの憂鬱": {
    gradient: "from-yellow-400 via-orange-300 to-blue-400",
    patternSvg: stars,
    icon: "🎀",
    glowColor: "#facc15",
    image: "/images/works/haruhi.jpg",
  },
  "けいおん!": {
    gradient: "from-amber-400 via-pink-300 to-sky-300",
    patternSvg: musicLines,
    icon: "🎵",
    glowColor: "#fbbf24",
    image: "/images/works/k-on.jpg",
  },
  "ラブライブ!": {
    gradient: "from-pink-400 via-orange-300 to-yellow-200",
    patternSvg: stars,
    icon: "⭐",
    glowColor: "#f9a8d4",
    image: "/images/works/lovelive.jpg",
  },
  "薬屋のひとりごと": {
    gradient: "from-red-600 via-amber-500 to-emerald-500",
    patternSvg: diamonds,
    icon: "💊",
    glowColor: "#f59e0b",
    image: "/images/works/apothecary-diaries.jpg",
  },
  "天気の子": {
    gradient: "from-blue-400 via-sky-300 to-amber-300",
    patternSvg: cometDots,
    icon: "🌤️",
    glowColor: "#60a5fa",
    image: "/images/works/weathering-with-you.jpg",
  },
  "すずめの戸締まり": {
    gradient: "from-sky-400 via-cyan-300 to-amber-200",
    patternSvg: doorFrames,
    icon: "🚪",
    glowColor: "#38bdf8",
    image: "/images/works/suzume.jpg",
  },
  // --- Unmapped local images ---
  "化物語": {
    gradient: "from-purple-700 via-violet-500 to-purple-900",
    patternSvg: spirals,
    icon: "🦀",
    glowColor: "#7c3aed",
    image: "/images/works/bakemonogatari.jpg",
  },
  "ぼっち・ざ・ろっく！": {
    gradient: "from-pink-500 via-rose-400 to-pink-600",
    patternSvg: musicLines,
    icon: "🎸",
    glowColor: "#ec4899",
    image: "/images/works/bocchi.jpg",
  },
  "CLANNAD": {
    gradient: "from-amber-400 via-yellow-300 to-amber-500",
    patternSvg: petals,
    icon: "🌻",
    glowColor: "#f59e0b",
    image: "/images/works/clannad.jpg",
  },
  "花咲くいろは": {
    gradient: "from-pink-400 via-rose-300 to-amber-300",
    patternSvg: petals,
    icon: "🌸",
    glowColor: "#f472b6",
    image: "/images/works/hanasaku-iroha.jpg",
  },
  "氷菓": {
    gradient: "from-emerald-500 via-teal-400 to-emerald-600",
    patternSvg: diamonds,
    icon: "🔍",
    glowColor: "#10b981",
    image: "/images/works/hyouka.jpg",
  },
  "夏目友人帳": {
    gradient: "from-green-400 via-lime-300 to-green-500",
    patternSvg: petals,
    icon: "🐱",
    glowColor: "#84cc16",
    image: "/images/works/natsume-yuujinchou.jpg",
  },
  "響け！ユーフォニアム": {
    gradient: "from-amber-500 via-yellow-400 to-amber-600",
    patternSvg: musicLines,
    icon: "🎺",
    glowColor: "#f59e0b",
    image: "/images/works/sound-euphonium.jpg",
  },
  "たまゆら": {
    gradient: "from-pink-300 via-rose-200 to-amber-200",
    patternSvg: cometDots,
    icon: "📷",
    glowColor: "#fda4af",
    image: "/images/works/tamayura.jpg",
  },
  "東京リベンジャーズ": {
    gradient: "from-gray-700 via-slate-600 to-gray-800",
    patternSvg: crosshatch,
    icon: "🏍️",
    glowColor: "#64748b",
    image: "/images/works/tokyo-revengers.jpg",
  },
  "ゆるキャン△": {
    gradient: "from-sky-400 via-cyan-300 to-blue-400",
    patternSvg: cometDots,
    icon: "⛺",
    glowColor: "#38bdf8",
    image: "/images/works/yurucamp.jpg",
  },
  "機動戦士ガンダム 水星の魔女": {
    gradient: "from-red-600 via-rose-500 to-red-700",
    patternSvg: hexagons,
    icon: "🤖",
    glowColor: "#ef4444",
    image: "/images/works/gundam.jpg",
  },
  "ガンダム00": {
    gradient: "from-blue-600 via-indigo-500 to-blue-700",
    patternSvg: hexagons,
    icon: "🤖",
    glowColor: "#3b82f6",
    image: "/images/works/gundam.jpg",
  },
  "ガンダムSEED": {
    gradient: "from-violet-600 via-purple-500 to-violet-700",
    patternSvg: hexagons,
    icon: "🤖",
    glowColor: "#8b5cf6",
    image: "/images/works/gundam.jpg",
  },
};

const DEFAULT_VISUAL: WorkVisual = {
  gradient: "from-gray-500 via-gray-400 to-gray-300",
  patternSvg: cometDots,
  icon: "🗺️",
  glowColor: "#9ca3af",
  image: "",
};

import { getWorkImage } from "./work-images";

export const POSTER_TITLES = new Set(Object.keys(WORK_VISUALS));

export function hasPoster(title: string): boolean {
  if (POSTER_TITLES.has(title)) return true;
  return !!getWorkImage(title);
}

export function getWorkVisual(title: string): WorkVisual {
  const manual = WORK_VISUALS[title];
  if (manual) return manual;

  // Check AniList-fetched image as fallback
  const anilistImage = getWorkImage(title);
  if (anilistImage) {
    return { ...DEFAULT_VISUAL, image: anilistImage };
  }

  return DEFAULT_VISUAL;
}
