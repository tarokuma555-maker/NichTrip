"use client";

import { useState, useEffect } from "react";

/* ===== SVG Outline Icons ===== */
function IconSearch({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
    </svg>
  );
}

function IconRoute({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="18" r="3" />
      <path d="M6 9v2a4 4 0 004 4h4a4 4 0 004-4V9" strokeLinecap="round" />
    </svg>
  );
}

function IconFood({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M3 3v7a4 4 0 004 4h2" />
      <path d="M7 3v4" />
      <path d="M3 7h8" />
      <path d="M9 14v8" />
      <path d="M18 3v18" />
      <path d="M18 3a3 3 0 013 3v1a3 3 0 01-3 3" />
    </svg>
  );
}

function IconSparkle({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
    </svg>
  );
}

const STEPS = [
  { icon: <IconSearch className="w-10 h-10" />, text: "聖地データを検索中...", pct: 25 },
  { icon: <IconRoute className="w-10 h-10" />, text: "最適なルートを計算中...", pct: 50 },
  { icon: <IconFood className="w-10 h-10" />, text: "周辺グルメを調査中...", pct: 75 },
  { icon: <IconSparkle className="w-10 h-10" />, text: "プランを仕上げています...", pct: 95 },
];

const STEP_ICONS_SM = [
  <IconSearch key="s" className="w-4 h-4" />,
  <IconRoute key="r" className="w-4 h-4" />,
  <IconFood key="f" className="w-4 h-4" />,
  <IconSparkle key="sp" className="w-4 h-4" />,
];

export default function LoadingAnimation() {
  const [activeStep, setActiveStep] = useState(0);
  const [panelFlash, setPanelFlash] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveStep((prev) => {
        if (prev < STEPS.length - 1) {
          setPanelFlash(true);
          setTimeout(() => setPanelFlash(false), 300);
          return prev + 1;
        }
        return prev;
      });
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const progress = STEPS[activeStep].pct;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {/* 漫画パネル風ビジュアル */}
      <div className="relative w-full max-w-xs mb-8">
        {/* 集中線の背景 */}
        <div className="relative w-full aspect-square max-w-[200px] mx-auto overflow-hidden">
          <svg
            className="absolute inset-0 w-full h-full animate-spin-slow"
            viewBox="0 0 200 200"
            fill="none"
          >
            {Array.from({ length: 36 }, (_, i) => {
              const angle = (i * 10 * Math.PI) / 180;
              return (
                <line
                  key={i}
                  x1="100"
                  y1="100"
                  x2={100 + 100 * Math.cos(angle)}
                  y2={100 + 100 * Math.sin(angle)}
                  stroke="#E53E3E"
                  strokeWidth={i % 6 === 0 ? 2 : 0.5}
                  opacity={i % 6 === 0 ? 0.3 : 0.1}
                />
              );
            })}
          </svg>

          {/* 中央の漫画風フレーム */}
          <div
            className={`absolute inset-[20%] border-[3px] border-white flex items-center justify-center bg-[#0a0a0a] transition-all duration-300 ${
              panelFlash
                ? "shadow-[0_0_30px_rgba(229,62,62,0.6)] scale-110 border-red-500"
                : "shadow-[4px_4px_0_rgba(229,62,62,0.4)]"
            }`}
          >
            {/* コマ枠の角装飾 */}
            <div className="absolute -top-1 -left-1 w-3 h-3 border-l-2 border-t-2 border-red-500" />
            <div className="absolute -top-1 -right-1 w-3 h-3 border-r-2 border-t-2 border-red-500" />
            <div className="absolute -bottom-1 -left-1 w-3 h-3 border-l-2 border-b-2 border-red-500" />
            <div className="absolute -bottom-1 -right-1 w-3 h-3 border-r-2 border-b-2 border-red-500" />

            {/* アイコン */}
            <div className="text-center">
              <span
                className={`block text-white transition-transform duration-300 ${
                  panelFlash ? "scale-125" : "scale-100"
                }`}
              >
                {STEPS[activeStep].icon}
              </span>
            </div>
          </div>

          {/* ハーフトーンオーバーレイ */}
          <div className="absolute inset-0 halftone-red opacity-[0.04] pointer-events-none" />
        </div>

        {/* 吹き出し風テキスト */}
        <div className="relative mt-4 bg-white text-black px-4 py-2.5 text-center mx-8">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-white" />
          <p className="text-sm font-black">プランを作成中...</p>
        </div>
      </div>

      <p className="text-xs text-white/40 mb-6">
        所要時間の目安：約10〜20秒
      </p>

      {/* プログレスバー — 漫画風 */}
      <div className="w-full max-w-xs mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-[10px] text-white/40 font-black uppercase tracking-wider">
            Progress
          </span>
          <span className="text-[10px] text-red-400 font-black">{progress}%</span>
        </div>
        <div className="w-full h-3 bg-white/5 border-2 border-white/10 overflow-hidden">
          <div
            className="h-full transition-all duration-1000 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            {/* 斜めストライプ進捗バー */}
            <div
              className="absolute inset-0 bg-red-500"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(-45deg, transparent, transparent 4px, rgba(0,0,0,0.2) 4px, rgba(0,0,0,0.2) 8px)",
              }}
            />
          </div>
        </div>
      </div>

      {/* ステップ進行 — コマ風 */}
      <div className="w-full max-w-xs space-y-2.5">
        {STEPS.map((step, i) => {
          const done = i < activeStep;
          const current = i === activeStep;

          return (
            <div
              key={i}
              className={`flex items-center gap-3 px-3 py-2 border-2 transition-all duration-300 ${
                current
                  ? "border-red-500/50 bg-red-500/5 shadow-[2px_2px_0_rgba(229,62,62,0.3)] step-slide-in"
                  : done
                    ? "border-white/5 bg-white/[0.02]"
                    : "border-white/5"
              }`}
            >
              <div className="shrink-0 w-6 h-6 flex items-center justify-center">
                {done ? (
                  <span className="w-5 h-5 bg-emerald-500 flex items-center justify-center text-white text-[10px] font-black step-check-in">
                    ✓
                  </span>
                ) : current ? (
                  <div className="relative w-5 h-5 flex items-center justify-center">
                    <div className="absolute inset-0 bg-red-500/30 step-ping" />
                    <div className="w-3 h-3 bg-red-500 step-glow" />
                  </div>
                ) : (
                  <div className="w-2 h-2 bg-white/15" />
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className={`${current ? "text-white" : done ? "text-white/30" : "text-white/20"}`}>
                  {STEP_ICONS_SM[i]}
                </span>
                <span
                  className={`text-sm transition-colors duration-300 ${
                    done
                      ? "text-white/30 line-through"
                      : current
                        ? "text-white font-black"
                        : "text-white/20"
                  }`}
                >
                  {step.text}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
