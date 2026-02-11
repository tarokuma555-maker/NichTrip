"use client";

import { useState, useEffect } from "react";

const STEPS = [
  { emoji: "🔍", text: "聖地データを検索中...", pct: 25 },
  { emoji: "🗾", text: "最適なルートを計算中...", pct: 50 },
  { emoji: "🍱", text: "周辺グルメを調査中...", pct: 75 },
  { emoji: "✨", text: "プランを仕上げています...", pct: 95 },
];

export default function LoadingAnimation() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const progress = STEPS[activeStep].pct;

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {/* 電車アニメーション */}
      <div className="w-full max-w-xs h-16 overflow-hidden mb-6 relative">
        <div className="absolute bottom-3 left-0 right-0 h-px bg-white/10" />
        <div className="absolute bottom-2 left-0 right-0 flex justify-between px-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-3 h-px bg-white/15" />
          ))}
        </div>
        <div className="animate-train-move absolute bottom-4">
          <span className="text-3xl">🚃</span>
        </div>
      </div>

      <p className="text-lg font-bold text-white mb-1">
        プランを作成中...
      </p>
      <p className="text-xs text-white/40 mb-6">
        所要時間の目安：約10〜20秒
      </p>

      {/* プログレスバー */}
      <div className="w-full max-w-xs mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Progress</span>
          <span className="text-[10px] text-red-400 font-black">{progress}%</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ステップ進行 */}
      <div className="w-full max-w-xs space-y-3">
        {STEPS.map((step, i) => {
          const done = i < activeStep;
          const current = i === activeStep;

          return (
            <div
              key={i}
              className="animate-fade-in-up flex items-center gap-3"
              style={{ animationDelay: `${i * 0.15}s` }}
            >
              <div className="shrink-0 w-6 h-6 flex items-center justify-center">
                {done ? (
                  <span className="animate-check-pop text-emerald-400 text-base" style={{ animationDelay: `${i * 0.1}s` }}>
                    ✓
                  </span>
                ) : current ? (
                  <div className="w-4 h-4 rounded-full border-2 border-red-500 border-t-transparent animate-spin" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-white/15" />
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-lg">{step.emoji}</span>
                <span
                  className={`text-sm transition-colors duration-300 ${
                    done
                      ? "text-white/30 line-through"
                      : current
                        ? "text-white font-medium"
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
