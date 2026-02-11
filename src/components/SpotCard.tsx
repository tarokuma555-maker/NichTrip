"use client";

import { useState } from "react";
import type { PlanSpot } from "@/lib/types";

export default function SpotCard({
  spot,
  index,
  onLocate,
}: {
  spot: PlanSpot;
  index: number;
  onLocate?: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setOpen((v) => !v)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") setOpen((v) => !v);
      }}
      className="w-full text-left bg-white rounded-2xl border border-warm-200
                 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
    >
      {/* ===== ヘッダー（常に表示） ===== */}
      <div className="px-4 pt-4 pb-3">
        <div className="flex items-start gap-3">
          {/* 番号バッジ */}
          <span className="shrink-0 w-7 h-7 rounded-full bg-sub text-white text-xs font-bold flex items-center justify-center mt-0.5">
            {index}
          </span>

          <div className="flex-1 min-w-0">
            {/* スポット名 + 滞在時間 */}
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-base font-bold text-navy leading-snug">
                {spot.name}
              </h4>
              <span className="shrink-0 flex items-center gap-1 text-xs text-navy/50 bg-warm-100 px-2 py-1 rounded-full">
                <ClockIcon />
                {spot.stay_minutes}分
              </span>
            </div>

            {/* 住所 + 地図ボタン */}
            <div className="flex items-center gap-1.5 mt-0.5">
              <p className="text-xs text-navy/40 truncate">{spot.address}</p>

              {onLocate && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLocate();
                  }}
                  className="shrink-0 flex items-center gap-0.5 text-[11px] text-sub hover:text-sub-dark
                             font-medium transition-colors"
                  aria-label="地図で表示"
                >
                  <PinIcon />
                  地図
                </button>
              )}
            </div>

            {/* アニメシーン（プレビュー1行） */}
            {spot.anime_scene && !open && (
              <p className="text-xs text-accent/70 mt-2 truncate">
                🎬 {spot.anime_scene}
              </p>
            )}
          </div>

          {/* 開閉シェブロン */}
          <svg
            className={`shrink-0 w-5 h-5 text-navy/30 mt-1 transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {/* ===== 展開コンテンツ ===== */}
      <div
        className={`grid transition-all duration-200 ${
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 space-y-3">
            {/* 区切り線 */}
            <div className="border-t border-warm-200" />

            {/* アニメシーン */}
            {spot.anime_scene && (
              <div className="bg-accent/5 border border-accent/10 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <span className="text-sm mt-px">🎬</span>
                  <div>
                    <p className="text-sm font-medium text-accent leading-relaxed">
                      {spot.anime_scene}
                    </p>
                    {spot.episode && (
                      <p className="text-xs text-navy/40 mt-1">
                        📺 {spot.episode}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* アクセス */}
            <DetailRow emoji="🚃" label="アクセス" value={spot.access} />

            {/* ヒント */}
            <DetailRow emoji="💡" label="ヒント" value={spot.tips} />

            {/* グルメ */}
            {spot.nearby_food && (
              <div className="bg-warm-100 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <span className="text-sm mt-px">🍴</span>
                  <div>
                    <p className="text-xs text-navy/50 mb-0.5">近くのグルメ</p>
                    <p className="text-sm font-medium text-navy">
                      {spot.nearby_food.name}
                    </p>
                    <p className="text-xs text-navy/50 mt-0.5">
                      {spot.nearby_food.genre} / {spot.nearby_food.budget}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ========== サブコンポーネント ========== */

function DetailRow({
  emoji,
  label,
  value,
}: {
  emoji: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-sm mt-px">{emoji}</span>
      <div>
        <p className="text-xs text-navy/40">{label}</p>
        <p className="text-sm text-navy/80 leading-relaxed">{value}</p>
      </div>
    </div>
  );
}

function ClockIcon() {
  return (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
        clipRule="evenodd"
      />
    </svg>
  );
}
