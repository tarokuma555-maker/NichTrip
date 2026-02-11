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
   SVG装飾パーツ
   ================================================================ */

function SpeedLinesSVG({ className }: { className?: string }) {
  const lines = Array.from({ length: 60 }, (_, i) => {
    const angle = (i * 6 * Math.PI) / 180;
    const len = 500;
    return (
      <line
        key={i}
        x1="500"
        y1="500"
        x2={500 + len * Math.cos(angle)}
        y2={500 + len * Math.sin(angle)}
        stroke="#000"
        strokeWidth={i % 5 === 0 ? 3 : i % 3 === 0 ? 1.5 : 0.5}
        opacity={i % 5 === 0 ? 0.15 : 0.06}
      />
    );
  });
  return (
    <svg className={className} viewBox="0 0 1000 1000" fill="none">
      {lines}
    </svg>
  );
}

function SpeechBubble({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute -inset-1 bg-black rounded-2xl" />
      <div className="relative bg-white rounded-2xl px-6 py-4 speech-tail-left">
        {children}
      </div>
    </div>
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
      className={`text-outline font-black select-none pointer-events-none ${className}`}
      style={{ letterSpacing: "0.15em" }}
    >
      {text}
    </span>
  );
}

/* ================================================================
   Panel 1: HERO
   ================================================================ */
function HeroPanel() {
  return (
    <div className="panel bg-white flex items-center justify-center">
      {/* 集中線 */}
      <SpeedLinesSVG className="absolute inset-0 w-full h-full opacity-100" />

      {/* ハーフトーンコーナー */}
      <div className="absolute top-0 right-0 w-64 h-64 halftone opacity-[0.08] rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-48 h-48 halftone-red opacity-[0.06] rounded-tr-full" />

      {/* コマ枠 */}
      <div className="absolute inset-4 sm:inset-8 border-[4px] border-black/90 pointer-events-none" />

      {/* オノマトペ装飾 */}
      <Onomatopoeia
        text="ドドドド"
        className="absolute top-[12%] right-[8%] text-4xl sm:text-6xl text-red-500/20 rotate-[-8deg]"
      />
      <Onomatopoeia
        text="ゴゴゴ"
        className="absolute bottom-[15%] left-[5%] text-3xl sm:text-5xl text-black/10 rotate-[5deg]"
      />

      {/* メインコンテンツ */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        {/* サブタイトル */}
        <div className="mb-4">
          <span className="inline-block bg-red-500 text-white text-xs sm:text-sm font-black tracking-[0.3em] px-4 py-2 uppercase">
            AI Travel Planner
          </span>
        </div>

        {/* メインタイトル */}
        <h1 className="text-7xl sm:text-[120px] font-black leading-[0.85] tracking-tighter text-black manga-shadow mb-6">
          Nich
          <span className="text-red-500">Trip</span>
        </h1>

        {/* キャッチコピー */}
        <SpeechBubble className="inline-block mb-8">
          <p className="text-lg sm:text-xl font-bold text-black">
            テーマを選ぶだけで、AIがあなただけの
            <span className="text-red-500 font-black">ニッチ旅</span>
            を作る。
          </p>
        </SpeechBubble>

        {/* スクロール誘導 */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <span className="text-xs font-bold tracking-[0.2em] text-black/40 uppercase">
            Scroll
          </span>
          <svg
            className="w-6 h-6 text-black/40 animate-bounce-down"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </div>
      </div>

      {/* 斜めストライプ装飾（下部） */}
      <div className="absolute bottom-0 left-0 right-0 h-16 stripe-diagonal" />
    </div>
  );
}

/* ================================================================
   Panel 2: ABOUT
   ================================================================ */
function AboutPanel() {
  return (
    <div className="panel bg-[#fafafa] flex items-center justify-center overflow-hidden">
      {/* 背景ハーフトーン */}
      <div className="absolute inset-0 halftone opacity-[0.03]" />

      {/* 斜めコマ枠レイアウト */}
      <div className="relative z-10 w-full h-full flex items-center justify-center px-6">
        <div className="max-w-5xl w-full grid grid-cols-1 sm:grid-cols-12 gap-0 sm:gap-0">
          {/* 左：大きなコマ */}
          <div
            className="about-panel-1 sm:col-span-7 bg-black text-white p-8 sm:p-12 flex flex-col justify-center relative"
            style={{ clipPath: "polygon(0 0, 100% 0, 92% 100%, 0 100%)" }}
          >
            <div className="absolute top-4 left-4 text-xs font-bold tracking-[0.3em] text-red-500 uppercase">
              Panel 01
            </div>
            <h2 className="text-4xl sm:text-6xl font-black mb-6 leading-tight">
              NichTripとは<span className="text-red-500">？</span>
            </h2>
            <p className="text-base sm:text-lg text-white/80 leading-relaxed max-w-md">
              アニメ聖地巡礼・パワースポット・B級グルメ。
              あなたの「好き」に合わせて、Claude AIが最適な旅程を自動生成する。
            </p>

            {/* 集中線装飾 */}
            <div className="absolute -right-20 top-1/2 -translate-y-1/2 speed-lines-bg w-40 h-40 opacity-20" />
          </div>

          {/* 右上：小コマ */}
          <div className="sm:col-span-5 flex flex-col gap-0">
            <div
              className="about-panel-2 bg-red-500 text-white p-6 sm:p-8 flex-1 flex flex-col justify-center relative"
              style={{
                clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0% 100%)",
              }}
            >
              <div className="pl-4 sm:pl-8">
                <div className="text-xs font-bold tracking-[0.3em] uppercase mb-3 text-white/60">
                  Panel 02
                </div>
                <h3 className="text-2xl sm:text-3xl font-black mb-3">
                  10作品<br />45スポット
                </h3>
                <p className="text-sm text-white/80">
                  データベースに登録済みの聖地情報をもとに、AIが最適ルートを計算。
                </p>
              </div>
            </div>

            {/* 右下：小コマ */}
            <div
              className="about-panel-3 bg-white border-[3px] border-black p-6 sm:p-8 flex-1 flex flex-col justify-center relative"
              style={{
                clipPath: "polygon(8% 0, 100% 0, 100% 100%, 0% 100%)",
              }}
            >
              <div className="pl-4 sm:pl-8">
                <div className="text-xs font-bold tracking-[0.3em] text-red-500 uppercase mb-3">
                  Panel 03
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-black mb-3">
                  Google Maps<br />連携
                </h3>
                <p className="text-sm text-black/60">
                  生成されたプランはマップ上にルート表示。シェア機能でSNS投稿も。
                </p>
              </div>

              {/* ハーフトーン装飾 */}
              <div className="absolute bottom-0 right-0 w-24 h-24 halftone opacity-[0.06] rounded-tl-full" />
            </div>
          </div>
        </div>
      </div>

      {/* オノマトペ */}
      <Onomatopoeia
        text="バーン！"
        className="absolute top-[8%] left-[5%] text-3xl sm:text-5xl text-red-500/15 rotate-[-12deg]"
      />
    </div>
  );
}

/* ================================================================
   Panel 3: GALLERY / WORKS
   ================================================================ */
function GalleryPanel({ works }: { works: Work[] }) {
  const router = useRouter();

  return (
    <div className="panel bg-black flex flex-col justify-center overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0 stripe-diagonal-bold opacity-30" />

      {/* ヘッダー */}
      <div className="relative z-10 px-8 sm:px-16 pt-8 mb-6 sm:mb-8">
        <div className="flex items-end gap-4">
          <h2 className="text-5xl sm:text-7xl font-black text-white manga-shadow-red leading-none">
            WORKS
          </h2>
          <span className="text-red-500 text-lg sm:text-2xl font-black mb-1">
            {works.length}作品収録
          </span>
        </div>
        <div className="mt-2 h-1 w-32 bg-red-500" />
      </div>

      {/* 横スクロールカード列 */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="flex gap-6 px-8 sm:px-16 overflow-x-auto hide-scrollbar pb-4">
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
                className="gallery-card group shrink-0 w-52 sm:w-60 bg-white border-[3px] border-white
                           hover:border-red-500 rounded-none overflow-hidden
                           shadow-[6px_6px_0px_0px_rgba(229,62,62,0.4)]
                           hover:shadow-[8px_8px_0px_0px_rgba(229,62,62,0.6)]
                           hover:-translate-x-1 hover:-translate-y-1
                           transition-all duration-200 text-left"
              >
                {/* ポスター */}
                <div className="relative h-72 sm:h-80 overflow-hidden">
                  {visual.image ? (
                    <img
                      src={visual.image}
                      alt={work.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${visual.gradient}`}
                    />
                  )}

                  {/* 番号バッジ */}
                  <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-black w-8 h-8 flex items-center justify-center">
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  {/* 下部フェード */}
                  <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/70 to-transparent" />
                  <p className="absolute bottom-2 left-3 right-3 text-white text-sm font-black drop-shadow-lg leading-tight">
                    {work.title}
                  </p>
                </div>

                {/* カード本文 */}
                <div className="p-3 bg-white border-t-[3px] border-black">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-black/50 uppercase tracking-wider">
                      {work.genre}
                    </span>
                    <span className="text-[11px] font-bold text-red-500">
                      {work.spotCount} SPOTS
                    </span>
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
        className="absolute bottom-[8%] right-[5%] text-4xl sm:text-6xl text-white/10 rotate-[6deg]"
      />
    </div>
  );
}

/* ================================================================
   Panel 4: CONTACT / CTA
   ================================================================ */
function ContactPanel() {
  const router = useRouter();

  return (
    <div className="panel bg-white flex items-center justify-center">
      {/* 背景 */}
      <div className="absolute inset-0 speed-lines-bg opacity-60" />
      <div className="absolute inset-0 halftone opacity-[0.04]" />

      {/* コマ枠 */}
      <div className="absolute inset-4 sm:inset-8 border-[4px] border-black/90 pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-2xl">
        {/* 吹き出し大 */}
        <div className="relative mb-8">
          <div className="absolute -inset-2 bg-black rounded-3xl" />
          <div className="relative bg-white rounded-3xl px-8 py-10 sm:px-12 sm:py-14 speech-tail-left">
            <Onomatopoeia
              text="ワクワク"
              className="text-red-500/20 text-2xl sm:text-3xl absolute -top-2 right-4 rotate-[8deg]"
            />

            <h2 className="text-4xl sm:text-6xl font-black text-black manga-shadow-sm mb-4 leading-tight">
              さあ、旅に<br />
              出よう<span className="text-red-500">！</span>
            </h2>

            <p className="text-base sm:text-lg text-black/60 mb-8 leading-relaxed">
              テーマを選んで、条件を入力するだけ。<br />
              AIがあなただけのニッチ旅プランを作成します。
            </p>

            {/* CTAボタン */}
            <button
              onClick={() => router.push("/plan?theme=pilgrimage")}
              className="group inline-flex items-center gap-3 bg-red-500 text-white text-lg sm:text-xl font-black
                         px-10 py-5 border-[3px] border-black
                         shadow-[6px_6px_0px_0px_#000]
                         hover:shadow-[8px_8px_0px_0px_#000]
                         hover:-translate-x-0.5 hover:-translate-y-0.5
                         active:shadow-[2px_2px_0px_0px_#000]
                         active:translate-x-1 active:translate-y-1
                         transition-all duration-150"
            >
              <span>プランを作る</span>
              <svg
                className="w-6 h-6 group-hover:translate-x-1 transition-transform"
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
        <p className="text-xs text-black/30 font-bold tracking-wider mt-12">
          &copy; 2025 NichTrip &mdash; AIがつくるニッチな旅
        </p>
      </div>

      {/* オノマトペ */}
      <Onomatopoeia
        text="ドン！"
        className="absolute bottom-[12%] right-[8%] text-5xl sm:text-7xl text-black/[0.06] rotate-[-5deg]"
      />

      {/* 斜めストライプ（上部） */}
      <div className="absolute top-0 left-0 right-0 h-12 stripe-diagonal" />
    </div>
  );
}

/* ================================================================
   メインコンポーネント
   ================================================================ */
export default function MangaTopPage({ works }: { works: Work[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const wrapper = wrapperRef.current;
    if (!container || !wrapper) return;

    const panels = gsap.utils.toArray<HTMLElement>(".panel");
    const totalPanels = panels.length;

    // 横スクロール: 垂直スクロールで横に移動
    const scrollTween = gsap.to(panels, {
      xPercent: -100 * (totalPanels - 1),
      ease: "none",
      scrollTrigger: {
        trigger: container,
        pin: true,
        scrub: 1,
        end: () => `+=${wrapper.offsetWidth - window.innerWidth}`,
        invalidateOnRefresh: true,
      },
    });

    // 各パネルの登場アニメーション
    // About パネルのコマ割り
    panels.forEach((panel, i) => {
      if (i === 0) return; // Heroはスキップ

      const elements = panel.querySelectorAll(
        ".about-panel-1, .about-panel-2, .about-panel-3, .gallery-card"
      );

      elements.forEach((el, j) => {
        gsap.fromTo(
          el,
          { x: 80, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            delay: j * 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              containerAnimation: scrollTween,
              start: "left 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="overflow-hidden">
      <div ref={wrapperRef} className="flex w-fit">
        <HeroPanel />
        <AboutPanel />
        <GalleryPanel works={works} />
        <ContactPanel />
      </div>
    </div>
  );
}
