"use client";

import { useRef, useEffect } from "react";
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

function Onomatopoeia({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <span
      className={`font-black select-none pointer-events-none ${className}`}
      style={{ letterSpacing: "0.12em" }}
    >
      {text}
    </span>
  );
}

/* ================================================================
   Section 1: HERO (黒背景 + 3D)
   ================================================================ */
function HeroSection() {
  return (
    <section className="hero-section relative min-h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* 3D パースペクティブ グリッド */}
      <div className="absolute inset-0" style={{ perspective: "800px" }}>
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            transform: "rotateX(60deg) translateY(-30%)",
            transformOrigin: "center center",
            backgroundImage:
              "linear-gradient(rgba(229,62,62,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(229,62,62,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* 集中線（赤） */}
      <SpeedLinesSVG className="absolute inset-0 w-full h-full text-red-500 opacity-[0.12]" />

      {/* グロー球体 */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-red-500/10 blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-red-600/8 blur-[80px]" />

      {/* ハーフトーン装飾 */}
      <div className="absolute top-0 right-0 w-72 h-72 halftone-red opacity-[0.06] rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-56 h-56 halftone opacity-[0.04] rounded-tr-full" />

      {/* コマ枠 */}
      <div className="absolute inset-3 sm:inset-6 border-2 border-white/10 pointer-events-none" />
      <div className="absolute inset-3 sm:inset-6">
        <div className="absolute top-0 left-0 w-8 h-8 border-l-[3px] border-t-[3px] border-red-500/60" />
        <div className="absolute top-0 right-0 w-8 h-8 border-r-[3px] border-t-[3px] border-red-500/60" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-l-[3px] border-b-[3px] border-red-500/60" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-r-[3px] border-b-[3px] border-red-500/60" />
      </div>

      {/* オノマトペ */}
      <Onomatopoeia
        text="ドドドド"
        className="absolute top-[10%] right-[6%] text-5xl sm:text-7xl text-red-500/10 rotate-[-10deg] text-outline-red"
      />
      <Onomatopoeia
        text="ゴゴゴ"
        className="absolute bottom-[12%] left-[4%] text-4xl sm:text-6xl text-white/[0.06] rotate-[6deg]"
      />

      {/* メインコンテンツ */}
      <div className="hero-content relative z-10 text-center px-6 max-w-4xl">
        {/* バッジ */}
        <div className="hero-badge mb-6">
          <span className="inline-block bg-red-500 text-white text-[10px] sm:text-xs font-black tracking-[0.4em] px-5 py-2.5 uppercase border border-red-400/30">
            AI-Powered Travel Planner
          </span>
        </div>

        {/* 3D タイトル */}
        <div style={{ perspective: "600px" }}>
          <h1
            className="hero-title text-[80px] sm:text-[140px] lg:text-[180px] font-black leading-[0.82] tracking-tighter"
            style={{ transformStyle: "preserve-3d" }}
          >
            <span className="block text-white manga-shadow-red">Nich</span>
            <span className="block text-red-500 manga-shadow">Trip</span>
          </h1>
        </div>

        {/* 吹き出し */}
        <div className="hero-bubble mt-8 mb-6 inline-block relative">
          <div className="absolute -inset-1 bg-white/20 rounded-xl blur-sm" />
          <div className="relative bg-black border-2 border-white/20 rounded-xl px-6 py-4 backdrop-blur-sm">
            <p className="text-base sm:text-lg font-bold text-white/90">
              テーマを選ぶだけで、AIがあなただけの
              <span className="text-red-400 font-black">ニッチ旅</span>
              を作る。
            </p>
          </div>
        </div>

        {/* スクロール誘導 */}
        <div className="hero-scroll mt-10 flex flex-col items-center gap-2">
          <span className="text-[10px] font-bold tracking-[0.3em] text-white/30 uppercase">
            Scroll Down
          </span>
          <div className="w-px h-8 bg-gradient-to-b from-red-500/60 to-transparent animate-bounce-down" />
        </div>
      </div>

      {/* 斜め区切り（下部） */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 bg-[#0a0a0a]"
        style={{ clipPath: "polygon(0 60%, 100% 0%, 100% 100%, 0% 100%)" }}
      />
    </section>
  );
}

/* ================================================================
   Section 2: ABOUT (コマ割り + 3D カード)
   ================================================================ */
function AboutSection() {
  return (
    <section className="about-section relative bg-[#0a0a0a] py-24 sm:py-32 overflow-hidden">
      {/* ハーフトーン背景 */}
      <div className="absolute inset-0 halftone opacity-[0.03]" />

      {/* ストライプ装飾 */}
      <div className="absolute top-0 left-0 right-0 h-4 stripe-diagonal-bold" />

      {/* セクションヘッダー */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 mb-16">
        <div className="flex items-end gap-4">
          <h2 className="about-heading text-5xl sm:text-7xl font-black text-white manga-shadow-red leading-none">
            ABOUT
          </h2>
          <div className="h-1 w-20 bg-red-500 mb-2" />
        </div>
      </div>

      {/* 3D コマ割りグリッド */}
      <div className="relative z-10 max-w-6xl mx-auto px-6" style={{ perspective: "1200px" }}>
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
          {/* パネル1: 大 */}
          <div
            className="about-card sm:col-span-7 relative overflow-hidden"
            style={{
              transform: "rotateY(-2deg)",
              transformStyle: "preserve-3d",
            }}
          >
            <div className="bg-white text-black p-8 sm:p-12 min-h-[300px] flex flex-col justify-center border-[3px] border-white shadow-[8px_8px_0px_0px_rgba(229,62,62,0.5)]">
              <span className="text-[10px] font-black tracking-[0.4em] text-red-500 uppercase mb-4">
                01 — Concept
              </span>
              <h3 className="text-3xl sm:text-5xl font-black mb-4 leading-tight">
                NichTripとは<span className="text-red-500">？</span>
              </h3>
              <p className="text-base text-black/60 leading-relaxed max-w-md">
                アニメ聖地巡礼・パワースポット・B級グルメ。
                あなたの「好き」に合わせて、Claude AIが最適な旅程を自動生成するWebアプリ。
              </p>
              {/* ハーフトーン装飾 */}
              <div className="absolute -bottom-4 -right-4 w-32 h-32 halftone opacity-[0.06] rounded-tl-full" />
            </div>
          </div>

          {/* パネル2: 中 */}
          <div className="sm:col-span-5 flex flex-col gap-5">
            <div
              className="about-card relative overflow-hidden flex-1"
              style={{
                transform: "rotateY(3deg) rotateX(-1deg)",
                transformStyle: "preserve-3d",
              }}
            >
              <div className="bg-red-500 text-white p-6 sm:p-8 h-full flex flex-col justify-center border-[3px] border-red-400 shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)]">
                <span className="text-[10px] font-black tracking-[0.4em] text-white/50 uppercase mb-3">
                  02 — Data
                </span>
                <h3 className="text-2xl sm:text-4xl font-black mb-2">
                  10作品
                  <br />
                  45スポット
                </h3>
                <p className="text-sm text-white/70">
                  登録済みの聖地情報からAIが最適ルートを計算。
                </p>
              </div>
            </div>

            {/* パネル3: 小 */}
            <div
              className="about-card relative overflow-hidden flex-1"
              style={{
                transform: "rotateY(2deg) rotateX(2deg)",
                transformStyle: "preserve-3d",
              }}
            >
              <div className="bg-[#111] text-white p-6 sm:p-8 h-full flex flex-col justify-center border-[3px] border-white/20 shadow-[6px_6px_0px_0px_rgba(229,62,62,0.3)]">
                <span className="text-[10px] font-black tracking-[0.4em] text-red-500 uppercase mb-3">
                  03 — Map
                </span>
                <h3 className="text-2xl sm:text-4xl font-black mb-2">
                  Google Maps
                  <br />
                  ルート表示
                </h3>
                <p className="text-sm text-white/50">
                  生成プランをマップ上にルート表示。シェア機能でSNS投稿も。
                </p>
                {/* 斜めストライプ */}
                <div className="absolute inset-0 stripe-diagonal opacity-20 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* オノマトペ */}
      <Onomatopoeia
        text="バーン！"
        className="absolute top-[15%] right-[5%] text-4xl sm:text-6xl text-red-500/[0.07] rotate-[-8deg]"
      />
    </section>
  );
}

/* ================================================================
   Section 3: GALLERY / WORKS (3Dカード + パララックス)
   ================================================================ */
function GallerySection({ works }: { works: Work[] }) {
  const router = useRouter();

  return (
    <section className="gallery-section relative bg-black py-24 sm:py-32 overflow-hidden">
      {/* 3D パースペクティブ グリッド（床面） */}
      <div className="absolute inset-0" style={{ perspective: "600px" }}>
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            transform: "rotateX(65deg) translateY(-20%)",
            transformOrigin: "center top",
            backgroundImage:
              "linear-gradient(rgba(229,62,62,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(229,62,62,0.6) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
      </div>

      {/* グロー */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-red-500/5 blur-[100px] rounded-full" />

      {/* ヘッダー */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 mb-12">
        <div className="flex items-end gap-4 mb-2">
          <h2 className="gallery-heading text-5xl sm:text-8xl font-black text-white manga-shadow-red leading-none">
            WORKS
          </h2>
          <span className="text-red-500 text-xl sm:text-3xl font-black mb-1 sm:mb-2">
            {works.length}
          </span>
        </div>
        <div className="h-1 w-32 bg-red-500" />
        <p className="mt-3 text-white/40 text-sm font-medium tracking-wider">
          対応作品一覧 — タップしてプランを作成
        </p>
      </div>

      {/* カードグリッド（3D） */}
      <div
        className="relative z-10 max-w-6xl mx-auto px-6"
        style={{ perspective: "1000px" }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {works.map((work, i) => {
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
                           border-[3px] border-white/10 hover:border-red-500
                           shadow-[0_4px_20px_rgba(0,0,0,0.5)]
                           hover:shadow-[0_8px_40px_rgba(229,62,62,0.3)]
                           hover:-translate-y-2 hover:scale-[1.03]
                           transition-all duration-300"
                style={{
                  transform: `rotateY(${(i - 2) * 1.5}deg)`,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* ポスター画像 */}
                <div className="relative aspect-[2/3] overflow-hidden">
                  {visual.image ? (
                    <img
                      src={visual.image}
                      alt={work.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${visual.gradient}`}
                    />
                  )}

                  {/* 番号 */}
                  <div className="absolute top-0 left-0 bg-red-500 text-white text-[10px] font-black w-7 h-7 flex items-center justify-center">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* グラデーションフェード */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

                  {/* タイトル */}
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-white text-xs sm:text-sm font-black drop-shadow-lg leading-tight mb-1">
                      {work.title}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-white/40 text-[9px] font-bold uppercase tracking-wider">
                        {work.genre}
                      </span>
                      <span className="text-red-400 text-[9px] font-black">
                        {work.spotCount}spots
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* オノマトペ */}
      <Onomatopoeia
        text="ザザザ"
        className="absolute bottom-[8%] right-[5%] text-5xl sm:text-7xl text-white/[0.04] rotate-[5deg]"
      />
    </section>
  );
}

/* ================================================================
   Section 4: CTA (吹き出し + 3D)
   ================================================================ */
function CTASection() {
  const router = useRouter();

  return (
    <section className="cta-section relative min-h-screen bg-[#0a0a0a] overflow-hidden flex items-center justify-center">
      {/* 集中線（赤） */}
      <SpeedLinesSVG className="absolute inset-0 w-full h-full text-red-500 opacity-[0.06]" />

      {/* 3Dグリッド天井 */}
      <div className="absolute inset-0" style={{ perspective: "500px" }}>
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            transform: "rotateX(-60deg) translateY(40%)",
            transformOrigin: "center bottom",
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* グロー */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-red-500/8 blur-[100px]" />

      {/* コマ枠 */}
      <div className="absolute inset-3 sm:inset-6 border-2 border-white/[0.06] pointer-events-none" />

      {/* オノマトペ */}
      <Onomatopoeia
        text="ワクワク"
        className="absolute top-[12%] right-[8%] text-4xl sm:text-5xl text-red-500/[0.08] rotate-[10deg]"
      />
      <Onomatopoeia
        text="ドン！"
        className="absolute bottom-[10%] left-[6%] text-5xl sm:text-7xl text-white/[0.04] rotate-[-6deg]"
      />

      {/* メインコンテンツ */}
      <div className="cta-content relative z-10 text-center px-6 max-w-2xl" style={{ perspective: "800px" }}>
        {/* 3D 吹き出し */}
        <div
          className="cta-bubble relative mb-8"
          style={{ transform: "rotateX(2deg)", transformStyle: "preserve-3d" }}
        >
          <div className="absolute -inset-1 bg-red-500/20 rounded-2xl blur-sm" />
          <div className="relative bg-[#111] border-[3px] border-white/15 rounded-2xl px-8 py-12 sm:px-14 sm:py-16 shadow-[0_20px_60px_rgba(229,62,62,0.15)]">
            {/* 斜めストライプ */}
            <div className="absolute inset-0 stripe-diagonal opacity-10 pointer-events-none rounded-2xl overflow-hidden" />

            <h2 className="cta-heading text-4xl sm:text-6xl font-black text-white manga-shadow-sm mb-5 leading-tight relative">
              さあ、旅に
              <br />
              出よう<span className="text-red-500">！</span>
            </h2>

            <p className="text-sm sm:text-base text-white/50 mb-10 leading-relaxed relative">
              テーマを選んで、条件を入力するだけ。
              <br />
              AIがあなただけのニッチ旅プランを作成します。
            </p>

            {/* CTAボタン */}
            <button
              onClick={() => router.push("/plan?theme=pilgrimage")}
              className="cta-button group relative inline-flex items-center gap-3
                         bg-red-500 text-white text-lg sm:text-xl font-black
                         px-10 py-5 border-[3px] border-white/20
                         shadow-[0_6px_30px_rgba(229,62,62,0.4)]
                         hover:shadow-[0_10px_50px_rgba(229,62,62,0.6)]
                         hover:-translate-y-1 hover:scale-[1.03]
                         active:translate-y-0.5 active:scale-[0.98]
                         transition-all duration-200"
            >
              <span>プランを作る</span>
              <svg
                className="w-6 h-6 group-hover:translate-x-1.5 transition-transform"
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
        </div>

        {/* フッター */}
        <p className="text-[10px] text-white/20 font-bold tracking-[0.2em] mt-12">
          &copy; 2025 NichTrip &mdash; AIがつくるニッチな旅
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
      // ---- Hero アニメーション ----
      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      heroTl
        .from(".hero-badge", { y: 30, opacity: 0, duration: 0.6 })
        .from(".hero-title span", {
          y: 80,
          opacity: 0,
          rotateX: -15,
          stagger: 0.15,
          duration: 0.8,
        }, "-=0.3")
        .from(".hero-bubble", { y: 30, opacity: 0, scale: 0.9, duration: 0.5 }, "-=0.3")
        .from(".hero-scroll", { opacity: 0, duration: 0.5 }, "-=0.2");

      // ---- About セクション ----
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
          rotateY: (i % 2 === 0 ? -8 : 8),
          duration: 0.7,
          delay: i * 0.12,
          ease: "power2.out",
        });
      });

      // ---- Gallery セクション ----
      gsap.from(".gallery-heading", {
        scrollTrigger: {
          trigger: ".gallery-section",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        x: -100,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });

      gsap.utils.toArray<HTMLElement>(".gallery-card").forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
          y: 80,
          opacity: 0,
          scale: 0.85,
          rotateY: (i - 2) * 5,
          duration: 0.6,
          delay: i * 0.06,
          ease: "power2.out",
        });
      });

      // ---- CTA セクション ----
      const ctaTl = gsap.timeline({
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      ctaTl
        .from(".cta-bubble", {
          y: 60,
          opacity: 0,
          scale: 0.9,
          rotateX: 8,
          duration: 0.8,
          ease: "power2.out",
        })
        .from(".cta-heading", { y: 30, opacity: 0, duration: 0.5 }, "-=0.4")
        .from(".cta-button", {
          y: 20,
          opacity: 0,
          scale: 0.9,
          duration: 0.4,
        }, "-=0.2");

      // ---- パララックス（全セクション共通） ----
      gsap.utils.toArray<HTMLElement>(".hero-section, .about-section, .gallery-section, .cta-section").forEach((section) => {
        const bg = section.querySelector<HTMLElement>("[class*='speed-lines'], [class*='halftone']");
        if (bg) {
          gsap.to(bg, {
            yPercent: -15,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      });

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
