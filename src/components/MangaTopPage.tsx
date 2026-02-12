"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getWorkVisual } from "@/lib/work-visuals";
import { useAuth } from "@/components/AuthProvider";

gsap.registerPlugin(ScrollTrigger);

type Work = {
  title: string;
  title_en: string;
  year: number;
  genre: string;
  spotCount: number;
};


/* ================================================================
   SVG 装飾
   ================================================================ */

function SpeedLinesSVG({ className }: { className?: string }) {
  const lines = Array.from({ length: 72 }, (_, i) => {
    const angle = (i * 5 * Math.PI) / 180;
    return (
      <line
        key={i}
        x1="500"
        y1="500"
        x2={500 + 500 * Math.cos(angle)}
        y2={500 + 500 * Math.sin(angle)}
        stroke="currentColor"
        strokeWidth={i % 6 === 0 ? 3 : i % 3 === 0 ? 1.2 : 0.4}
        opacity={i % 6 === 0 ? 0.2 : 0.07}
      />
    );
  });
  return (
    <svg className={className} viewBox="0 0 1000 1000" fill="none">
      {lines}
    </svg>
  );
}

/* ポスター画像をステンシルアート風に表示 */
function PosterStencil({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden
      loading="lazy"
      decoding="async"
      className={`pointer-events-none select-none ${className}`}
      style={{
        filter: "grayscale(1) contrast(2.5)",
        mixBlendMode: "screen",
      }}
    />
  );
}

/* ================================================================
   Section 1: HERO
   ================================================================ */
function HeroSection() {
  const router = useRouter();

  return (
    <section className="hero-section relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* グリッド背景 */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(229,62,62,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(229,62,62,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* 集中線 */}
      <SpeedLinesSVG className="absolute inset-0 w-full h-full text-red-500 opacity-[0.10]" />

      {/* グロー */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-500/10 blur-[120px]" />

      {/* ハーフトーン */}
      <div className="absolute top-0 right-0 w-72 h-72 halftone-red opacity-[0.06] rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-56 h-56 halftone opacity-[0.04] rounded-tr-full" />

      {/* コマ枠 */}
      <div className="absolute inset-3 sm:inset-6 border border-white/10 pointer-events-none" />
      <div className="absolute inset-3 sm:inset-6">
        <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-l-[3px] border-t-[3px] border-red-500/60" />
        <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-r-[3px] border-t-[3px] border-red-500/60" />
        <div className="absolute bottom-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-l-[3px] border-b-[3px] border-red-500/60" />
        <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-r-[3px] border-b-[3px] border-red-500/60" />
      </div>

      {/* アニメポスターのステンシルアート背景 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <PosterStencil
          src="/images/works/demon-slayer.jpg"
          className="absolute top-[3%] right-[-8%] w-[250px] sm:w-[380px] opacity-[0.07] -rotate-[10deg]"
        />
        <PosterStencil
          src="/images/works/naruto.jpg"
          className="absolute top-[12%] left-[-10%] w-[220px] sm:w-[340px] opacity-[0.05] rotate-[8deg]"
        />
        <PosterStencil
          src="/images/works/attack-on-titan.jpg"
          className="absolute bottom-[12%] right-[2%] w-[200px] sm:w-[300px] opacity-[0.05] rotate-[15deg]"
        />
        <PosterStencil
          src="/images/works/one-piece.jpg"
          className="absolute bottom-[18%] left-[-5%] w-[180px] sm:w-[280px] opacity-[0.04] -rotate-[5deg]"
        />
      </div>

      {/* メインコンテンツ */}
      <div className="hero-content relative z-10 text-center px-4 sm:px-6 max-w-4xl">
        <div className="hero-badge mb-4 sm:mb-6">
          <span className="inline-block bg-red-500 text-white text-[9px] sm:text-xs font-black tracking-[0.3em] sm:tracking-[0.4em] px-4 sm:px-5 py-2 sm:py-2.5 uppercase border border-red-400/30">
            Anime Pilgrimage Planner
          </span>
        </div>

        <h1 className="hero-title text-[56px] sm:text-[120px] lg:text-[160px] font-black leading-[0.85] tracking-tighter">
          <span className="block text-white manga-shadow-red">Anime</span>
          <span className="block text-red-500 manga-shadow">Trips</span>
        </h1>

        <div className="hero-bubble mt-6 sm:mt-8">
          <p className="text-sm sm:text-lg font-bold text-white/70 leading-relaxed">
            あの聖地へ、
            <span className="text-red-400 font-black">物語の世界</span>
            へ。
            <br className="sm:hidden" />
            聖地巡礼プランを提案します。
          </p>
        </div>

        {/* CTAボタン */}
        <div className="hero-cta mt-8 sm:mt-10">
          <button
            onClick={() => router.push("/plan?theme=pilgrimage")}
            className="group inline-flex items-center gap-3
                       bg-red-500 text-white text-base sm:text-lg font-black
                       px-10 sm:px-14 py-4 sm:py-5 rounded-full
                       border-2 border-red-400/30
                       shadow-[0_0_40px_rgba(229,62,62,0.3)]
                       hover:shadow-[0_0_60px_rgba(229,62,62,0.5)]
                       hover:bg-red-600
                       active:scale-[0.97]
                       transition-all duration-200"
          >
            <span>Start Your Journey</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>

        <div className="hero-scroll mt-8 sm:mt-10 flex flex-col items-center gap-2">
          <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase">
            Scroll Down
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-red-500/60 to-transparent animate-bounce-down" />
        </div>
      </div>

      {/* 斜め区切り */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 bg-[#0a0a0a]"
        style={{ clipPath: "polygon(0 60%, 100% 0%, 100% 100%, 0% 100%)" }}
      />
    </section>
  );
}

/* ================================================================
   Section 2: ABOUT
   ================================================================ */
function AboutSection() {
  return (
    <section className="about-section relative bg-[#0a0a0a] py-20 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 halftone opacity-[0.03]" />
      <div className="absolute top-0 left-0 right-0 h-4 stripe-diagonal-bold" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 mb-12 sm:mb-16">
        <div className="flex items-end gap-4">
          <h2 className="about-heading text-4xl sm:text-7xl font-black text-white manga-shadow-red leading-none">
            ABOUT
          </h2>
          <div className="h-1 w-16 sm:w-20 bg-red-500 mb-2" />
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-5">
          {/* パネル1 */}
          <div className="about-card sm:col-span-7 relative overflow-hidden">
            <div className="bg-white text-black p-6 sm:p-12 min-h-[240px] sm:min-h-[300px] flex flex-col justify-center border-[3px] border-white shadow-[6px_6px_0px_0px_rgba(229,62,62,0.5)]">
              <span className="text-[10px] font-black tracking-[0.4em] text-red-500 uppercase mb-3 sm:mb-4">
                01 — Concept
              </span>
              <h3 className="text-2xl sm:text-5xl font-black mb-3 sm:mb-4 leading-tight">
                AnimeTripsとは<span className="text-red-500">?</span>
              </h3>
              <p className="text-sm sm:text-base text-black/60 leading-relaxed max-w-md">
                好きなアニメを選ぶだけで、作品の舞台やロケ地を巡る聖地巡礼プランを自動生成。あなただけの「推し旅」がここから始まります。
              </p>
              <div className="absolute -bottom-4 -right-4 w-24 sm:w-32 h-24 sm:h-32 halftone opacity-[0.06] rounded-tl-full" />
            </div>
          </div>

          {/* パネル2 & 3 */}
          <div className="sm:col-span-5 flex flex-col gap-4 sm:gap-5">
            <div className="about-card relative overflow-hidden flex-1">
              <div className="bg-red-500 text-white p-5 sm:p-8 h-full flex flex-col justify-center border-[3px] border-red-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)]">
                <span className="text-[10px] font-black tracking-[0.4em] text-white/50 uppercase mb-2 sm:mb-3">
                  02 — Data
                </span>
                <h3 className="text-xl sm:text-4xl font-black mb-2">
                  500<span className="text-lg sm:text-2xl">+</span>作品
                  <br />
                  1,900<span className="text-lg sm:text-2xl">+</span>スポット
                </h3>
                <p className="text-xs sm:text-sm text-white/70">
                  日本の全アニメ作品に対応。聖地情報を自動検索しルートを計算。
                </p>
              </div>
            </div>

            <div className="about-card relative overflow-hidden flex-1">
              <div className="bg-[#111] text-white p-5 sm:p-8 h-full flex flex-col justify-center border-[3px] border-white/20 shadow-[4px_4px_0px_0px_rgba(229,62,62,0.3)]">
                <span className="text-[10px] font-black tracking-[0.4em] text-red-500 uppercase mb-2 sm:mb-3">
                  03 — Map
                </span>
                <h3 className="text-xl sm:text-4xl font-black mb-2">
                  Google Maps
                  <br />
                  ルート表示
                </h3>
                <p className="text-xs sm:text-sm text-white/50">
                  生成プランをマップ上にルート表示。シェア機能でSNS投稿も。
                </p>
                <div className="absolute inset-0 stripe-diagonal opacity-20 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Plan カード — Maps セクションの下 */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 mt-4 sm:mt-5">
        <div className="about-card relative overflow-hidden">
          <div className="bg-gradient-to-r from-red-500/10 to-red-900/10 text-white p-6 sm:p-8 border-[3px] border-red-500/30 shadow-[4px_4px_0px_0px_rgba(229,62,62,0.3)]">
            <span className="text-[10px] font-black tracking-[0.4em] text-red-400 uppercase mb-2 sm:mb-3 block">
              04 — Pro Plan
            </span>
            <h3 className="text-xl sm:text-3xl font-black mb-3">
              <span className="text-red-500">Pro</span>でもっと自由に
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="flex items-start gap-2">
                <span className="shrink-0 w-5 h-5 bg-red-500 flex items-center justify-center text-white text-[10px] font-black mt-0.5">✓</span>
                <div>
                  <p className="text-sm font-black">複数作品ミックス</p>
                  <p className="text-[11px] text-white/40">2〜3作品を組み合わせた巡礼</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="shrink-0 w-5 h-5 bg-red-500 flex items-center justify-center text-white text-[10px] font-black mt-0.5">✓</span>
                <div>
                  <p className="text-sm font-black">プラン生成 無制限</p>
                  <p className="text-[11px] text-white/40">月3回の制限なし</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="shrink-0 w-5 h-5 bg-red-500 flex items-center justify-center text-white text-[10px] font-black mt-0.5">✓</span>
                <div>
                  <p className="text-sm font-black">レビュー全件閲覧</p>
                  <p className="text-[11px] text-white/40">他の旅行者のTipsすべて</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ステンシルアート */}
      <PosterStencil
        src="/images/works/jujutsu-kaisen.jpg"
        className="absolute bottom-[5%] right-[2%] w-[180px] sm:w-[280px] opacity-[0.04] -rotate-[8deg]"
      />
    </section>
  );
}

/* ================================================================
   ポスターカード（画像読み込みエラー対応付き）
   ================================================================ */
function PosterCard({ work }: { work: Work }) {
  const router = useRouter();
  const visual = getWorkVisual(work.title);
  const [imgError, setImgError] = useState(false);

  return (
    <button
      onClick={() =>
        router.push(
          `/plan?theme=pilgrimage&work=${encodeURIComponent(work.title)}`
        )
      }
      className="group relative overflow-hidden text-left rounded-lg
                 border border-white/10 hover:border-red-500/60
                 transition-colors duration-200"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
        {/* グラデーション背景（プレースホルダー兼フォールバック） */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${visual.gradient}`}
        />

        {/* ポスター画像 */}
        {visual.image && !imgError && (
          <img
            src={visual.image}
            alt={work.title}
            className="absolute inset-0 w-full h-full object-cover object-center"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}

        {/* テキスト用オーバーレイ（下部のみ、軽め） */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
          <p className="text-white text-[11px] sm:text-sm font-black drop-shadow-lg leading-tight mb-1">
            {work.title}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-white/50 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider">
              {work.genre}
            </span>
            <span className="text-red-400 text-[8px] sm:text-[9px] font-black">
              {work.spotCount}spots
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

/* ================================================================
   Section 3: POSTER GALLERY (50 works with images, shuffled)
   ================================================================ */
function PosterGallerySection({ works }: { works: Work[] }) {
  const [search, setSearch] = useState("");
  const [shuffled, setShuffled] = useState<Work[]>(works);

  // Fisher-Yates shuffle on client mount
  useEffect(() => {
    const arr = [...works];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffled(arr);
  }, [works]);

  const filtered = shuffled.filter((w) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      w.title.toLowerCase().includes(q) ||
      w.title_en.toLowerCase().includes(q) ||
      w.genre.toLowerCase().includes(q)
    );
  });

  return (
    <section className="relative bg-[#0a0a0a] py-20 sm:py-32">
      {/* ヘッダー */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
        <div className="flex items-end gap-4 mb-2">
          <h2 className="text-4xl sm:text-8xl font-black text-white manga-shadow-red leading-none">
            WORKS
          </h2>
          <span className="text-red-500 text-lg sm:text-3xl font-black mb-1 sm:mb-2">
            PICK UP
          </span>
        </div>
        <div className="h-1 w-24 sm:w-32 bg-red-500" />
        <p className="mt-3 text-white/40 text-xs sm:text-sm font-medium tracking-wider">
          人気作品 — タップしてプランを作成
        </p>

        {/* 検索バー */}
        <div className="mt-5 sm:mt-6 relative max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="作品名で検索..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5
                       text-sm text-white placeholder:text-white/30
                       focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20
                       transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* カードグリッド */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
          {filtered.map((work) => (
            <PosterCard key={work.title} work={work} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white/30 text-sm">該当する作品が見つかりません</p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ================================================================
   Section 3b: ALL WORKS (title-only list, grouped by decade)
   ================================================================ */
const DECADES = [
  { label: "2020s", min: 2020, max: 2029 },
  { label: "2010s", min: 2010, max: 2019 },
  { label: "2000s", min: 2000, max: 2009 },
  { label: "1990s", min: 1995, max: 1999 },
] as const;

function TitleListSection({ works }: { works: Work[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    "2020s": true,
    "2010s": false,
    "2000s": false,
    "1990s": false,
  });

  const filtered = works.filter((w) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      w.title.toLowerCase().includes(q) ||
      w.title_en.toLowerCase().includes(q) ||
      w.genre.toLowerCase().includes(q)
    );
  });

  const grouped = DECADES.map((d) => ({
    ...d,
    works: filtered
      .filter((w) => w.year >= d.min && w.year <= d.max)
      .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title)),
  })).filter((g) => g.works.length > 0);

  // 検索中は全て展開
  const isSearching = search.trim().length > 0;

  return (
    <section className="allworks-section relative bg-[#0a0a0a] py-20 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 halftone opacity-[0.02]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* ヘッダー */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-end gap-4 mb-2">
            <h2 className="allworks-heading text-4xl sm:text-8xl font-black text-white manga-shadow-red leading-none">
              ALL
            </h2>
            <span className="text-red-500 text-lg sm:text-3xl font-black mb-1 sm:mb-2">
              {works.length}+
            </span>
          </div>
          <div className="h-1 w-24 sm:w-32 bg-red-500" />
          <p className="mt-3 text-white/40 text-xs sm:text-sm font-medium tracking-wider">
            対応作品一覧 — タップしてプランを作成
          </p>

          {/* 検索バー */}
          <div className="mt-5 sm:mt-6 relative max-w-md">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="作品名で検索..."
              className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5
                         text-sm text-white placeholder:text-white/30
                         focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20
                         transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* 年代別グループ */}
        <div className="space-y-6">
          {grouped.map((group) => {
            const isOpen = isSearching || expanded[group.label];
            return (
              <div key={group.label}>
                <button
                  onClick={() =>
                    !isSearching &&
                    setExpanded((prev) => ({
                      ...prev,
                      [group.label]: !prev[group.label],
                    }))
                  }
                  className="w-full flex items-center gap-3 mb-3 group"
                >
                  <span className="text-red-500 text-sm sm:text-lg font-black tracking-wider">
                    {group.label}
                  </span>
                  <span className="text-white/30 text-xs font-bold">
                    {group.works.length}作品
                  </span>
                  <div className="flex-1 h-px bg-white/10" />
                  <svg
                    className={`w-4 h-4 text-white/30 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isOpen && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
                    {group.works.map((work) => (
                      <button
                        key={work.title}
                        onClick={() =>
                          router.push(
                            `/plan?theme=pilgrimage&work=${encodeURIComponent(work.title)}`
                          )
                        }
                        className="allworks-item group flex items-center gap-3 px-3 py-2.5
                                   bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-red-500/30
                                   rounded-lg transition-all duration-200 text-left"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-white/80 text-xs sm:text-sm font-bold truncate group-hover:text-white transition-colors">
                            {work.title}
                          </p>
                        </div>
                        <span className="text-white/20 text-[10px] font-bold shrink-0">
                          {work.year}
                        </span>
                        <span className="text-red-500/50 text-[10px] font-bold shrink-0">
                          {work.spotCount}spots
                        </span>
                        <svg
                          className="w-3 h-3 text-white/15 group-hover:text-red-500/60 shrink-0 transition-colors"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white/30 text-sm">該当する作品が見つかりません</p>
          </div>
        )}
      </div>
    </section>
  );
}

/* ================================================================
   Section 4: CTA
   ================================================================ */
function CTASection() {
  const router = useRouter();

  return (
    <section className="relative bg-black overflow-hidden flex items-center justify-center py-24 sm:py-32">
      {/* 背景グロー */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-red-500/10 blur-[120px]" />

      {/* コンテンツ */}
      <div className="relative text-center px-6 max-w-lg w-full">
        {/* 英語キャッチ */}
        <p className="text-[10px] sm:text-xs font-black tracking-[0.4em] text-red-500/70 uppercase mb-4 sm:mb-5">
          Your Story Awaits
        </p>

        {/* メイン見出し */}
        <h2 className="text-4xl sm:text-6xl font-black text-white leading-[1.1] mb-5 sm:mb-6">
          あの場所へ、
          <br />
          <span className="text-red-500">会いに行こう。</span>
        </h2>

        {/* サブテキスト */}
        <p className="text-sm sm:text-base text-white/40 leading-relaxed mb-8 sm:mb-10">
          好きな作品を選ぶだけ。
          <br />
          聖地巡礼の旅プランを
          <br className="sm:hidden" />
          自動で作成します。
        </p>

        {/* CTAボタン */}
        <button
          onClick={() => router.push("/plan?theme=pilgrimage")}
          className="group inline-flex items-center gap-3
                     bg-red-500 text-white text-base sm:text-lg font-black
                     px-10 sm:px-14 py-4 sm:py-5 rounded-full
                     border-2 border-red-400/30
                     shadow-[0_0_40px_rgba(229,62,62,0.3)]
                     hover:shadow-[0_0_60px_rgba(229,62,62,0.5)]
                     hover:bg-red-600
                     active:scale-[0.97]
                     transition-all duration-200"
        >
          <span>Start Your Journey</span>
          <svg
            className="w-5 h-5 group-hover:translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </button>

        {/* フッター */}
        <p className="text-[9px] sm:text-[10px] text-white/15 font-bold tracking-[0.2em] mt-12 sm:mt-16">
          &copy; 2025 AnimeTrips
        </p>
      </div>
    </section>
  );
}

/* ================================================================
   Section: PRO PLAN
   ================================================================ */
function ProSection() {
  const { isPro } = useAuth();
  const router = useRouter();

  if (isPro) return null;

  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-1.244 1.007-2.25 2.25-2.25h13.5" />
        </svg>
      ),
      title: "複数作品ミックス巡礼",
      desc: "2〜3作品を組み合わせて1つのプランに",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182M21.015 4.356v4.992" />
        </svg>
      ),
      title: "プラン生成 無制限",
      desc: "月3回の制限なし、何度でも生成",
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "レビュー全件閲覧",
      desc: "他の旅行者のTips・写真すべて",
    },
  ];

  return (
    <section className="pro-section relative bg-[#0a0a0a] py-12 sm:py-20 overflow-hidden">
      {/* 赤グロー背景 */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-red-500/5 blur-[100px]" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* ヘッダー */}
        <div className="text-center mb-6 sm:mb-8">
          <span className="inline-block bg-red-500/10 text-red-400 text-[10px] font-black tracking-[0.4em] px-4 py-2 border-2 border-red-500/30 mb-3">
            PRO PLAN
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight mb-2">
            もっと自由に、
            <br />
            <span className="text-red-500">もっと深く。</span>
          </h2>
          <p className="text-sm text-white/40 max-w-md mx-auto">
            プロプランでアニメ聖地巡礼をさらに充実させましょう
          </p>
        </div>

        {/* 特徴カード */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8">
          {features.map((f, i) => (
            <div
              key={i}
              className="pro-card bg-[#111] border-2 border-white/10 p-4 sm:p-5
                         hover:border-red-500/30 transition-colors flex items-start gap-3"
            >
              <span className="shrink-0 text-red-400 mt-0.5">{f.icon}</span>
              <div>
                <h3 className="text-sm sm:text-base font-black text-white mb-1">
                  {f.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-white/40">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 価格 + CTA */}
        <div className="text-center">
          <p className="text-2xl sm:text-3xl font-black text-white mb-2">
            月額<span className="text-red-500">480</span>円〜
          </p>
          <p className="text-xs text-white/30 mb-6">
            今なら3ヶ月間 月480円！4ヶ月目以降 ¥980/月
          </p>
          <button
            onClick={() => router.push("/pricing")}
            className="inline-flex items-center gap-2 bg-red-500 text-white text-sm sm:text-base font-black
                       px-8 sm:px-10 py-3.5 sm:py-4 border-2 border-red-400/30
                       shadow-[4px_4px_0_rgba(0,0,0,0.4)] hover:shadow-[2px_2px_0_rgba(0,0,0,0.4)]
                       hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-150"
          >
            プロプランを見る
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   Section: PLAN COMPARISON (Free vs Pro)
   ================================================================ */
const COMPARISON_ROWS: {
  label: string;
  free: string;
  pro: string;
  proHighlight?: boolean;
  freeLimit?: boolean;
}[] = [
  { label: "プラン生成回数", free: "月3回まで", pro: "無制限", proHighlight: true, freeLimit: true },
  { label: "作品選択", free: "1作品のみ", pro: "最大3作品ミックス", proHighlight: true, freeLimit: true },
  { label: "チャット相談", free: "月1回まで", pro: "無制限", proHighlight: true, freeLimit: true },
  { label: "プラン保存", free: "3件まで", pro: "無制限", proHighlight: true, freeLimit: true },
  { label: "UGCレビュー閲覧", free: "5件/スポット", pro: "無制限", proHighlight: true, freeLimit: true },
  { label: "交通チケット比較", free: "○", pro: "○" },
  { label: "宿泊施設比較", free: "○", pro: "○" },
  { label: "OGP画像付きシェア", free: "○", pro: "○" },
  { label: "UGCレビュー投稿", free: "○", pro: "○" },
  { label: "広告非表示", free: "×", pro: "○", proHighlight: true },
  { label: "優先サポート", free: "×", pro: "○", proHighlight: true },
];

function PlanComparisonSection() {
  const { isPro } = useAuth();
  const router = useRouter();

  return (
    <section className="relative bg-black py-20 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 halftone opacity-[0.02]" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        {/* ヘッダー */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="flex items-center justify-center gap-4 mb-2">
            <h2 className="text-4xl sm:text-7xl font-black text-white manga-shadow-red leading-none">
              PLANS
            </h2>
          </div>
          <div className="h-1 w-24 sm:w-32 bg-red-500 mx-auto" />
          <p className="mt-3 text-white/40 text-xs sm:text-sm font-medium tracking-wider">
            無料プラン vs プロプラン
          </p>
        </div>

        {/* 比較テーブル */}
        <div className="border-2 border-white/10 overflow-hidden">
          {/* テーブルヘッダー */}
          <div className="grid grid-cols-3 border-b-2 border-white/10">
            <div className="p-3 sm:p-4" />
            <div className="p-3 sm:p-4 text-center border-l-2 border-white/10">
              <p className="text-xs font-black text-white/40 uppercase tracking-wider">Free</p>
              <p className="text-lg sm:text-xl font-black text-white mt-1">¥0</p>
            </div>
            <div className="p-3 sm:p-4 text-center border-l-2 border-red-500/30 bg-red-500/5">
              <p className="text-xs font-black text-red-400 uppercase tracking-wider">Pro</p>
              <p className="text-lg sm:text-xl font-black text-white mt-1">¥480<span className="text-xs text-white/40">/月</span></p>
            </div>
          </div>

          {/* 機能行 */}
          {COMPARISON_ROWS.map((row, i) => (
            <div
              key={i}
              className={`grid grid-cols-3 ${
                i < COMPARISON_ROWS.length - 1 ? "border-b border-white/5" : ""
              }`}
            >
              <div className="p-3 sm:p-4 flex items-center">
                <span className="text-xs sm:text-sm text-white/60 font-bold">{row.label}</span>
              </div>
              <div className="p-3 sm:p-4 text-center border-l-2 border-white/10 flex items-center justify-center">
                {row.free === "×" ? (
                  <span className="w-5 h-5 flex items-center justify-center text-white/15 text-sm">×</span>
                ) : row.free === "○" ? (
                  <span className="w-5 h-5 bg-white/10 flex items-center justify-center text-white/40 text-[10px] font-black">✓</span>
                ) : (
                  <span className={`text-xs sm:text-sm font-bold ${
                    row.freeLimit ? "text-white/30" : "text-white/50"
                  }`}>
                    {row.free}
                  </span>
                )}
              </div>
              <div className="p-3 sm:p-4 text-center border-l-2 border-red-500/30 bg-red-500/[0.02] flex items-center justify-center">
                {row.pro === "○" ? (
                  <span className="w-5 h-5 bg-emerald-500 flex items-center justify-center text-white text-[10px] font-black">✓</span>
                ) : (
                  <span className={`text-xs sm:text-sm font-black ${
                    row.proHighlight ? "text-red-400" : "text-white/80"
                  }`}>
                    {row.pro}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        {!isPro && (
          <div className="text-center mt-8">
            <button
              onClick={() => router.push("/pricing")}
              className="inline-flex items-center gap-2 bg-red-500 text-white text-sm font-black
                         px-8 py-3.5 border-2 border-red-400/30
                         shadow-[4px_4px_0_rgba(0,0,0,0.4)] hover:shadow-[2px_2px_0_rgba(0,0,0,0.4)]
                         hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-150"
            >
              プロプランに登録する
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ================================================================
   メインコンポーネント
   ================================================================ */
export default function MangaTopPage({
  posterWorks,
  titleOnlyWorks,
}: {
  posterWorks: Work[];
  titleOnlyWorks: Work[];
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      heroTl
        .from(".hero-badge", { y: 30, opacity: 0, duration: 0.6 })
        .from(
          ".hero-title span",
          { y: 80, opacity: 0, stagger: 0.15, duration: 0.8 },
          "-=0.3"
        )
        .from(
          ".hero-bubble",
          { y: 30, opacity: 0, scale: 0.9, duration: 0.5 },
          "-=0.3"
        )
        .from(
          ".hero-cta",
          { y: 20, opacity: 0, duration: 0.4 },
          "-=0.2"
        )
        .from(".hero-scroll", { opacity: 0, duration: 0.5 }, "-=0.2");

      // About
      gsap.from(".about-heading", {
        scrollTrigger: {
          trigger: ".about-section",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        x: -80,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });
      gsap.utils.toArray<HTMLElement>(".about-card").forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          y: 60,
          opacity: 0,
          duration: 0.7,
          delay: i * 0.12,
          ease: "power2.out",
        });
      });

      // All Works list
      gsap.from(".allworks-heading", {
        scrollTrigger: {
          trigger: ".allworks-section",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        x: -100,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      // CTA — no GSAP animation (always visible)
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      <HeroSection />
      <AboutSection />
      <ProSection />
      <PlanComparisonSection />
      <PosterGallerySection works={posterWorks} />
      <TitleListSection works={titleOnlyWorks} />
      <CTASection />
    </div>
  );
}
