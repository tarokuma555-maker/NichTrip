"use client";

import { useState, useEffect } from "react";

const STEPS = [
  { emoji: "🔍", text: "聖地データを検索中..." },
  { emoji: "🗾", text: "最適なルートを計算中..." },
  { emoji: "🍱", text: "周辺グルメを調査中..." },
  { emoji: "✨", text: "プランを仕上げています..." },
];

export default function LoadingAnimation() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveStep((prev) => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {/* 乗り物アニメーション */}
      <div className="w-full max-w-xs h-16 overflow-hidden mb-6 relative">
        {/* 線路/道路 */}
        <div className="absolute bottom-3 left-0 right-0 h-px bg-navy/10" />
        <div className="absolute bottom-2 left-0 right-0 flex justify-between px-2">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-3 h-px bg-navy/15" />
          ))}
        </div>

        {/* 電車 */}
        <div className="animate-train-move absolute bottom-4">
          <span className="text-3xl">🚃</span>
        </div>
      </div>

      {/* スピナー */}
      <div className="relative w-20 h-20 mb-6">
        <svg className="w-full h-full animate-spin" viewBox="0 0 80 80">
          <circle
            cx="40" cy="40" r="35"
            fill="none"
            stroke="#FEEBD2"
            strokeWidth="5"
          />
          <circle
            cx="40" cy="40" r="35"
            fill="none"
            stroke="#E53E3E"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray="110 110"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl">
          🗺️
        </span>
      </div>

      <p className="text-lg font-bold text-navy mb-1">
        AIがプランを作成中...
      </p>
      <p className="text-xs text-navy/40 mb-8">
        所要時間の目安：約10〜20秒
      </p>

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
              {/* ステータスアイコン */}
              <div className="shrink-0 w-6 h-6 flex items-center justify-center">
                {done ? (
                  <span
                    className="animate-check-pop text-emerald-500 text-base"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    ✓
                  </span>
                ) : current ? (
                  <div className="w-4 h-4 rounded-full border-2 border-accent border-t-transparent animate-spin" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-navy/15" />
                )}
              </div>

              {/* テキスト */}
              <div className="flex items-center gap-2">
                <span className="text-lg">{step.emoji}</span>
                <span
                  className={`text-sm transition-colors duration-300 ${
                    done
                      ? "text-navy/40 line-through"
                      : current
                        ? "text-navy font-medium"
                        : "text-navy/30"
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
