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

const tentTriangles = svg(
  36,
  36,
  `%3Cpolygon points='18,4 32,32 4,32' fill='none' stroke='rgba(255,255,255,0.08)' stroke-width='1'/%3E`
);

const treadPattern = svg(
  20,
  10,
  `%3Crect x='1' y='2' width='8' height='6' rx='1' fill='rgba(255,255,255,0.06)'/%3E%3Crect x='11' y='2' width='8' height='6' rx='1' fill='rgba(255,255,255,0.06)'/%3E`
);

const petals = svg(
  40,
  40,
  `%3Ccircle cx='10' cy='10' r='3' fill='rgba(255,255,255,0.08)'/%3E%3Ccircle cx='30' cy='28' r='2' fill='rgba(255,255,255,0.06)'/%3E%3Ccircle cx='22' cy='8' r='1.5' fill='rgba(255,255,255,0.05)'/%3E%3Ccircle cx='8' cy='32' r='2.5' fill='rgba(255,255,255,0.07)'/%3E`
);

const stars = svg(
  30,
  30,
  `%3Cpolygon points='15,2 18,11 27,11 20,17 22,27 15,21 8,27 10,17 3,11 12,11' fill='rgba(255,255,255,0.06)'/%3E`
);

const basketLines = svg(
  28,
  28,
  `%3Ccircle cx='14' cy='14' r='10' fill='none' stroke='rgba(255,255,255,0.08)' stroke-width='1'/%3E%3Cline x1='4' y1='14' x2='24' y2='14' stroke='rgba(255,255,255,0.06)' stroke-width='0.8'/%3E%3Cpath d='M10,4 Q14,14 10,24' fill='none' stroke='rgba(255,255,255,0.06)' stroke-width='0.8'/%3E%3Cpath d='M18,4 Q14,14 18,24' fill='none' stroke='rgba(255,255,255,0.06)' stroke-width='0.8'/%3E`
);

export const WORK_VISUALS: Record<string, WorkVisual> = {
  "君の名は。": {
    gradient: "from-indigo-600 via-purple-500 to-pink-400",
    patternSvg: cometDots,
    icon: "☄️",
    glowColor: "#a78bfa",
    image: "/images/works/your-name.jpg",
  },
  "スラムダンク": {
    gradient: "from-orange-500 via-red-500 to-red-700",
    patternSvg: basketLines,
    icon: "🏀",
    glowColor: "#fb923c",
    image: "/images/works/slam-dunk.jpg",
  },
  "呪術廻戦": {
    gradient: "from-slate-900 via-indigo-900 to-purple-900",
    patternSvg: ripples,
    icon: "👁️",
    glowColor: "#7c3aed",
    image: "/images/works/jujutsu-kaisen.jpg",
  },
  "鬼滅の刃": {
    gradient: "from-emerald-700 via-teal-600 to-slate-900",
    patternSvg: ichimatsu,
    icon: "⚔️",
    glowColor: "#10b981",
    image: "/images/works/demon-slayer.jpg",
  },
  "ぼっち・ざ・ろっく！": {
    gradient: "from-pink-400 via-rose-300 to-blue-300",
    patternSvg: musicLines,
    icon: "🎸",
    glowColor: "#f472b6",
    image: "/images/works/bocchi.jpg",
  },
  "すずめの戸締まり": {
    gradient: "from-sky-400 via-cyan-300 to-amber-200",
    patternSvg: doorFrames,
    icon: "🚪",
    glowColor: "#38bdf8",
    image: "/images/works/suzume.jpg",
  },
  "ゆるキャン△": {
    gradient: "from-sky-300 via-blue-200 to-orange-200",
    patternSvg: tentTriangles,
    icon: "⛺",
    glowColor: "#7dd3fc",
    image: "/images/works/yurucamp.jpg",
  },
  "ガールズ＆パンツァー": {
    gradient: "from-green-700 via-green-600 to-amber-600",
    patternSvg: treadPattern,
    icon: "🎖️",
    glowColor: "#a3e635",
    image: "/images/works/garupan.jpg",
  },
  "あの日見た花の名前を僕達はまだ知らない。": {
    gradient: "from-blue-300 via-sky-100 to-green-100",
    patternSvg: petals,
    icon: "🌸",
    glowColor: "#93c5fd",
    image: "/images/works/anohana.jpg",
  },
  "ラブライブ!": {
    gradient: "from-pink-400 via-orange-300 to-yellow-200",
    patternSvg: stars,
    icon: "⭐",
    glowColor: "#f9a8d4",
    image: "/images/works/lovelive.jpg",
  },
};

const DEFAULT_VISUAL: WorkVisual = {
  gradient: "from-gray-500 via-gray-400 to-gray-300",
  patternSvg: cometDots,
  icon: "🗺️",
  glowColor: "#9ca3af",
  image: "",
};

export function getWorkVisual(title: string): WorkVisual {
  return WORK_VISUALS[title] ?? DEFAULT_VISUAL;
}
