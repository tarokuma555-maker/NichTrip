"use client";

import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getWorkVisual } from "@/lib/work-visuals";

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

/* キャラクターシルエット（白抜き線画） */
function CharacterSilhouettes({ className }: { className?: string }) {
  return (
    <div className={`pointer-events-none select-none ${className}`}>
      {/* 走る少年 */}
      <svg className="absolute top-[8%] right-[3%] w-24 h-32 sm:w-36 sm:h-48 opacity-[0.06]" viewBox="0 0 100 130" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="55" cy="15" r="10" />
        <path d="M55 25 L55 60 M55 35 L35 50 M55 35 L75 45 M55 60 L35 90 M55 60 L70 85" />
        <path d="M35 90 L25 100 M70 85 L80 95" />
      </svg>
      {/* 剣を持つ戦士 */}
      <svg className="absolute bottom-[15%] left-[2%] w-20 h-28 sm:w-32 sm:h-44 opacity-[0.05]" viewBox="0 0 100 140" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="50" cy="15" r="10" />
        <path d="M50 25 L50 70 M50 40 L30 55 M50 40 L80 20 M80 20 L85 5 M80 20 L90 25 M50 70 L35 100 M50 70 L65 100" />
        <path d="M35 100 L30 110 M65 100 L70 110" />
      </svg>
      {/* 魔法少女 */}
      <svg className="absolute top-[40%] right-[1%] w-16 h-24 sm:w-28 sm:h-40 opacity-[0.04]" viewBox="0 0 100 140" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="50" cy="15" r="10" />
        <path d="M40 10 L35 0 M60 10 L65 0" />
        <path d="M50 25 L50 55 M50 55 L30 90 M50 55 L70 90 M30 90 Q50 95 70 90" />
        <path d="M50 40 L25 45 M50 40 L75 45" />
        <path d="M25 45 L15 55 M15 55 L10 50 M15 55 L10 60" />
      </svg>
      {/* カメラを持つ少女 */}
      <svg className="absolute bottom-[25%] right-[5%] w-16 h-24 sm:w-24 sm:h-36 opacity-[0.04]" viewBox="0 0 100 130" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="50" cy="15" r="10" />
        <path d="M42 8 Q50 3 58 8" />
        <path d="M50 25 L50 65 M50 65 L35 95 M50 65 L65 95" />
        <path d="M50 40 L70 35 M70 35 L85 30 M85 25 L90 35 M85 25 L80 20 M80 35 L90 35" />
      </svg>
      {/* 忍者 */}
      <svg className="absolute top-[60%] left-[3%] w-16 h-24 sm:w-24 sm:h-36 opacity-[0.04]" viewBox="0 0 100 130" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="50" cy="15" r="10" />
        <path d="M40 12 L20 10 M60 12 L80 10" />
        <path d="M50 25 L50 60 M50 60 L30 80 L40 95 M50 60 L70 80 L60 95" />
        <path d="M50 40 L30 30 M50 40 L70 30" />
      </svg>
    </div>
  );
}

/* ================================================================
   Section 1: HERO
   ================================================================ */
function HeroSection() {
  return (
    <section className="hero-section relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* グリッド背景 */}
      <div className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "linear-gradient(rgba(229,62,62,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(229,62,62,0.5) 1px, transparent 1px)",
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

      {/* キャラクターシルエット */}
      <CharacterSilhouettes className="absolute inset-0" />

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

        <div className="hero-bubble mt-6 sm:mt-8 mb-4 sm:mb-6 inline-block relative">
          <div className="relative bg-black border-2 border-white/20 rounded-xl px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-sm">
            <p className="text-sm sm:text-lg font-bold text-white/90 leading-relaxed">
              アニメの聖地を巡る
              <span className="text-red-400 font-black">旅プラン</span>
              をAIが自動生成
            </p>
          </div>
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
                アニメ聖地巡礼・パワースポット・B級グルメ。あなたの「好き」に合わせて、AIが最適な旅程を自動生成するWebアプリ。
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
                  50作品
                  <br />
                  168スポット
                </h3>
                <p className="text-xs sm:text-sm text-white/70">
                  登録済みの聖地情報からAIが最適ルートを計算。
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

      {/* キャラシルエット */}
      <svg className="absolute bottom-[10%] right-[4%] w-20 h-28 sm:w-28 sm:h-40 opacity-[0.04] pointer-events-none" viewBox="0 0 100 140" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="50" cy="15" r="10" />
        <path d="M50 25 L50 65 M50 40 L25 50 M50 40 L75 50 M50 65 L35 95 M50 65 L65 95" />
        <path d="M75 50 L85 40 M85 35 L85 50 M80 42 L90 42" />
      </svg>
    </section>
  );
}

/* ================================================================
   Section 3: GALLERY / WORKS
   ================================================================ */
function GallerySection({ works }: { works: Work[] }) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const filtered = works.filter((w) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      w.title.toLowerCase().includes(q) ||
      w.title_en.toLowerCase().includes(q) ||
      w.genre.toLowerCase().includes(q)
    );
  });

  return (
    <section className="gallery-section relative bg-black py-20 sm:py-32 overflow-hidden">
      {/* 背景 */}
      <div className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(rgba(229,62,62,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(229,62,62,0.6) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-500/5 blur-[100px] rounded-full" />

      {/* ヘッダー */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
        <div className="flex items-end gap-4 mb-2">
          <h2 className="gallery-heading text-4xl sm:text-8xl font-black text-white manga-shadow-red leading-none">
            WORKS
          </h2>
          <span className="text-red-500 text-lg sm:text-3xl font-black mb-1 sm:mb-2">
            {works.length}
          </span>
        </div>
        <div className="h-1 w-24 sm:w-32 bg-red-500" />
        <p className="mt-3 text-white/40 text-xs sm:text-sm font-medium tracking-wider">
          対応作品一覧 — タップしてプランを作成
        </p>

        {/* 検索バー */}
        <div className="mt-5 sm:mt-6 relative max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* カードグリッド */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-5">
          {filtered.map((work, i) => {
            const visual = getWorkVisual(work.title);
            return (
              <button
                key={work.title}
                onClick={() =>
                  router.push(
                    `/plan?theme=pilgrimage&work=${encodeURIComponent(work.title)}`
                  )
                }
                className="gallery-card group relative overflow-hidden text-left
                           border-2 sm:border-[3px] border-white/10 hover:border-red-500
                           shadow-[0_4px_20px_rgba(0,0,0,0.5)]
                           hover:shadow-[0_8px_40px_rgba(229,62,62,0.3)]
                           hover:-translate-y-1.5
                           transition-all duration-300"
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  {visual.image ? (
                    <img
                      src={visual.image}
                      alt={work.title}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${visual.gradient}`} />
                  )}

                  <div className="absolute top-0 left-0 bg-red-500 text-white text-[9px] sm:text-[10px] font-black w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

                  <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                    <p className="text-white text-[11px] sm:text-sm font-black drop-shadow-lg leading-tight mb-1">
                      {work.title}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/40 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider">
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
    <section className="cta-section relative min-h-[80vh] sm:min-h-screen bg-[#0a0a0a] overflow-hidden flex items-center justify-center">
      <SpeedLinesSVG className="absolute inset-0 w-full h-full text-red-500 opacity-[0.06]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-red-500/8 blur-[100px]" />
      <div className="absolute inset-3 sm:inset-6 border border-white/[0.06] pointer-events-none" />

      {/* キャラシルエット */}
      <svg className="absolute top-[10%] left-[5%] w-20 h-28 sm:w-28 sm:h-40 opacity-[0.04] pointer-events-none" viewBox="0 0 100 140" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="50" cy="15" r="10" />
        <path d="M50 25 L50 65 M50 65 L30 95 M50 65 L70 95 M30 95 Q50 100 70 95" />
        <path d="M50 40 L30 50 M50 40 L70 50" />
        <path d="M42 10 C40 5 45 0 50 2 C55 0 60 5 58 10" />
      </svg>
      <svg className="absolute bottom-[12%] right-[4%] w-16 h-24 sm:w-24 sm:h-36 opacity-[0.04] pointer-events-none" viewBox="0 0 100 130" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="50" cy="15" r="10" />
        <path d="M50 25 L50 60 M50 60 L35 85 M50 60 L65 85" />
        <path d="M50 40 L30 35 M50 40 L70 35" />
        <path d="M30 35 L20 30 L15 40 M70 35 L80 30 L85 40" />
      </svg>

      {/* メインコンテンツ */}
      <div className="cta-content relative z-10 text-center px-4 sm:px-6 max-w-2xl w-full">
        <div className="cta-bubble relative mb-6 sm:mb-8">
          <div className="absolute -inset-1 bg-red-500/20 rounded-2xl blur-sm" />
          <div className="relative bg-[#111] border-[3px] border-white/15 rounded-2xl px-6 py-10 sm:px-14 sm:py-16 shadow-[0_20px_60px_rgba(229,62,62,0.15)]">
            <div className="absolute inset-0 stripe-diagonal opacity-10 pointer-events-none rounded-2xl overflow-hidden" />

            <h2 className="cta-heading text-3xl sm:text-6xl font-black text-white manga-shadow-sm mb-4 sm:mb-5 leading-tight relative">
              さあ、旅に
              <br />
              出よう<span className="text-red-500">!</span>
            </h2>

            <p className="text-xs sm:text-base text-white/50 mb-8 sm:mb-10 leading-relaxed relative">
              テーマを選んで、条件を入力するだけ。
              <br className="hidden sm:block" />
              AIがあなただけの聖地巡礼プランを作成します。
            </p>

            {/* 旅に出るボタン */}
            <button
              onClick={() => router.push("/plan?theme=pilgrimage")}
              className="cta-button group relative inline-flex items-center gap-3
                         bg-red-500 text-white text-base sm:text-xl font-black
                         px-8 sm:px-10 py-4 sm:py-5 border-[3px] border-white/20
                         shadow-[0_6px_30px_rgba(229,62,62,0.4)]
                         hover:shadow-[0_10px_50px_rgba(229,62,62,0.6)]
                         hover:-translate-y-1
                         active:translate-y-0.5 active:scale-[0.98]
                         transition-all duration-200"
            >
              <span>旅に出る</span>
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1.5 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>

        <p className="text-[9px] sm:text-[10px] text-white/20 font-bold tracking-[0.2em] mt-8 sm:mt-12">
          &copy; 2025 AnimeTrips &mdash; AIがつくるアニメ聖地巡礼プラン
        </p>
      </div>
    </section>
  );
}

/* ================================================================
   メインコンポーネント
   ================================================================ */
export default function MangaTopPage({ works }: { works: Work[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      heroTl
        .from(".hero-badge", { y: 30, opacity: 0, duration: 0.6 })
        .from(".hero-title span", { y: 80, opacity: 0, stagger: 0.15, duration: 0.8 }, "-=0.3")
        .from(".hero-bubble", { y: 30, opacity: 0, scale: 0.9, duration: 0.5 }, "-=0.3")
        .from(".hero-scroll", { opacity: 0, duration: 0.5 }, "-=0.2");

      // About
      gsap.from(".about-heading", {
        scrollTrigger: { trigger: ".about-section", start: "top 80%", toggleActions: "play none none reverse" },
        x: -80, opacity: 0, duration: 0.8, ease: "power2.out",
      });
      gsap.utils.toArray<HTMLElement>(".about-card").forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: "top 85%", toggleActions: "play none none reverse" },
          y: 60, opacity: 0, duration: 0.7, delay: i * 0.12, ease: "power2.out",
        });
      });

      // Gallery
      gsap.from(".gallery-heading", {
        scrollTrigger: { trigger: ".gallery-section", start: "top 80%", toggleActions: "play none none reverse" },
        x: -100, opacity: 0, duration: 0.8, ease: "power2.out",
      });
      gsap.utils.toArray<HTMLElement>(".gallery-card").forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: "top 92%", toggleActions: "play none none reverse" },
          y: 60, opacity: 0, scale: 0.9, duration: 0.5, delay: i * 0.04, ease: "power2.out",
        });
      });

      // CTA
      const ctaTl = gsap.timeline({
        scrollTrigger: { trigger: ".cta-section", start: "top 70%", toggleActions: "play none none reverse" },
      });
      ctaTl
        .from(".cta-bubble", { y: 60, opacity: 0, scale: 0.9, duration: 0.8, ease: "power2.out" })
        .from(".cta-heading", { y: 30, opacity: 0, duration: 0.5 }, "-=0.4")
        .from(".cta-button", { y: 20, opacity: 0, scale: 0.9, duration: 0.4 }, "-=0.2");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef}>
      <HeroSection />
      <AboutSection />
      <GallerySection works={works} />
      <CTASection />
    </div>
  );
}
